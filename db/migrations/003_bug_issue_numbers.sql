create sequence if not exists public.bug_reports_issue_number_seq;

lock table public.bug_reports in share row exclusive mode;

alter table public.bug_reports
  add column if not exists issue_number bigint;

with current_max as (
  select coalesce(max(issue_number), 0) as value
  from public.bug_reports
), numbered as (
  select
    id,
    (select value from current_max) + row_number() over (order by created_at asc, id asc) as issue_number
  from public.bug_reports
  where issue_number is null
)
update public.bug_reports as report
set issue_number = numbered.issue_number
from numbered
where report.id = numbered.id;

select setval(
  'public.bug_reports_issue_number_seq',
  greatest(coalesce((select max(issue_number) from public.bug_reports), 0), 1),
  exists (select 1 from public.bug_reports)
);

alter table public.bug_reports
  alter column issue_number set default nextval('public.bug_reports_issue_number_seq'),
  alter column issue_number set not null;

create unique index if not exists bug_reports_issue_number_idx
  on public.bug_reports (issue_number);
