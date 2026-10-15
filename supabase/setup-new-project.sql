-- Clientelo: FIRST SETUP of a NEW, empty project.
-- Generated from 001-guide.sql + 002-gmail.sql. Use this file OR the two migrations, never both.
-- Contains no contacts, passwords or API keys. Does not send emails.
-- Atomic: any error rolls back the whole setup.
begin;
do $$ begin
  if to_regclass('public.guide_contacts') is not null or to_regclass('public.guide_requests') is not null then
    raise exception 'Clientelo tables already exist. Do not run first setup again.';
  end if;
end $$;

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

commit;
