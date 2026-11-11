# Plan de carga masiva de datos — SportMatch

**Fecha:** 2026-10-31
**Objetivo:** poblar SportMatch con miles de registros que parezcan reales, con partidos repartidos por toda
Argentina, para ver cómo se comporta la app con volumen.
**Entregable de implementación:** `scripts/seed-load.mjs` en **este** repo (`sportmatch-linktree`).

> **REGLA DURA: no se toca el repo `sportmatch`.** No se modifica, no se crea ninguna rama ni commit y no se
> corre nada que escriba en él: ni código, ni schema, ni migraciones, ni `package.json`, ni `.env`. Solo se
> **lee** su `schema.prisma` y sus migraciones (con `git show origin/dev:…`, sin hacer checkout) como
> referencia. Todo lo de la carga vive en `sportmatch-linktree`.

Vocabulario según [`CONTEXT.md`](docs/CONTEXT.md); reglas según [`reglas-de-negocio.md`](docs/reglas-de-negocio.md).

---

## 1. Decisiones

| # | Tema | Decisión |
|---|---|---|
| 0 | Repo de la app | **No se toca** (ver la regla dura de arriba). |
| 1 | Entorno | **Prod, en tres etapas: local → dev → prod.** Solo se carga en prod cuando el checklist de §7 pasó completo en dev. |
| 2 | Volumen | **2.000 usuarios y 10.000 partidos.** El resto (participantes, solicitudes, calificaciones, faltas) sale de eso: ~430k filas, de las cuales ~300k son calificaciones. |
| 3 | Geografía | **~40 ciudades ponderadas por población + jitter gaussiano.** Lista fija dentro del script, sin APIs. |
| 4 | Usuarios | `firebaseUid` falso (no pueden iniciar sesión). Emails con dominios reales (`@gmail.com`, `@hotmail.com`, `@outlook.com`, `@yahoo.com.ar`) y nombres argentinos. **Nada en la UI delata que son sintéticos.** |
| 5 | Fotos | **Todas `null`** (usuarios y partidos). La UI muestra iniciales. |
| 6 | Historia | **90 días hacia atrás y 60 hacia adelante**, con la historia de reputación completa y coherente con las reglas. |
| 7 | Mecanismo | **Un script Node (solo stdlib) genera archivos `.sql` y se cargan con `psql` en una sola transacción.** No pasa por la API porque los usuarios no tienen Firebase, y no usa Prisma porque eso obligaría a tocar el repo de la app. |
| 8 | Ejecución | **La corre un lead en su terminal, una vez por entorno.** La URL de dev o de prod va solo en la shell; nunca pasa por Claude ni por un archivo. Es una excepción puntual al ADR de KPIs ("sin credenciales de DB fuera de Azure"). |
| 9 | Permanencia | **Los datos quedan.** Igual hay un `purge.sql` como salida de emergencia. |
| 10 | Medición | **Vistazo manual** con el checklist de §7, guiado por las hipótesis de §7.4. |

---

## 2. Riesgos aceptados

Las decisiones 1 y 9 tienen costos que el equipo aceptó a sabiendas:

1. **KPIs de Lab4 contaminados.** `team_completion_rate`, `time_to_full`, `no_show_rate`,
   `matches_per_active_user`, `match_cancellation_rate` y `late_withdrawal_rate` se calculan sobre prod y
   van a incluir datos sintéticos desde el día de la carga. Lo publicado en Supabase no se puede corregir.
   **Recomendación:** avisar en el próximo reporte o Steering la fecha desde la que hay datos de carga.
2. **Choque de emails.** `User.email` es único. Si alguien real con un email generado se registra, el alta
   falla. Lo mitiga el sufijo numérico en el email (§4.1). El remedio es `purge.sql` o borrar ese usuario a mano.
3. **Usuarios reales con partidos fantasma.** Van a ver estos partidos en el Mapa y en Descubrir, y van a
   pedir sumarse. Nadie acepta esas solicitudes, que quedan PENDING para siempre. Si un usuario real se baja
   a menos de 2 h, recibe una baja tarde real (2 ★).
4. **El Mapa se vacía solo.** Los partidos futuros sintéticos se van consumiendo de forma pareja (~50 por
   día) y a los 60 días ya pasaron todos: a los 30 días queda la mitad de los pins. Para repoblarlo:
   `purge.sql` y después cargar de nuevo.
5. **Recordatorios.** El cron de 24 h va a procesar ~50 partidos sintéticos por día y crear notificaciones
   para usuarios sintéticos. No sale ningún push porque no tienen `PushSubscription`.
6. **Desfase de schema.** Los nombres de tablas y columnas se copian del `schema.prisma` de `dev` a mano,
   porque no se puede importar nada del repo de la app. Si una migración nueva renombra o agrega una columna
   obligatoria, la carga falla y **no escribe nada**, porque todo corre en una sola transacción. Antes de cada
   corrida se compara la última migración de `origin/dev` con la que figura en el script.

---

## 3. Marca y borrado

- **Una sola marca:** `User.firebaseUid` empieza con `seed_` (`seed_000001` …). Se eligió este campo
  porque es obligatorio, único y nunca sale hacia otros usuarios. Verificado en `dev` (31/10): perfil
  ajeno, búsqueda, listado, plantel, solicitudes y notificaciones devuelven solo `id`, `name`, `photoUrl`,
  `city`, `level` y `sports`. `firebaseUid` y `email` solo aparecen en `GET /users/me`, que devuelve el
  usuario propio, y un sintético nunca inicia sesión. Así que ni siquiera se ve en DevTools.
  **Restricción:** ningún endpoint debe exponer `firebaseUid` de otro usuario. Si alguno lo hace, la marca
  queda a la vista.
- `updatedAt` se escribe igual a `createdAt`. Si no, todas las filas quedarían con la hora de la carga.
- **Ids sin prefijo y con formato cuid** (`c` + 24 caracteres en minúscula), igual que los que genera
  Prisma. Así las URLs (`/partidos/:id`) se ven normales. La base no tiene un default para `id` ni para
  `updatedAt`, porque Prisma los completa del lado del cliente, así que el script los genera.
- Todo lo sintético cuelga de un usuario `seed_`: los partidos por `organizerId` y el resto por `userId`,
  `raterId`, etc.

**`purge.sql`** corre en una transacción, en este orden:

1. `DELETE FROM matches WHERE "organizerId" IN (seed)`. Por cascade se van participantes, solicitudes,
   calificaciones, faltas, bajas tarde y notificaciones de esos partidos, **incluidas las de usuarios reales**.
2. Las filas de usuarios `seed_` en partidos reales: `participants`, `join_requests`, `ratings` (como rater
   y como calificado), `no_show_reports`, `late_withdrawals` y `reports`.
3. `DELETE FROM users WHERE "firebaseUid" LIKE 'seed\_%'`. Por cascade se van `user_sports`,
   notificaciones, etc.

`load.sql` **se niega a correr si ya hay usuarios `seed_`** en la base, así que no se puede duplicar por
error. Para recargar: `purge.sql` y después `load.sql`.

---

## 4. Qué se genera

Todo sale de un PRNG con semilla fija (`--seed`, por defecto `42`), así que dos corridas con la misma
semilla producen los mismos datos. Las listas (nombres, ciudades, clubes) van inline en el script; no se
agrega ninguna dependencia nueva como faker.

### 4.1 Usuarios (2.000)

| Campo | Regla |
|---|---|
| `name` | Nombre y apellido de pools argentinos (~150 de cada uno) |
| `email` | `nombre.apellido` o `nombreapellido` + 2-4 dígitos, todo en minúsculas y sin tildes. Dominios: gmail 60 %, hotmail 20 %, outlook 10 %, yahoo.com.ar 10 %. Únicos dentro de la corrida |
| `firebaseUid` | `seed_` + número con padding |
| `city` | **Ciudad de residencia**, sorteada con los mismos pesos que los partidos (§5) |
| `level` | Principiante 30 % · Intermedio 50 % · Avanzado 20 % |
| `photoUrl` | `null` |
| `onboardedAt` | `createdAt` + unos minutos (si no, la app los manda a la bienvenida) |
| `createdAt` | Entre −180 y −1 días, siempre antes de su primer partido |
| `role` | `USER` |
| `UserSport` | 1-3 deportes, coherentes con los partidos que juega. Los `sportId` se leen de la tabla `sports` (por nombre), no se crean |

### 4.2 Partidos (10.000)

| Campo | Regla |
|---|---|
| `date` | 70 % jugados (−90 a 0 días), 30 % futuros (0 a +60 días, ~50 por día). Hora de Argentina (UTC−3), en :00 o :30. De lunes a viernes, pico entre 18 y 23 h; fines de semana, entre 9 y 21 h |
| `sportId` | Fútbol 45 % · Pádel 25 % · Básquet 12 % · Tenis 10 % · Running 8 % |
| `capacity` | Fútbol 9 / 13 / 21 (F5/F7/F11) · Pádel 3 · Tenis 3 · Básquet 5 o 9 · Running 4-20. El organizador no ocupa cupo. Respeta `CAPACITY_MIN = 2` y `CAPACITY_MAX = 30`: no hay tenis single (sería cupo 1) |
| `level` | El del organizador el 70 % de las veces; si no, uno vecino |
| `organizerId` | Un usuario de la misma ciudad. Distribución de cola larga: pocos organizan mucho, la mayoría organiza 0-2 |
| `location` | De un pool por deporte: `"Club Atlético {X} · Cancha {n}"`, `"Complejo {X} Fútbol 5"`, `"{X} Pádel"`, `"Polideportivo Municipal {Ciudad}"`, `"Parque {X}"` (running). Entre 3 y 120 caracteres |
| `latitude`, `longitude` | Ciudad + jitter (§5). **Nunca `null`** (si no, el partido no aparece en el Mapa) |
| `description` | 50 % `null`; el resto, de unas 30 plantillas por deporte (`"Falta 1 para completar, nivel tranqui"`) |
| `photoUrl` | `null` |
| `createdAt` | `date` − entre 2 h y 7 días |
| `reminderSentAt` | Partidos jugados: `date − 24 h`. Futuros: `null` (el cron se encarga) |
| `status` | 8 % `CANCELED`, con `canceledAt` y `cancelReason` de un pool ("Llueve", "No llegamos a armar", …) |

### 4.3 Plantel y solicitudes

Con el código actual, un `Participant` solo nace al aceptar una `JoinRequest`, y el seed sigue esa regla:

- **Cada participante tiene una `JoinRequest` ACCEPTED** (90 % `REQUEST`, 10 % `INVITATION`), creada antes
  que su `Participant`.
- Los jugadores salen en un 90 % de la ciudad del partido y en un 10 % de otra. Nadie juega dos partidos que
  se superpongan, y el organizador nunca es participante de su propio partido.
- **Partidos jugados:** se completan entre el 60 % y el 100 % del cupo.
- **Partidos futuros:** 25 % completos; el resto, con entre 0 y cupo−1 anotados. Además, 0-3 solicitudes
  `PENDING` y alguna invitación pendiente. También algunas `REJECTED`.
- **`filledAt`:** el `createdAt` del participante que completó el cupo. Si el cupo no se completó, `null`.

### 4.4 Reputación (solo partidos jugados y no cancelados)

| Qué | Regla |
|---|---|
| **Calificaciones** | El 80 % de los anotados más el organizador califican, una vez cada uno, a todos los demás, dentro de las 48 h. Puntajes: 5 ★ 45 % · 4 ★ 35 % · 3 ★ 12 % · 2 ★ 5 % · 1 ★ 3 % |
| **Faltas** | ~2 % de los lugares. Con el 5 % quedaban 221 suspendidos, porque cada usuario juega ~29 partidos en el período. En el 60 % de los casos marca el organizador; en el 40 %, al menos 2 jugadores. Se crean dentro de la ventana de cierre. Si alguien falta, no se crean calificaciones que dé ni que reciba en ese partido |
| **Suspensiones** | No se guardan: salen de las faltas (`suspension.ts`). Se fuerza que 20 usuarios junten 3 faltas en 90 días. Sumando los que llegan solos, en local quedaron 47 con 3 o más |
| **Bajas tarde** | ~3 % de los lugares: una `LateWithdrawal` entre `date − 2 h` y `date`, y ese usuario no queda como participante (la app borra su `Participant` y su `JoinRequest`). Cuando el organizador cancela tarde **no** se crea una fila: la app lo calcula a partir de `canceledAt` (`findCanceledMatchDates`). ~15 % de las cancelaciones son tardías |

### 4.5 Qué no se genera

- **Notificaciones.** Solo las verían los usuarios sintéticos, que no pueden iniciar sesión.
- **`UserActivityDay`, `AiUsage`, `PushSubscription`, `Report`, `KpiRun`.** Nadie los ve en la UI.
- **Fotos.**
- **Deportes.** Se usan los que ya existen en `sports`.

---

## 5. Geografía

El script elige la ciudad según su peso (proporcional a la población) y después suma un jitter gaussiano:
σ = 6 km en ciudades de más de 1M de habitantes y σ = 3 km en el resto.

**Ningún partido cae en el agua.** Antes se invertía el desplazamiento en las ciudades costeras, pero eso
no cubría el Río de la Plata (CABA, AMBA), el Paraná (Rosario, Santa Fe, Paraná, Corrientes, Posadas),
la laguna Setúbal, el Nahuel Huapi, el San Roque ni el Beagle. Ahora cada ciudad tiene una **máscara de
tierra firme**: una grilla de 200 m sobre ±3σ, armada con el agua de OpenStreetMap (costa, `natural=water`,
`riverbank` y `reservoir`). Una celda solo cuenta como tierra si ni ella ni sus 8 vecinas tocan agua (unos
200 m de margen). Si el punto sorteado cae en agua o fuera de la ventana, se vuelve a sortear.

- La máscara (`scripts/seed-land-mask.json`) está versionada, y el generador la lee sin conectarse a nada.
  Se rearma con `node scripts/seed-land-mask.mjs` (Overpass, con cache en `outputs/seed-load/osm/`) **solo**
  si cambian las ciudades o su σ. Si no coincide, el generador aborta.
- `node scripts/seed-land-mask.mjs --check` genera los datos por defecto y valida cada partido contra la
  geometría vectorial de OSM (no contra la grilla): ninguno en agua ni a menos de 100 m de ella.
- Las islas del Delta cuentan como tierra.

Para AMBA se usan cinco centros en lugar de uno solo, así los pins no se amontonan en el Obelisco.

| Ciudad | Lat | Lng | Peso (miles) |
|---|---|---|---|
| CABA | −34.6037 | −58.3816 | 3100 |
| AMBA Norte (San Isidro) | −34.4708 | −58.5286 | 1500 |
| AMBA Oeste (Morón) | −34.6534 | −58.6198 | 2000 |
| AMBA Sur (Lomas de Zamora) | −34.7609 | −58.4063 | 2000 |
| La Plata | −34.9214 | −57.9545 | 900 |
| Córdoba | −31.4201 | −64.1888 | 1600 |
| Rosario | −32.9442 | −60.6505 | 1350 |
| Mendoza | −32.8895 | −68.8458 | 1100 |
| San Miguel de Tucumán | −26.8083 | −65.2176 | 900 |
| Mar del Plata (costa) | −38.0055 | −57.5426 | 650 |
| Salta | −24.7821 | −65.4232 | 620 |
| Santa Fe | −31.6333 | −60.7000 | 530 |
| San Juan | −31.5375 | −68.5364 | 500 |
| Resistencia | −27.4606 | −58.9839 | 400 |
| Santiago del Estero | −27.7951 | −64.2615 | 400 |
| Neuquén | −38.9516 | −68.0591 | 380 |
| Corrientes | −27.4692 | −58.8306 | 380 |
| Posadas | −27.3671 | −55.8961 | 360 |
| San Salvador de Jujuy | −24.1858 | −65.2995 | 330 |
| Bahía Blanca | −38.7196 | −62.2724 | 300 |
| Paraná | −31.7333 | −60.5297 | 270 |
| Formosa | −26.1775 | −58.1781 | 240 |
| San Luis | −33.3017 | −66.3378 | 200 |
| La Rioja | −29.4131 | −66.8558 | 200 |
| Catamarca | −28.4696 | −65.7795 | 200 |
| Comodoro Rivadavia (costa) | −45.8641 | −67.4966 | 180 |
| Río Cuarto | −33.1232 | −64.3493 | 170 |
| Concordia | −31.3929 | −58.0209 | 170 |
| San Carlos de Bariloche | −41.1335 | −71.3103 | 135 |
| San Nicolás | −33.3303 | −60.2269 | 140 |
| Tandil | −37.3217 | −59.1332 | 130 |
| San Rafael | −34.6177 | −68.3301 | 120 |
| Santa Rosa | −36.6167 | −64.2833 | 120 |
| Puerto Madryn (costa) | −42.7692 | −65.0385 | 100 |
| Trelew | −43.2490 | −65.3051 | 100 |
| Río Gallegos (costa) | −51.6230 | −69.2168 | 100 |
| Rafaela | −31.2503 | −61.4867 | 100 |
| Pergamino | −33.8895 | −60.5736 | 100 |
| Junín | −34.5856 | −60.9589 | 95 |
| Villa María | −32.4075 | −63.2402 | 90 |
| Olavarría | −36.8927 | −60.3225 | 90 |
| Ushuaia (costa) | −54.8019 | −68.3030 | 80 |
| Villa Carlos Paz | −31.4241 | −64.4978 | 70 |

Con esta tabla, ~42 % de los partidos caen en AMBA, ~22 % en Córdoba, Rosario, Mendoza y Tucumán, y ~36 % en el resto.
Las coordenadas son aproximadas al centro de cada ciudad, y es suficiente.

---

## 6. El script

Todo vive en `sportmatch-linktree` y no agrega ninguna dependencia.

| Archivo | Qué es |
|---|---|
| `scripts/seed-load.mjs` | Generador en Node 24, solo stdlib. Escribe `outputs/seed-load/load.sql` e imprime los conteos por tabla y por ciudad. **Generar los archivos es el dry run**: no se conecta a ninguna base |
| `outputs/seed-load/load.sql` | Generado, ~60 MB, en ~6 s. Un `COPY … FROM stdin` por tabla, en el orden `users` → `user_sports` → `matches` → `join_requests` → `participants` → `ratings` → `no_show_reports` → `late_withdrawals`. `user_sports` y `matches` pasan por una tabla temporal para resolver `sportId` por nombre en cada entorno. Está en `.gitignore` y `.vercelignore` |
| `scripts/seed-purge.sql` | Estático y versionado: los `DELETE` de §3 |
| `scripts/seed-land-mask.mjs` / `.json` | Máscara de tierra firme por ciudad (§5) y su verificación (`--check`) |
| `tests/seed-load.test.mjs` | `node --test`, como el resto del repo. Corre el generador con una semilla chica (20 usuarios y 100 partidos) y verifica las invariantes: participantes ≤ cupo, organizador fuera del plantel, calificaciones solo dentro de las 48 h, coordenadas dentro del bbox de Argentina y emails únicos |

**Ejecución:** con `psql` desde la imagen `postgres:18-alpine`, la misma del `docker-compose` de la app, así
no hace falta instalar nada. Los dos archivos traen adentro su `BEGIN`/`COMMIT` y `ON_ERROR_STOP`: todo o
nada. **No** hay que pasar `-1`.

**Guards dentro de `load.sql`**, antes de escribir, con `\gset` y `\if` de psql:

1. `current_database()` tiene que ser igual a la variable `-v expected_db=…` que se pasa por línea de
   comandos. Si no, `\quit` sin escribir nada. Esto reemplaza al `--confirm-host`.
2. No tiene que haber usuarios `seed_`. Si los hay, `\quit` (§3).
3. Tienen que existir los 5 deportes en `sports`.

**Schema copiado a mano** del `schema.prisma` de `origin/dev`:

- Tablas en snake_case, por `@@map` (`users`, `join_requests`, …).
- Columnas en camelCase y entre comillas (`"organizerId"`, `"firebaseUid"`).
- Enums: `level`, `match_status`, `join_request_status`, `join_request_origin`.
- El script declara en una constante la última migración contra la que se escribió (hoy
  `20261101144210_add_moderation_actions`) y el runbook la compara antes de cada corrida.

**Antes de escribir** el SQL, el generador valida en memoria las invariantes de §4 y aborta si alguna falla.

---

## 7. Runbook

> **Ojo con la URL de Prisma:** `psql` rechaza el parámetro `?schema=public`. Hay que exportar la URL sin él
> y, en Azure, con `?sslmode=require`. Además, el firewall del servidor de Azure Postgres tiene que permitir
> la IP de quien corre la carga. Se abre solo para la corrida y se cierra después.

### 7.1 Local

Prueba en un Postgres descartable, con las migraciones de la app **leídas** de `origin/dev`, sin hacer
checkout ni escribir en el repo `sportmatch`.

```bash
node scripts/seed-load.mjs                         # genera load.sql e imprime conteos

MIG=$(mktemp -d)
git -C ../sportmatch archive origin/dev back/prisma/migrations | tar -x -C "$MIG"
docker run -d --name sm-load -e POSTGRES_PASSWORD=x -p 5433:5432 postgres:18-alpine
for f in "$MIG"/back/prisma/migrations/*/migration.sql; do
  docker exec -i sm-load psql -U postgres -v ON_ERROR_STOP=1 -q < "$f"
done
# los 5 deportes, como hace el seed de la app
docker exec -i sm-load psql -U postgres -c "INSERT INTO sports (id, name, \"updatedAt\") SELECT 'c'||substr(md5(n),1,24), n, now() FROM unnest(ARRAY['FUTBOL','BASQUET','TENIS','PADEL','RUNNING']) n"

docker exec -i sm-load psql -U postgres -q -v expected_db=postgres < outputs/seed-load/load.sql
docker exec -i sm-load psql -U postgres -q -v expected_db=postgres < scripts/seed-purge.sql   # probar el purge
docker rm -f sm-load
```

**Resultado en local (31/10):** carga en ~70 s y purge en ~80 s. Funcionaron los tres guards (sin
`expected_db`, base equivocada y recarga con `seed_` existentes) y la recarga después del purge. El purge
no toca `sports`. Quedaron 2.854 partidos futuros activos, todos con coordenadas dentro de Argentina (lat
−54.8 a −24.1, lng −71.4 a −55.8), y 47 usuarios con 3 o más faltas. Los organizadores más activos
recibieron ~450 calificaciones, con puntajes de 4,1-4,2.

**Resultado en local (11/11), con las migraciones de `origin/main` y la máscara de tierra:** carga en ~50 s
y purge en ~25 s. El purge pasa aunque un admin haya moderado a un sintético (`moderation_actions`). La
recarga funciona. `--check`: 0 partidos en agua y la distancia mínima al agua es 217 m.

Esta etapa sirve para ajustar el generador y para revisar los datos con queries SQL (conteos, faltas por
usuario, distribución por ciudad). La UI se prueba en dev.

### 7.2 Dev (ensayo general, obligatorio antes de prod)

Se usa la misma semilla y el mismo commit del script que después van a prod.

1. Comparar la última migración: `git -C ../sportmatch ls-tree --name-only origin/dev back/prisma/migrations/`
   contra la constante del script. Si hay una más nueva, revisar el schema antes de seguir.
2. En una shell nueva, sin `.env`: `export DATABASE_URL='<dev, sin ?schema=public>'`.
3. Cargar y **anotar cuánto tardó**:
   ```bash
   docker run --rm -i -e DATABASE_URL postgres:18-alpine \
     sh -c 'psql "$DATABASE_URL" -q -v expected_db=<db-dev>' < outputs/seed-load/load.sql
   ```
4. Probar `scripts/seed-purge.sql` con el mismo comando y volver a cargar `load.sql`, para comprobar que
   el rollback funciona antes de necesitarlo en prod.
5. `unset DATABASE_URL` y cerrar la regla del firewall.
6. Recorrer el **checklist completo** de §7.4 contra el front y el back desplegados en dev.

**Estado en dev (31/10):** carga ✅ (`2000 | 10000`, schema hasta `20261026184358_add_ai_usage`,
verificado contra GitHub). Pendientes: probar purge y recarga (paso 4) y el checklist (paso 6).

**Bloqueo del checklist (31/10):** el login con Google en dev falla con `Database is closing/hidden` y
`401 Missing session`. **No tiene relación con la carga:** viene de SPO-301 (sesión en cookie httpOnly,
PR #158/#159, mergeado a dev hoy a las 13:50 UTC; su smoke test de login figura como "Pendiente"). El
back de dev responde bien (`/health` → `db: up`). Se informa al autor del PR; el arreglo va por el repo
de la app.

**Actualización (11/11):** se mergeó el release `dev` → `main` (PR #180). Hasta entonces, prod estaba en
el schema del 08/10, sin `role`, `onboardedAt` ni `reminderSentAt`, y la carga habría fallado. Ahora `main`
y `dev` tienen las mismas migraciones, hasta `20261101144210_add_moderation_actions`. Esa migración agrega
`moderation_actions`, con FK `RESTRICT` a `users`, así que el purge la borra antes que a los usuarios. Entran
también SPO-313 (el Mapa pide solo la zona visible) y SPO-314 (Descubrir de a 30): cambian las hipótesis de
`findUpcoming` en §7.4. **El gate de dev se corre de nuevo con este código.**

**Gate para pasar a prod:** todos los ítems del checklist en dev quedan tildados, o quedan anotados con una
decisión explícita del equipo ("es lento, pero vamos igual"). Si el checklist encuentra algo que rompe la
app, se arregla primero en la app (por el flujo normal de ese repo, fuera de este plan) y se vuelve a
pasar por dev.

### 7.3 Prod (una sola vez, después de dev)

1. Verificar que el servidor de Azure Postgres tenga **point-in-time restore** activo y anotar la hora. Ese
   es el rollback de verdad.
2. Repetir el paso 1 de dev, pero contra **`origin/main`**, que es la rama que se despliega en prod
   (`pipeline.yml`). Además, el último run de `Pipeline` en `main` tiene que estar en verde.
3. En una shell nueva, sin `.env`: `export DATABASE_URL='<prod, sin ?schema=public>'`.
4. **Regenerar `load.sql` el mismo día de la carga**, con la misma semilla. Las fechas son relativas al
   momento en que se genera; un archivo de hace días carga partidos "futuros" que ya pasaron, sin
   calificaciones. Los conteos tienen que ser parecidos a los de dev (±2 %). Después, cargar con
   `-v expected_db=<db-prod>`.
5. `unset DATABASE_URL`, cerrar la shell y cerrar la regla del firewall.
6. Avisar en el canal del equipo la fecha y la hora de la carga (es la nota del riesgo 1).

### 7.4 Checklist manual

Se recorre **primero en dev**, donde funciona como gate para prod, y se repite en prod después de la carga.
Se usa la cuenta real de cada integrante del equipo:

- [ ] El **Mapa** carga con ~2,1k pins (los futuros activos con lugar) repartidos por todo el país, sin pins en el mar. Zoom y paneo se sienten fluidos.
- [ ] Filtro **Cerca** en CABA: responde en un tiempo razonable.
- [ ] Los filtros **Día, Nivel y Deporte** combinados funcionan.
- [ ] **Descubrir** trae tarjetas variadas, sin repetidos y en un tiempo razonable.
- [ ] **Perfil ajeno** de un organizador con mucha historia: puntaje con decimal, "Faltas (90 días)" y partidos jugados.
- [ ] **Buscar usuario** para invitar: responde rápido y trae nombres argentinos.
- [ ] El **link compartible** de un partido sintético abre sin cuenta y muestra al organizador con sus iniciales.
- [ ] Crear un partido real y pedir sumarse a otro real sigue funcionando igual.
- [ ] `/notificaciones` de una cuenta real no cambió.
- [ ] La corrida de KPIs de las 01:15 del día siguiente termina bien (no hay timeout del snapshot).
- [ ] Opcional: mirar si el `health_latency_p95` del reporte diario se movió después de la carga.

**Hipótesis: dónde esperamos que duela.** Lectura del código de `origin/dev` del 31/10. Encontrar estos
puntos es justamente el objetivo de la prueba.

| Dónde | Por qué puede doler con volumen |
|---|---|
| Mapa y Descubrir (`findUpcoming`) | No tiene `take` ni filtro por zona: trae **todos** los partidos futuros activos del país (~2,9k) con sus relaciones, y recién después descarta en Node los que están llenos |
| Filtro "Cerca" | Calcula `distanceKm` en Node, después de traer los ~2,9k |
| Render del Mapa | ~2,1k markers de Google Maps sin clustering |
| Orden por compatibilidad (`sortByCompatibility`) | **Probablemente el peor.** Mapa y Descubrir usan el mismo endpoint, y en **cada** request se calcula el puntaje de todos los organizadores de esos partidos (`getScores`). Eso trae todas sus calificaciones recibidas (del orden de 100k filas) y las procesa en Node |
| `GET /users` | Sin paginar: devuelve los 2k+ usuarios |
| Perfil ajeno (`findPlayedBy`) | Sin límite: todos los partidos jugados del usuario |
| Snapshot de KPIs | `findMatchesBetween` y `findUsersCreatedBefore` cargan todo en memoria |
| Índices | `matches` solo tiene índices en `date` y `sportId`; no en `organizerId` ni `status` |

Anotar en este documento qué pantalla se sintió lenta. Eso decide el trabajo siguiente, que se hace en el
repo de la app por su flujo normal: paginación o bbox en el Mapa, clustering, índices, cache de puntajes.

---

## 8. Fuera de alcance

- **Cualquier cambio en el repo `sportmatch`.**
- Pruebas de carga con tráfico concurrente (k6, autocannon). Aquí solo se carga **volumen de datos**.
- Fotos, notificaciones y usuarios con login real.
- Refresco automático de los partidos futuros. Por ahora se recarga a mano (riesgo 4).
