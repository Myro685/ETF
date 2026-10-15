-- Read-only verification: no contacts are selected, inserted or deleted.
select jobid, jobname, schedule, active, command
from cron.job
where jobname = 'clientelo-contact-retention';

select d.status, d.return_message, d.start_time, d.end_time
from cron.job_run_details d
join cron.job j on j.jobid = d.jobid
where j.jobname = 'clientelo-contact-retention'
order by d.start_time desc
limit 5;
