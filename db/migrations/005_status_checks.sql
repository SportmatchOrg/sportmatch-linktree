-- Una fila por target y por corrida del cron de status (cada 5 min).
-- 3 targets x 288 corridas/día ≈ 315k filas/año: no hace falta agregarlas todavía.
create table if not exists public.status_checks (
  id bigint generated always as identity primary key,
  target text not null check (char_length(target) between 1 and 40),
  checked_at timestamptz not null default now(),
  ok boolean not null,
  status smallint not null,
  ms integer not null check (ms >= 0)
);

create index if not exists status_checks_target_time_idx
  on public.status_checks (target, checked_at);
