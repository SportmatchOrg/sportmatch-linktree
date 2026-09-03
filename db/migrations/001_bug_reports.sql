create extension if not exists pgcrypto;

create table if not exists public.bug_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text not null check (char_length(description) between 1 and 5000),
  source_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bug_attachments (
  id uuid primary key default gen_random_uuid(),
  bug_id uuid not null references public.bug_reports(id) on delete cascade,
  storage_key text not null unique,
  public_url text not null,
  original_name text not null,
  mime_type text not null check (mime_type in (
    'image/png',
    'image/jpeg',
    'image/webp',
    'text/markdown',
    'application/pdf'
  )),
  size_bytes integer not null check (size_bytes between 1 and 10485760),
  upload_state text not null default 'pending'
    check (upload_state in ('pending', 'ready')),
  created_at timestamptz not null default now()
);

create index if not exists bug_reports_created_at_idx
  on public.bug_reports (created_at desc);

create index if not exists bug_reports_source_created_idx
  on public.bug_reports (source_hash, created_at desc);

create index if not exists bug_attachments_bug_id_idx
  on public.bug_attachments (bug_id);

revoke all on public.bug_reports from public;
revoke all on public.bug_attachments from public;
