alter table public.bug_reports
  add column if not exists is_done boolean not null default false;

create index if not exists bug_reports_open_issue_number_idx
  on public.bug_reports (issue_number)
  where is_done = false;
