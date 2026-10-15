-- Run once after 001-guide.sql. Preserve the Resend path, freeze each request's provider.
alter table public.guide_requests
  add column mail_provider text not null default 'resend' check (mail_provider in ('resend', 'gmail')),
  add column gmail_send_started_at timestamptz;

alter function public.register_guide_request(uuid,text,text,text,text,text)
  rename to register_guide_request_internal;
revoke all on function public.register_guide_request_internal(uuid,text,text,text,text,text) from service_role;

create function public.register_guide_request(p_id uuid, p_email text, p_notice_version text,
  p_download_url text, p_from_email text, p_contact_email text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(p_email, 0));
  if exists(select 1 from public.guide_requests where id=p_id and mail_provider <> 'resend') then
    return jsonb_build_object('code', 'invalid_request');
  end if;
  return public.register_guide_request_internal(p_id,p_email,p_notice_version,p_download_url,p_from_email,p_contact_email);
end $$;

create function public.register_gmail_guide_request(p_id uuid, p_email text, p_notice_version text,
  p_download_url text, p_from_email text, p_contact_email text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare existed boolean; result jsonb;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_email, 0));
  select exists(select 1 from public.guide_requests where id=p_id) into existed;
  if existed and exists(select 1 from public.guide_requests where id=p_id and mail_provider <> 'gmail') then
    return jsonb_build_object('code', 'invalid_request');
  end if;
  result := public.register_guide_request_internal(p_id,p_email,p_notice_version,p_download_url,p_from_email,p_contact_email);
  if not existed and not (result ? 'code') then
    update public.guide_requests set mail_provider='gmail' where id=p_id;
    result := result || jsonb_build_object('mail_provider', 'gmail');
  end if;
  return result;
end $$;

-- At most one application send attempt for this request. An ambiguous outcome is never re-sent.
create function public.claim_gmail_guide_request(p_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare job public.guide_requests%rowtype;
begin
  select * into job from public.guide_requests where id=p_id for update;
  if not found or job.mail_provider <> 'gmail' then raise exception 'Unknown Gmail request'; end if;
  if job.mail_id is not null then return jsonb_build_object('claimed',false,'mail_id',job.mail_id); end if;
  if job.gmail_send_started_at is not null then return jsonb_build_object('claimed',false); end if;
  update public.guide_requests set gmail_send_started_at=now() where id=p_id;
  return jsonb_build_object('claimed',true);
end $$;

revoke all on function public.register_guide_request(uuid,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.register_gmail_guide_request(uuid,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.claim_gmail_guide_request(uuid) from public, anon, authenticated;
grant execute on function public.register_guide_request(uuid,text,text,text,text,text) to service_role;
grant execute on function public.register_gmail_guide_request(uuid,text,text,text,text,text) to service_role;
grant execute on function public.claim_gmail_guide_request(uuid) to service_role;
