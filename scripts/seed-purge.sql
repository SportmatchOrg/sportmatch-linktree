-- Borra todo lo cargado por scripts/seed-load.mjs (usuarios con firebaseUid 'seed_…' y lo que cuelga de ellos).
-- Ver plan-data.md §3. Uso: psql "$DATABASE_URL" -v expected_db=<base> < scripts/seed-purge.sql
\set ON_ERROR_STOP on
\if :{?expected_db}
\else
  \echo 'ABORT: falta -v expected_db=<nombre de la base>'
  \quit
\endif
SELECT current_database() = :'expected_db' AS db_ok, current_database() AS db_name \gset
\if :db_ok
\else
  \echo 'ABORT: la base es' :'db_name' 'y se esperaba' :'expected_db'
  \quit
\endif

BEGIN;

CREATE TEMP TABLE _seed ON COMMIT DROP AS
  SELECT id FROM users WHERE "firebaseUid" LIKE 'seed\_%';

-- 1. Partidos sintéticos: el cascade se lleva plantel, solicitudes, calificaciones, faltas, bajas y
--    notificaciones, incluidas las de usuarios reales en esos partidos. Los reports quedan con matchId NULL.
DELETE FROM matches WHERE "organizerId" IN (SELECT id FROM _seed);

-- 2. Rastros de usuarios sintéticos en partidos reales
DELETE FROM participants     WHERE "userId" IN (SELECT id FROM _seed);
DELETE FROM join_requests    WHERE "userId" IN (SELECT id FROM _seed);
DELETE FROM ratings          WHERE "raterId" IN (SELECT id FROM _seed) OR "ratedUserId" IN (SELECT id FROM _seed);
DELETE FROM no_show_reports  WHERE "reporterId" IN (SELECT id FROM _seed) OR "reportedUserId" IN (SELECT id FROM _seed);
DELETE FROM late_withdrawals WHERE "userId" IN (SELECT id FROM _seed);
DELETE FROM reports          WHERE "reporterId" IN (SELECT id FROM _seed) OR "reportedUserId" IN (SELECT id FROM _seed);

-- 3. Los usuarios: el cascade se lleva user_sports, notificaciones, actividad, push y uso de IA
DELETE FROM users WHERE id IN (SELECT id FROM _seed);

COMMIT;
\echo 'OK: purge completo'
SELECT count(*) AS seed_users_restantes FROM users WHERE "firebaseUid" LIKE 'seed\_%';
