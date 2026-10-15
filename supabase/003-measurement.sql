-- Run after 001 + 002. No public read/write access. No emails or arbitrary metadata.
begin;
create table public.measurement_events (
  session_id uuid not null,
  event text not null check(event in ('page_view','calculator_use','quiz_use','guide_cta','form_start','form_success','contact_acquired')),
  variant text not null check(variant in ('direct','ad_a_rozdily','ad_b_naklady','other')),
  created_at timestamptz not null default now(),
  primary key(session_id,event)
);
create index measurement_events_created on public.measurement_events(created_at);
alter table public.measurement_events enable row level security;
revoke all on public.measurement_events from public, anon, authenticated;
grant select on public.measurement_events to service_role;
alter table public.guide_requests add column measurement_recorded boolean not null default false;
alter table public.guide_contacts add column measurement_acquired boolean not null default false;

create function public.record_measurement(p_session uuid,p_variant text,p_event text,p_request uuid default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare original_variant text; job public.guide_requests%rowtype; is_new boolean; job_email text; acquired boolean;
begin
  if p_variant not in ('direct','ad_a_rozdily','ad_b_naklady','other') or
    p_event not in ('page_view','calculator_use','quiz_use','guide_cta','form_start','form_success') or
    (p_event='form_success' and p_request is null) or (p_event<>'form_success' and p_request is not null)
    then return jsonb_build_object('ok',false); end if;
  -- Serialize session creation/deduplication; first-touch attribution is immutable.
  perform pg_advisory_xact_lock(hashtextextended(p_session::text, 28));
  select variant into original_variant from public.measurement_events where session_id=p_session and event='page_view';
  if original_variant is null then
    -- Global safety ceiling against unlimited fabricated session IDs. No IP tracking.
    perform pg_advisory_xact_lock(28003);
    if (select count(*) from public.measurement_events where event='page_view' and created_at>=current_date)>=10000
      then return jsonb_build_object('ok',false); end if;
    original_variant := p_variant;
    insert into public.measurement_events(session_id,event,variant) values(p_session,'page_view',original_variant);
  end if;
  if p_event='form_success' then
    select email into job_email from public.guide_requests where id=p_request;
    if job_email is null then return jsonb_build_object('ok',false); end if;
    -- Same order as the delivery RPCs: email lock before request row lock.
    perform pg_advisory_xact_lock(hashtextextended(job_email,0));
    select * into job from public.guide_requests where id=p_request for update;
    if not found or job.mail_id is null then return jsonb_build_object('ok',false); end if;
    if job.measurement_recorded then return jsonb_build_object('ok',true); end if;
    select measurement_acquired into acquired from public.guide_contacts where email=job.email for update;
    -- New successful contact within the retained request history, not a repeated PDF request.
    is_new := not acquired and not exists(select 1 from public.guide_requests r where r.email=job.email and r.id<>job.id
      and r.mail_id is not null and (r.created_at,r.id)<(job.created_at,job.id));
    insert into public.measurement_events(session_id,event,variant) values(p_session,'form_success',original_variant) on conflict do nothing;
    if is_new then
      insert into public.measurement_events(session_id,event,variant) values(p_session,'contact_acquired',original_variant) on conflict do nothing;
    end if;
    update public.guide_requests set measurement_recorded=true where id=p_request;
    update public.guide_contacts set measurement_acquired=true where email=job.email;
  else
    insert into public.measurement_events(session_id,event,variant) values(p_session,p_event,original_variant) on conflict do nothing;
  end if;
  return jsonb_build_object('ok',true);
end $$;
revoke all on function public.record_measurement(uuid,text,text,uuid) from public,anon,authenticated;
grant execute on function public.record_measurement(uuid,text,text,uuid) to service_role;

create function public.purge_expired_measurement() returns void language sql security definer set search_path='' as $$
  delete from public.measurement_events where created_at < now()-interval '30 days';
$$;
revoke all on function public.purge_expired_measurement() from public,anon,authenticated;
grant execute on function public.purge_expired_measurement() to service_role;
-- Existing Supabase pg_cron, already enabled for contact retention.
select cron.schedule('clientelo-measurement-retention','10 * * * *','select public.purge_expired_measurement()');
commit;
