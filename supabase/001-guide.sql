-- Run once in the selected Supabase project. No browser role can read contacts or execute these RPCs.
create table public.guide_contacts (
  email text primary key,
  created_at timestamptz not null default now(),
  notice_version text not null,
  expires_at timestamptz not null default now() + interval '30 days'
);
create table public.guide_requests (
  id uuid primary key,
  email text not null references public.guide_contacts(email) on delete cascade,
  created_at timestamptz not null default now(),
  notice_version text not null,
  download_url text not null,
  from_email text not null,
  contact_email text not null,
  mail_id text
);
create index guide_requests_email_date on public.guide_requests (email, created_at);
alter table public.guide_contacts enable row level security;
alter table public.guide_requests enable row level security;
revoke all on public.guide_contacts, public.guide_requests from anon, authenticated;

create function public.register_guide_request(p_id uuid, p_email text, p_notice_version text,
  p_download_url text, p_from_email text, p_contact_email text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare job public.guide_requests%rowtype;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_email, 0));
  select * into job from public.guide_requests where id = p_id;
  if found then
    if job.email <> p_email then return jsonb_build_object('code', 'invalid_request'); end if;
    if job.mail_id is not null then return to_jsonb(job); end if;
    if job.created_at < now() - interval '23 hours' then return jsonb_build_object('code', 'expired'); end if;
    return to_jsonb(job);
  end if;
  if (select count(*) from public.guide_requests where email = p_email and created_at > now() - interval '1 hour') >= 3
    then return jsonb_build_object('code', 'rate_limited'); end if;
  insert into public.guide_contacts(email, notice_version) values (p_email, p_notice_version)
    on conflict (email) do update set notice_version = excluded.notice_version, expires_at = now() + interval '30 days';
  insert into public.guide_requests(id, email, notice_version, download_url, from_email, contact_email)
    values(p_id, p_email, p_notice_version, p_download_url, p_from_email, p_contact_email) returning * into job;
  return to_jsonb(job);
end $$;

create function public.complete_guide_request(p_id uuid, p_mail_id text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  update public.guide_requests set mail_id = p_mail_id where id = p_id;
  if not found then raise exception 'Unknown request'; end if;
  return jsonb_build_object('ok', true);
end $$;

create function public.purge_expired_guide_contacts()
returns void language sql security definer set search_path = '' as $$
  delete from public.guide_contacts where expires_at <= now();
$$;

revoke all on function public.register_guide_request(uuid,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.complete_guide_request(uuid,text) from public, anon, authenticated;
revoke all on function public.purge_expired_guide_contacts() from public, anon, authenticated;
grant execute on function public.register_guide_request(uuid,text,text,text,text,text) to service_role;
grant execute on function public.complete_guide_request(uuid,text) to service_role;
grant execute on function public.purge_expired_guide_contacts() to service_role;

-- Configure hourly cleanup through Supabase Cron after enabling pg_cron:
-- select cron.schedule('clientelo-contact-retention', '0 * * * *', 'select public.purge_expired_guide_contacts()');
