# ADR: Reporte diario de KPIs de SportMatch

**Fecha:** 2026-10-06  
**Equipo:** 11 - SportMatch  
**Escenario:** 2 (alternativa a Dataverse)

## Context

Lab4 exige reportar a diario 5–10 KPIs mediante código, sin agentes de IA operativos y sin mover fecha ni capacidad. Los equipos 9–16 acordaron la Opción A: Postgres en Supabase, catálogo por proyecto, mediciones inmutables, clave `X-Project-Key` por proyecto y ambiente, y `POST /rest/v1/measurement` en lote.

SportMatch usa Next.js, NestJS, Prisma y PostgreSQL en Azure; `dev` integra y `main` produce. Ya guardaba partidos, participantes, cancelaciones, faltas y bajas tardías, pero no el momento en que un partido completa cupo ni la actividad diaria de los usuarios. El repo `agents-copilot` ya corre en GitHub Actions los agentes de calidad, seguridad y CI del equipo.

## Decision Drivers

- 10 KPIs diarios (7 de negocio, 2 técnicos, 1 de salud) con las reglas de negocio en un solo lugar.
- Reporter independiente del uptime del servicio medido, si está caído podemos reportar igual, con logs, reintento y disparo manual.
- Impacto acotado sobre Lab2 (≤ 6 h) y sin credenciales de base de datos fuera de Azure, ya que solicitamos a el back la generación de los KPIs. El workflow nunca toca la base de SportMatch. 
- Cuando un KPI resulta en `NO_DATA` nunca equivale a 0; trazabilidad por `run_id`; idempotencia; mínimo privilegio.
- Alerta a los leads sin que tengan que mirar GitHub Actions.



## Options Considered

1. **Workflow de Actions + endpoint de cálculo en el back (elegida).** El back calcula y guarda los KPIs de negocio con sus propias reglas; el workflow solo orquesta, mide lo externo y publica. Independiente de Azure, sin acceso a la base.
2. **Cron dentro de NestJS/Azure.** Un solo componente, pero el servicio se mide a sí mismo (no detecta su propia caída), exige controlar réplicas y reinicios, y los secretos del dashboard viven en producción.
3. **Workflow que lee la base directamente.** Evita el endpoint, pero expone una `DATABASE_URL` fuera de Azure y duplica en Python las reglas de negocio ya escritas en TypeScript.
4. **Script manual.** Casi sin preparación, pero depende de una persona y pierde días y trazabilidad.



## Proposed Decision

**Flujo.** El workflow `kpi-report` de `agents-copilot` (Python estándar, sin dependencias ni modelos) corre a las 01:15 de Buenos Aires sobre el día anterior:

1. Hace 20 `GET /health` y calcula latencia p95 y alcanzabilidad.
2. Lee de la API de GitHub los PRs mergeados y compara su fecha de apertura con su fecha de merge.
3. Llama `POST /kpis/snapshots` (con header `X-Kpi-Key`), donde el back calcula los 7 KPIs de negocio y persiste la corrida en `kpi_runs`/`kpi_results`.
4. Si los 10 están `READY`, publica un único lote en Supabase con `run_id` y unicidad `(project_id, kpi_id, date, env)`.
5. Modos: `dry-run`, `report` y `catalog` (alta de los 10 KPIs, una vez por ambiente); el input `env` elige `dev` o `prod`; el `schedule` se habilita tras el primer reporte manual exitoso en `prod`.

**Contrato.** `kpi-catalog.json`, versionado en el repo, es la fuente del catálogo (id, tipo, unidad UCUM, descripción, justificación). Los ids son definitivos: un KPI no se renombra, se retira y se crea otro. Cambios al catálogo o al cálculo van por PR; el cambio del esquema del estándar lo gobierna el repo de la cátedra.

**Seguridad.** Secretos en los Environments `dev`/`prod`: 

- `KPI_API_KEY` (comunicación interna entre servicios SportMatch) y `KPI_PROJECT_KEY` (comunicación externa)
- Un PAT fine-grained de solo lectura (minimo privilegio) de PRs sobre `sportmatch` y el webhook de Discord para notificar a los leads en caso de falla. 
- Ningún secreto llega a logs: los errores son códigos (`BACK_HTTP_503`, `SUPABASE_HTTP_409`).

**Fallas.** La publicación es **atómica**: un KPI `ERROR` o `NO_DATA` bloquea el lote, el job queda rojo y Discord informa los KPIs afectados y la corrida.  
Se asume el costo: sin muestra suficiente (p. ej. ningún partido completó cupo) ese día no suma nota, a cambio de no publicar nunca un valor engañoso, porque el dashboard no permite corregir.

## KPIs seleccionados

La frecuencia es diaria con una medicion de ventana móvil de 30 días salvo indicación.


| KPI                       | Tipo      | Fuente y cálculo                                                                                                             | Unidad         | Justificación                                           |
| ------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------- |
| `team_completion_rate`    | Business  | Back: (partidos activos con participantes ≥ cupo) / partidos activos; el organizador no ocupa cupo                           | %              | Charter: ¿SportMatch completa equipos?                  |
| `time_to_full`            | Business  | Back: mediana de `filledAt − createdAt` en partidos activos que completaron                                                  | h              | Charter: velocidad de armado                            |
| `user_return_rate`        | Business  | Back: días activos / días observables posalta (`UserActivityDay`), media ponderada                                           | %              | Retorno sin esperar D7/D30                              |
| `no_show_rate`            | Business  | Back: faltas confirmadas (organizador o 2 jugadores) / plantel, tras cerrar 48 h                                             | %              | Charter: comunidad y reputación                         |
| `matches_per_active_user` | Business  | Back: asistencias / usuarios con ≥ 1 asistencia (excluye cancelados, bajas tardías y faltas)                                 | {match}/{user} | Charter: engagement real                                |
| `match_cancellation_rate` | Business  | Back: cancelados / todos los partidos con fecha en la ventana                                                                | %              | Oferta que no se concreta                               |
| `late_withdrawal_rate`    | Business  | Back: pares usuario–partido con baja < 2 h / (esos pares ∪ participantes finales)                                            | %              | Abandono cercano al inicio                              |
| `health_latency_p95`      | Technical | Workflow: p95 (rango más cercano) de 20 `GET /health` a prod; las fallas cuentan su duración o 10 000 ms; solo el día medido | ms             | Degradación y arranques en frío que el promedio esconde |
| `pr_lead_time`            | Technical | Workflow: mediana `mergedAt − createdAt` de PRs humanos a `dev`                                                              | h              | Velocidad de revisión e integración                     |
| `api_reachable`           | Health    | Workflow: 1 si al menos una de las 20 llamadas dio 200 con la base arriba, 0 si ninguna; solo el día medido                  | 1              | Cadena backend–PostgreSQL vista desde afuera            |




## Impact on Current Project

**Se agrega (Lab2):** columna `Match.filledAt`, tabla `UserActivityDay`, modelos `KpiRun`/`KpiResult`, funciones puras de los 7 KPIs, endpoint `POST /kpis/snapshots` con guard y variable `KPI_API_KEY` (SPO-276, SPO-277). 

**Se agrega (Lab4):** workflow, script, catálogo, alta en el dashboard, alerta Discord y este ADR. 

**Se modifica:** aceptar solicitudes y editar capacidad ahora fijan `filledAt` (una vez, inmutable); el flujo autenticado registra una fila de actividad por usuario y día, sin rutas ni datos personales; secretos y Environments de CI. Sin backfill: `time_to_full` y `user_return_rate` serán `NO_DATA` hasta que haya muestra.

**Se difiere:** SPO-249 (bugs visuales, 1 h) y SPO-250 (refresco con TanStack Query, 3 h) pasan a una iteración posterior. Además, se despriorizó el paquete de trabajo *Perfil de usuario* para abordar el challenge: sus dos issues pendientes, SPO-278 y SPO-279 (1 h cada uno), pasan a la semana siguiente. Esto mueve levemente el cronograma, pero no afecta el camino crítico. 

**Por qué ellos:** SPO-249 y SPO-250 no dependen del flujo central ni de las fuentes de los KPIs; su costo es cosmético o tiene alternativa (recarga manual). SPO-278 y SPO-279 no forman parte del camino crítico. No se tocaron notificaciones, partidos ni reputación porque alimentan los KPIs de negocio. Quedan fuera dashboard propio, endpoints públicos y reintentos automáticos (un día fallido se reenvía con `date`, pero no suma nota).

**Horas:** 

- **Lab2: 6 h** (instrumentación y endpoint, compensadas con las 6 h diferidas)
- **Lab4: 6 h** (workflow, integración, alertas, ADR).

