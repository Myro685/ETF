-- Read-only, private SQL Editor. Adjust dates (UTC). Cohort = visits started in this range.
-- Exclude QC sessions listed in private-data/measurement-qc.json when applicable.
with cohort as (
  select session_id,variant from public.measurement_events
  where event='page_view' and created_at >= now()-interval '7 days'
), counts as (
  select c.variant,count(*) filter(where e.event='page_view') visits,
    count(*) filter(where e.event='calculator_use') calculator,
    count(*) filter(where e.event='quiz_use') quiz,
    count(*) filter(where e.event='guide_cta') cta,
    count(*) filter(where e.event='form_start') form_starts,
    count(*) filter(where e.event='form_success') form_successes,
    count(*) filter(where e.event='contact_acquired') new_contacts
  from cohort c join public.measurement_events e using(session_id) group by c.variant
)
select *,round(100.0*new_contacts/nullif(visits,0),2) conversion_percent,
  round(100.0*form_successes/nullif(form_starts,0),2) form_completion_percent
from counts order by variant;
