# Tickets · Backlog al 30/09 (después de SPO-246)

> Borrador del PO para revisar antes de cargar en Linear. Van todos a **Backlog**, **sin assignee ni `dueDate`**,
> con label, estimate, **milestone** y relaciones "blocked by". El PO elige cada semana cuáles entran.
> Reglas: [`docs/reglas-de-negocio.md`](../../reglas-de-negocio.md) (§10–13 nuevas) · Glosario:
> [`docs/CONTEXT.md`](../../CONTEXT.md).
> Los números `SPO-###` son los que les va a dar Linear si se crean en este orden; se verifican al cargar.

## Resumen · 28 tickets · 51 SP

| Ticket | Título | SP | Label | Milestone | WBS | Bloqueado por |
|---|---|---:|---|---|---|---|
| **Bugs sueltos** | | | | | | |
| SPO-247 | BUG-4 · Scrollbar duplicada en el paso "Horario" | 1 | Frontend · Bug | 6 · Gestión de Partidos | 6.2.1 | — |
| SPO-248 | BUG-10 · La foto de perfil de Google se ve pixelada | 1 | Frontend · Bug | 5 · Perfil de Usuario | 5.2.1 | — |
| SPO-249 | BUG-11 · Descubrir: más aire arriba y abajo | 1 | Frontend · Bug | 7 · Sistema de Matchmaking | 7.2.2 | — |
| SPO-250 | BUG-9 · TanStack Query: datos que se refrescan solos | 3 | Frontend · Bug | 6 · Gestión de Partidos | 6.3.4 | — |
| SPO-251 | Al arrastrar el pin del lugar, la dirección se actualiza | 1 | Frontend · Bug | 7 · Sistema de Matchmaking | 7.3.1 | — |
| **Gaps de la auditoría de la semana 8** | | | | | | |
| SPO-252 | Documentar la configuración de Google Maps | 1 | Infra | 10 · Documentación Final | 10.2.1 | — |
| SPO-253 | Puntaje de varios usuarios en una sola pasada (`getScores`) | 2 | Backend | 5 · Perfil de Usuario | 5.1.4 | SPO-234 |
| SPO-254 | Una sola consulta de reportes de faltas | 1 | Backend | 6 · Gestión de Partidos | 6.4.3 | SPO-234 |
| SPO-255 | Búsqueda de lugares cerca del jugador y un solo centro por defecto | 1 | Frontend | 7 · Sistema de Matchmaking | 7.3.1 | SPO-237 |
| SPO-256 | Seed: faltas, bajas tarde y avisos para probar puntaje y suspensión | 1 | Backend | 8 · QA Manual y Validación | 8.1.1 | SPO-234, SPO-236 |
| SPO-257 | Health endpoint en 4 capas | 1 | Backend | 9 · Deployment | 9.1.1 | — |
| **Link compartible** | | | | | | |
| SPO-258 | `GET /public/matches/:id`: el partido sin sesión | 1 | Backend | 6 · Gestión de Partidos | 6.5.1 | — |
| SPO-259 | Detalle público del partido, "Compartir" y vista previa del link | 3 | Frontend | 6 · Gestión de Partidos | 6.5.1 | SPO-258 |
| **Invitaciones** | | | | | | |
| SPO-260 | `GET /users/search`: buscar jugadores por nombre | 1 | Backend | 6 · Gestión de Partidos | 6.5.2 | — |
| SPO-261 | Invitar a un jugador: origen "invitación" en la solicitud + `POST /matches/:id/invitations` | 3 | Backend | 6 · Gestión de Partidos | 6.5.2 | SPO-236 |
| SPO-262 | Aceptar o rechazar una invitación | 2 | Backend | 6 · Gestión de Partidos | 6.5.3 | SPO-261 |
| SPO-263 | Invitar jugadores desde el detalle del partido | 3 | Frontend | 6 · Gestión de Partidos | 6.5.2 | SPO-260, SPO-261 |
| SPO-264 | Recibir una invitación: aviso, aceptar o rechazar y "Invitaciones" en Tus partidos | 2 | Frontend | 6 · Gestión de Partidos | 6.5.3 | SPO-262 |
| **Recordatorio** | | | | | | |
| SPO-265 | Recordatorio 24 h antes del partido | 3 | Backend · Frontend | 11 · Notificaciones | 11.1.4 | — |
| **Moderación** | | | | | | |
| SPO-266 | Rol de administrador (`role` en `User` + `AdminGuard`) | 1 | Backend | 12 · Moderación y Reportes | 12.2.1 | — |
| SPO-267 | Reportes: modelo `Report` + `POST /reports` | 2 | Backend | 12 · Moderación y Reportes | 12.1.1 · 12.1.2 | — |
| SPO-268 | Reportar a un jugador desde su perfil y desde el partido | 2 | Frontend | 12 · Moderación y Reportes | 12.1.3 | SPO-267 |
| SPO-269 | Panel de reportes en el back: listar y resolver | 2 | Backend | 12 · Moderación y Reportes | 12.2.1 | SPO-266, SPO-267 |
| SPO-270 | Panel de reportes para administradores (`/admin/reportes`) | 3 | Frontend | 12 · Moderación y Reportes | 12.2.1 | SPO-269 |
| SPO-271 | Bloquear una cuenta desde el back (7 días, 30 días o permanente) | 3 | Backend | 12 · Moderación y Reportes | 12.2.2 | SPO-266 |
| SPO-272 | Bloquear desde el panel y pantalla de cuenta bloqueada | 1 | Frontend | 12 · Moderación y Reportes | 12.2.2 | SPO-270, SPO-271 |
| SPO-273 | Historial de moderación por jugador | 3 | Backend · Frontend | 12 · Moderación y Reportes | 12.2.3 | SPO-269, SPO-271 |
| **Documentación** | | | | | | |
| SPO-274 | Documentación de la API con Swagger | 2 | Backend | 10 · Documentación Final | 10.2.2 | — |

**Decisión pendiente, sin ticket:** SPO-235 agregó una lista lateral de partidos en el mapa (solo desktop) que no está en el
diseño. Hay que validarla con diseño o sacarla.

**Recomendación de orden:** SPO-253 antes de SPO-238 (compatibilidad); invitaciones y link compartible antes que moderación
(invitaciones está en el camino crítico; moderación es el bloque más grande y necesita el rol de admin primero).

---

# Bugs sueltos

## SPO-247 · BUG-4 · Scrollbar duplicada en el paso "Horario" · 1 SP

**Referencia:** RF-03 · WBS 6.2.1 · pantalla 08 (Crear · Horario) · BUG-4 de QA

**Descripción**

En el paso "Horario" del wizard, la fila de días/horas muestra la scrollbar horizontal con el estilo de la app y, al pasar
el mouse, aparece arriba otra scrollbar sin estilo que la tapa. Reportado por QA con captura (BUG-4).

**Pasos**

1. `front/src/components/matches/schedule-picker.tsx`: la fila usa `ROW = 'flex gap-2 overflow-x-auto pb-3'` (línea 21).
   Revisar si hay dos contenedores con `overflow-x-auto` anidados o si el estilo de la scrollbar se aplica solo a un
   estado (`:hover`). Tiene que quedar **una sola** scrollbar, con el estilo de la app.
2. Si el estilo de scrollbar vive en `front/src/design-system/base.css`, usarlo desde ahí; no sumar CSS suelto.

**Criterios de aceptación**

- [ ] En desktop, con y sin hover, hay una sola scrollbar horizontal y con el estilo de la app.
- [ ] En mobile el scroll con el dedo sigue funcionando y no se ve una barra sin estilo.
- [ ] Captura antes/después en el ticket (QA-05).
- [ ] Cero colores sueltos, `padding`/`gap`. `npm run lint` y `npm run build` pasan.

**Notas**

* Captura original en el export de bugs de QA (`sportmatch-bugs-2026-09-19/assets/BUG-4`).

**Bloqueado por:** —

---

## SPO-248 · BUG-10 · La foto de perfil de Google se ve pixelada · 1 SP

**Referencia:** RF-02 · WBS 5.2.1 · BUG-10 de QA

**Descripción**

La foto de las cuentas de Google se ve pixelada. Google devuelve la URL con el tamaño embebido (`...=s96-c`, 96 px), y en
el perfil se muestra mucho más grande.

**Pasos**

1. Helper en `front/src/lib/` (por ejemplo `photo-url.ts`): si la URL es de `lh3.googleusercontent.com`, reemplazar el
   sufijo de tamaño `=s<N>-c` por uno acorde al tamaño en que se va a mostrar (por ejemplo `=s400-c`). Otras URLs quedan
   igual.
2. Usarlo en `front/src/components/user-avatar.tsx` (el `<Image src={photoUrl}>`), que es el componente que muestran el
   perfil, el header y las listas. El dominio ya está permitido en `front/next.config.ts`.

**Criterios de aceptación**

- [ ] La foto de una cuenta de Google se ve nítida en el perfil (el avatar más grande) y en el header.
- [ ] Las fotos que no son de Google y las iniciales siguen funcionando igual.
- [ ] Captura antes/después (QA-05). `npm run lint` y `npm run build` pasan.

**Bloqueado por:** —

---

## SPO-249 · BUG-11 · Descubrir: más aire arriba y abajo · 1 SP

**Referencia:** RF-04 · WBS 7.2.2 · pantalla 04 · BUG-11 de QA

**Descripción**

En Descubrir, el texto "Recomendado para vos" y los botones de aceptar y rechazar quedan pegados a los bordes de la
pantalla en algunos dispositivos. Falta padding vertical (BUG-11, con captura).

**Pasos**

1. `front/src/components/matches/swipe-deck.tsx` y `front/src/app/(app)/buscar/page.tsx`: sumar padding vertical al
   encabezado y a la fila de botones, respetando el área segura (`env(safe-area-inset-*)`) y el tab bar flotante.

**Criterios de aceptación**

- [ ] A 375×667 (iPhone SE) y 390×844 el texto de arriba y los botones de abajo tienen aire y no quedan tapados por el tab
  bar.
- [ ] `padding`/`gap`, nunca `margin`. Captura antes/después (QA-05). `npm run lint` y `npm run build` pasan.

**Bloqueado por:** —

---

## SPO-250 · BUG-9 · TanStack Query: datos que se refrescan solos · 3 SP

**Referencia:** RF-05 · WBS 6.3.4 · BUG-9 de QA

**Descripción**

Hoy cada hook de datos (`front/src/hooks/use-*.ts`) guarda su propio estado y hay que recargar para ver cambios de otros
usuarios: una solicitud nueva, una aceptación. QA pidió TanStack Query para refrescar e invalidar automáticamente
(BUG-9). Este ticket lo instala y migra los hooks donde más se nota.

**Pasos**

1. Dependencia `@tanstack/react-query` en `front/`. **Justificación (QA-03):** reemplaza el refresco manual repetido en
   cada hook y la invalidación a mano después de cada acción; es el estándar para datos del servidor en React.
2. `QueryClientProvider` en `front/src/app/(app)/layout.tsx`.
3. Migrar, manteniendo la firma que usan las pantallas (`loading`, `error`, `refresh`):
   - `use-join-requests.ts` → `refetchInterval: 15_000` mientras el panel está abierto;
   - `use-my-matches.ts` y `use-match.ts`;
   - el contador de no leídas de `front/src/context/unread-count-context.tsx` → `refetchInterval: 30_000` y
     `refetchOnWindowFocus` (hoy lo hace a mano).
4. Después de aceptar, rechazar, pedir sumarse, bajarse o cancelar: `invalidateQueries` de las claves afectadas, en lugar
   de los `refresh()` manuales.

**Criterios de aceptación**

- [ ] Con dos cuentas: B pide sumarse y A lo ve en el panel en menos de 15 s sin recargar.
- [ ] A acepta y B ve "Estás dentro" al volver a la pestaña.
- [ ] El contador de la campana sigue funcionando igual (30 s + al volver a la pestaña).
- [ ] Las pantallas no cambian de aspecto; loading y error se ven igual que hoy.
- [ ] PR de menos de 1000 líneas (QA-01). `npm run lint` y `npm run build` pasan.

**Notas**

* Fuera de alcance: migrar todos los hooks. Los que no entran quedan como están y se migran cuando se toquen.

**Bloqueado por:** —

---

## SPO-251 · Al arrastrar el pin del lugar, la dirección se actualiza · 1 SP

**Referencia:** RF-03 · WBS 7.3.1 · pantalla 07 (Crear · Lugar) · `docs/reglas-de-negocio.md` §8

**Descripción**

En el paso "Lugar", al soltar el pin se actualizan las coordenadas pero el texto del lugar queda igual
(`front/src/components/matches/match-wizard.tsx:342-350`). Si el pin se mueve a otra cuadra, el partido guarda
coordenadas nuevas con la dirección vieja. Lo pedía así SPO-229; la regla cambió: el texto tiene que seguir al pin.

**Pasos**

1. Geocodificación inversa con la librería de Google que ya se carga: `useMapsLibrary('geocoding')` y
   `new Geocoder().geocode({ location })`. Agregarla a `front/src/hooks/use-geocoding.ts` como `getAddress(lat, lng)`.
2. En `onDragEnd`: calcular la distancia al punto elegido originalmente.
   - **Menos de ~50 m:** se actualizan solo las coordenadas y se conserva el nombre (por ejemplo "Club Norte · Cancha 3").
   - **Más de ~50 m:** `location` pasa a la dirección que devuelve el geocoder (recortada a `LOCATION_MAX`).
   - Mientras busca: "Buscando dirección…". Si falla: se conservan las coordenadas nuevas y el texto anterior, con el
     aviso "No pudimos obtener la dirección de ese punto".
3. Ojo: `BaseMap` tiene `key={form.location}` (`match-wizard.tsx:332`). Si cambia el texto, el mapa se vuelve a montar.
   Usar otra clave (por ejemplo, el id del lugar elegido) para que el mapa no parpadee al soltar el pin.
4. Constante con nombre para el umbral (`KEEP_PLACE_NAME_METERS = 50`).

**Criterios de aceptación**

- [ ] Arrastrar el pin unos metros conserva el nombre del lugar y actualiza las coordenadas.
- [ ] Arrastrarlo a otra cuadra cambia el texto a la dirección nueva.
- [ ] El mapa no se vuelve a montar ni parpadea al soltar el pin.
- [ ] Si la geocodificación falla, el wizard sigue funcionando y avisa.
- [ ] Captura del antes y después de arrastrar (QA-05). `npm run lint` y `npm run build` pasan.

**Notas**

* **Requiere habilitar la Geocoding API** en Google Cloud y sumarla a las restricciones de la key (lo documenta SPO-252).
  Tiene cupo gratis mensual.

**Bloqueado por:** —

---

# Gaps de la auditoría de la semana 8

## SPO-252 · Documentar la configuración de Google Maps · 1 SP

**Referencia:** WBS 10.2.1 · SPO-227

**Descripción**

SPO-227 sumó `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` y `NEXT_PUBLIC_GOOGLE_MAP_ID`, pero no están en la tabla de variables de
`front/README.md` (líneas 18-25) ni en `AGENTS.md` (que solo menciona Firebase). Tampoco está escrito cómo configurar la key,
que el ticket marcaba como obligatorio por costos.

**Pasos**

1. `front/README.md`: las dos variables en la tabla, con qué son y dónde se consiguen.
2. Sección "Google Maps" (en `front/README.md` o `docs/`): APIs a habilitar (Maps JavaScript, Places (New), Geocoding),
   restricción de la key por dominio (localhost, el dominio de Vercel de dev y el de producción), cuotas diarias por API
   para no pasar el cupo gratis, y cómo crear el Map ID con el estilo oscuro.
3. `AGENTS.md` §8: una línea que diga que la config de mapas también va por variables de entorno.

**Criterios de aceptación**

- [ ] Alguien nuevo puede levantar el mapa en local solo con el README.
- [ ] Ninguna key real en el repo.

**Bloqueado por:** —

---

## SPO-253 · Puntaje de varios usuarios en una sola pasada (`getScores`) · 2 SP

**Referencia:** RF-06 · WBS 5.1.4

**Descripción**

`UsersService.getScores(userIds)` (PR #101, SPO-234) hace un `getScore` por usuario, con 4 o 5 consultas cada uno. SPO-238
(compatibilidad) lo va a llamar con todos los organizadores del listado de Descubrir: con 30 partidos son más de 100
consultas por request. Hay que calcularlo con consultas agrupadas.

**Pasos**

1. `back/src/users/users.repository.ts`: variantes por lote de las consultas del puntaje (calificaciones recibidas, faltas,
   bajas tarde y cancelaciones tarde), con `where: { ...: { in: userIds } }` o `groupBy`.
2. `UsersService.getScores` arma un `Map<userId, score>` con esos resultados, aplicando la misma fórmula que `getScore`.
   `getScore(id)` pasa a ser `getScores([id])`, para que haya una sola implementación.

**Criterios de aceptación**

- [ ] `getScores` de N usuarios hace una cantidad fija de consultas, sin importar N (revisar con el log de Prisma).
- [ ] El puntaje de cada usuario da exactamente igual que antes (comparar 3 usuarios del seed).
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Notas**

* Conviene hacerlo antes de SPO-238. Se puede agregar como "bloqueado por" de SPO-238.

**Bloqueado por:** SPO-234

---

## SPO-254 · Una sola consulta de reportes de faltas · 1 SP

**Referencia:** RF-06 · WBS 6.4.3

**Descripción**

La consulta de reportes de faltas por partido quedó en tres lugares: `back/src/ratings/ratings.repository.ts:26`,
`back/src/users/users.repository.ts:47` y `findMatchesReportedIn` (PR #101). Si cambia la regla, hay que acordarse de las tres.

**Pasos**

1. Dejar un solo método en `UsersRepository` (o en un repository compartido) y usarlo desde los tres lugares.
2. La regla de "falta confirmada" sigue en `back/src/utils/ratings/confirmed-no-shows.ts`.

**Criterios de aceptación**

- [ ] Una sola consulta de reportes por partido en todo `back/src`.
- [ ] Faltas, puntaje y notificaciones se comportan exactamente igual.
- [ ] `npm run lint` y `npm run build` pasan.

**Bloqueado por:** SPO-234

---

## SPO-255 · Búsqueda de lugares cerca del jugador y un solo centro por defecto · 1 SP

**Referencia:** RF-03 · RF-04 · WBS 7.3.1

**Descripción**

El autocompletado de lugares prioriza siempre un punto fijo (`DEFAULT_SEARCH_CENTER` en
`front/src/hooks/use-geocoding.ts:9`), aunque el jugador esté en otra ciudad. Además hay dos centros por defecto distintos:
ese y `DEFAULT_CENTER` en `front/src/app/(app)/mapa/page.tsx:18` (CABA).

**Pasos**

1. Una sola constante `DEFAULT_MAP_CENTER` en `front/src/lib/` y usarla en los dos lugares.
2. `useGeocoding` recibe la ubicación del jugador (`use-user-location.ts`, de SPO-237) y la usa como `locationBias` cuando
   existe; si no, usa `DEFAULT_MAP_CENTER`.

**Criterios de aceptación**

- [ ] Con permiso de ubicación, las sugerencias priorizan lugares cerca del jugador.
- [ ] Sin permiso, funciona como hoy.
- [ ] No queda más de un centro por defecto en `front/src`.
- [ ] `npm run lint` y `npm run build` pasan.

**Bloqueado por:** SPO-237

---

## SPO-256 · Seed: faltas, bajas tarde y avisos para probar puntaje y suspensión · 1 SP

**Referencia:** WBS 8.1.1 (dataset de demo)

**Descripción**

El seed no tiene datos para probar a mano el puntaje nuevo y la suspensión: no hay bajas tarde ni cancelaciones tarde, y el
usuario demo no tiene notificaciones `NO_SHOW_CONFIRMED` ni `USER_SUSPENDED`, así que no se pueden ver en `/notificaciones`.

**Pasos**

1. `back/prisma/seed.ts`:
   - una baja tarde (`LateWithdrawal`) y una cancelación tarde del organizador;
   - para `SEED_DEMO_EMAIL`, una notificación `NO_SHOW_CONFIRMED` y una `USER_SUSPENDED` (con `payload.until`);
   - un usuario de demo suspendido en este momento (3 faltas confirmadas recientes), para probar los CTAs de SPO-241.
2. Documentar en un comentario del seed qué usuario sirve para probar qué.

**Criterios de aceptación**

- [ ] Después de `npm run db:seed`, `/notificaciones` del usuario demo muestra los 8 tipos.
- [ ] Hay un usuario con puntaje penalizado por baja tarde y otro suspendido.
- [ ] El seed sigue corriendo dos veces seguidas sin errores.

**Bloqueado por:** SPO-234, SPO-236

---

## SPO-257 · Health endpoint en 4 capas · 1 SP

**Referencia:** WBS 9.1.1 · AGENTS.md §5

**Descripción**

`back/src/health/health.controller.ts` (PR #91, sin ticket) inyecta `PrismaService` en el controller, contra la regla de 4
capas, y el `setTimeout` de `withTimeout` nunca se limpia (queda un timer vivo por cada request).

**Pasos**

1. `health.service.ts` + `health.repository.ts`: el repository hace el `SELECT 1`; el service aplica el timeout y decide
   el resultado. El controller solo arma la respuesta y el status.
2. Limpiar el timer con `clearTimeout` cuando la consulta termina antes.

**Criterios de aceptación**

- [ ] `GET /health` responde igual que hoy (`200 { ok: true, db: 'up' }` o `503`).
- [ ] El controller no importa `PrismaService`.
- [ ] `npm run lint` y `npm run build` pasan.

**Bloqueado por:** —

---

# Link compartible

## SPO-258 · `GET /public/matches/:id`: el partido sin sesión · 1 SP

**Referencia:** RF-03 · WBS 6.5.1 · `docs/reglas-de-negocio.md` §10

**Descripción**

Para que un link de partido se pueda abrir sin cuenta, hace falta un endpoint sin login que devuelva solo los datos
públicos. Hoy todo `MatchesController` está detrás de `FirebaseAuthGuard` (a nivel de clase).

**Pasos**

1. `back/src/matches/public-matches.controller.ts` (en el mismo módulo, **sin** guard): `GET /public/matches/:id`.
2. `MatchesService.findPublic(id)` + consulta en `MatchesRepository` con `select` explícito, solo:

```ts
{ id, date, location, latitude, longitude, level, capacity, status,
  sport: { id, name }, organizer: { name, photoUrl }, joinedCount }
```

   **Sin** participantes, sin ids de usuarios, sin email.
3. Partido inexistente → **404**. Cancelado → se devuelve con `status: 'CANCELED'` (el front lo muestra como cancelado).

**Criterios de aceptación**

- [ ] `GET /public/matches/:id` sin token → **200** con esos campos y nada más.
- [ ] Id inexistente → **404**.
- [ ] Los demás endpoints de `matches` siguen pidiendo token.
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Bloqueado por:** —

---

## SPO-259 · Detalle público del partido, "Compartir" y vista previa del link · 3 SP

**Referencia:** RF-03 · WBS 6.5.1 · pantalla 05 · `docs/reglas-de-negocio.md` §10

**Descripción**

Que un jugador pueda compartir un partido y que quien recibe el link lo vea sin cuenta. `/partidos/[id]` está dentro de
`(app)`, cuyo layout manda a `/login` a quien no tiene sesión (`front/src/app/(app)/layout.tsx`). La URL pública es la misma
(`/partidos/:id`, decisión 4 de la WBS).

**Pasos**

1. `front/src/app/(app)/layout.tsx`: no redirigir a `/login` cuando la ruta es el detalle de un partido
   (`/partidos/<id>`, no `/partidos/nuevo` ni `/editar`).
2. `front/src/app/(app)/partidos/[id]/page.tsx`: sin sesión, renderiza una vista pública con `GET /public/matches/:id`
   (función en `front/src/lib/matches.ts`; `apiFetch` exige usuario, así que agregar una variante sin token para
   endpoints públicos). Misma pantalla 05, sin lista de jugadores, sin acciones de organizador, y el CTA **"Sumate"**.
3. "Sumate" → `/login?next=/partidos/<id>`. Después de iniciar sesión o crear cuenta, volver a `next`
   (`front/src/hooks/use-redirect-if-authenticated.ts`). Validar que `next` sea una ruta interna.
4. Botón **"Compartir"** en el detalle (con sesión): Web Share API en mobile, copiar al portapapeles con toast en desktop.
5. Vista previa del link: `generateMetadata` en un `layout.tsx` de servidor dentro de `partidos/[id]/`, que pide
   `GET /public/matches/:id` y arma `title` ("Fútbol · sáb 4/10 19:00 · Club Norte") y `openGraph` con la foto del deporte
   (`front/src/lib/sport-photo.ts`). Leer la guía de metadata de la versión en `node_modules/next/dist/docs/`.

**Criterios de aceptación**

- [ ] En incógnito, `/partidos/<id>` muestra el partido sin pedir login, sin lista de jugadores.
- [ ] "Sumate" lleva al login y, al entrar, vuelve a ese partido.
- [ ] `/partidos/nuevo`, `/mis-partidos` y el resto siguen pidiendo sesión.
- [ ] "Compartir" funciona en mobile y copia el link en desktop.
- [ ] Pegar el link en WhatsApp muestra título e imagen.
- [ ] Un id inexistente muestra "No encontramos este partido". Un partido cancelado se ve como cancelado.
- [ ] Capturas de la vista pública y de la vista previa (QA-05). `npm run lint` y `npm run build` pasan.

**Bloqueado por:** SPO-258

---

# Invitaciones

## SPO-260 · `GET /users/search`: buscar jugadores por nombre · 1 SP

**Referencia:** RF-05 · WBS 6.5.2

**Descripción**

Para invitar, el organizador busca jugadores registrados por nombre. Hoy `GET /users` devuelve todos, sin filtro.

**Pasos**

1. `UsersController`: `GET /users/search?q=` (declararlo **antes** de `GET /users/:id`). DTO con `q` de 2 a 50 caracteres.
2. `UsersRepository`: `name contains q` (insensible a mayúsculas), `take: 10`, orden por nombre, excluyendo al que busca.
   Solo campos públicos (`id`, `name`, `photoUrl`).

**Criterios de aceptación**

- [ ] `GET /users/search?q=ju` devuelve hasta 10 jugadores cuyo nombre contiene "ju", sin el que busca.
- [ ] `q` de 1 letra → **400**. Sin token → **401**.
- [ ] Nunca devuelve `email` ni `firebaseUid`.
- [ ] `npm run lint` y `npm run build` pasan.

**Bloqueado por:** —

---

## SPO-261 · Invitar a un jugador: origen "invitación" en la solicitud + `POST /matches/:id/invitations` · 3 SP

**Referencia:** RF-05 · WBS 6.5.2 · `docs/reglas-de-negocio.md` §11

**Descripción**

La invitación reutiliza `JoinRequest` con un origen nuevo (decisión 5 de la WBS), para no tener un modelo paralelo. Solo el
organizador invita, y el invitado recibe una notificación.

**Pasos**

1. `back/prisma/schema.prisma`:

```prisma
enum JoinRequestOrigin {
  REQUEST
  INVITATION

  @@map("join_request_origin")
}
```

   `JoinRequest.origin JoinRequestOrigin @default(REQUEST)`. En `NotificationType`: `INVITATION_RECEIVED`,
   `INVITATION_ACCEPTED`, `INVITATION_REJECTED`. Migración `add_invitations`.
2. `POST /matches/:matchId/invitations` con `{ userId }` (DTO). Puede ir en `back/src/join-requests/` (misma entidad).
   Validaciones en el service:
   - solo el organizador → **403**;
   - partido cancelado, ya empezado o lleno → **409**;
   - invitado inexistente → **404**; invitarse a sí mismo → **400**;
   - el invitado ya está anotado o tiene una solicitud o invitación pendiente → **409**;
   - el invitado está suspendido (`UsersService.getSuspendedUntil`, de SPO-236) → **409**.
   Si existe una solicitud vieja rechazada, se reutiliza la fila (hay `@@unique([matchId, userId])`).
3. Notificar `INVITATION_RECEIVED` al invitado, con `actorId` = organizador.
4. `GET /matches/:matchId/join-requests` (el panel del organizador) devuelve solo `origin: REQUEST`. Las invitaciones se
   listan aparte: `GET /matches/:matchId/invitations` (organizador), con estado.

**Criterios de aceptación**

- [ ] El organizador invita → la fila queda `PENDING` con `origin: INVITATION` y el invitado recibe `INVITATION_RECEIVED`.
- [ ] Todos los errores de la lista responden con el código indicado.
- [ ] Las invitaciones no aparecen en el panel de solicitudes para aceptar o rechazar.
- [ ] Las solicitudes normales funcionan igual que antes (`npm run test:e2e` de join-requests pasa).
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Bloqueado por:** SPO-236

---

## SPO-262 · Aceptar o rechazar una invitación · 2 SP

**Referencia:** RF-05 · WBS 6.5.3 · `docs/reglas-de-negocio.md` §11

**Descripción**

El invitado acepta y queda anotado **sin aprobación del organizador**, o rechaza. La invitación vence cuando empieza el
partido.

**Pasos**

1. `PATCH /matches/:matchId/invitations/me` con `{ status: 'ACCEPTED' | 'REJECTED' }`.
2. Aceptar: misma transacción con control de cupo que el aceptar de solicitudes (SPO-220, `JoinRequestsRepository.accept`),
   para no pasarse del cupo si justo se llenó → **409**.
3. Partido empezado, cancelado o invitación inexistente → **409** / **404**.
4. Notificar al organizador `INVITATION_ACCEPTED` o `INVITATION_REJECTED`, con `actorId` = invitado.
5. `GET /matches/mine` suma `invited`: partidos futuros activos con una invitación pendiente para mí.

**Criterios de aceptación**

- [ ] Aceptar → quedo anotado, el contador del partido sube y el organizador recibe `INVITATION_ACCEPTED`.
- [ ] Rechazar → no entro y el organizador recibe `INVITATION_REJECTED`.
- [ ] Aceptar con el partido lleno → **409** y no entro. Aceptar después de la hora de inicio → **409**.
- [ ] `GET /matches/mine` trae `invited`.
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Bloqueado por:** SPO-261

---

## SPO-263 · Invitar jugadores desde el detalle del partido · 3 SP

**Referencia:** RF-05 · WBS 6.5.2 · pantalla 05

**Descripción**

El organizador invita jugadores desde el detalle de su partido: busca por nombre, invita y ve a quién ya invitó. La
invitación no tiene pantalla propia en el Figma; se arma con los componentes del repo.

**Pasos**

1. En `front/src/app/(app)/partidos/[id]/page.tsx`, para el organizador de un partido futuro activo con lugar: botón
   **"Invitar jugadores"** (`PillButton`).
2. Abre un diálogo (`front/src/components/ui/dialog.tsx`; o el `BottomSheet` de SPO-240 si ya existe) con:
   - buscador con debounce de 300 ms sobre `GET /users/search` (mínimo 2 letras);
   - resultados con `UserAvatar` + nombre + botón "Invitar"; estado "Invitado" si ya lo está;
   - lista de invitaciones del partido (`GET /matches/:id/invitations`) con su estado: Pendiente · Aceptó · Rechazó.
3. `front/src/lib/invitations.ts` con `apiFetch`, y los errores del back en castellano ("Ya está anotado", "El partido
   está lleno", "No se puede invitar a este jugador").

**Criterios de aceptación**

- [ ] El organizador busca "ju", invita a un jugador y lo ve como "Invitado"; el invitado recibe la notificación.
- [ ] Un jugador que no es el organizador no ve el botón.
- [ ] Partido lleno o cancelado: el botón no aparece.
- [ ] Estados de loading, vacío ("No encontramos jugadores") y error.
- [ ] Se ve a 375px; capturas (QA-05). `apiFetch`, cero colores sueltos, `padding`/`gap`. `npm run lint` y `npm run build`
  pasan.

**Bloqueado por:** SPO-260, SPO-261

---

## SPO-264 · Recibir una invitación: aviso, aceptar o rechazar y "Invitaciones" en Tus partidos · 2 SP

**Referencia:** RF-05 · WBS 6.5.3 · pantallas 05 y 11

**Descripción**

El invitado se entera por la campanita, ve la invitación en el detalle y en Tus partidos, y la acepta o rechaza.

**Pasos**

1. `front/src/lib/notification-message.ts` y `front/src/types/notification.ts`: los 3 tipos nuevos:
   - `INVITATION_RECEIVED`: **{actor}** te invitó a su partido de {deporte}
   - `INVITATION_ACCEPTED`: **{actor}** aceptó tu invitación al partido de {deporte}
   - `INVITATION_REJECTED`: **{actor}** no puede sumarse a tu partido de {deporte}
2. `front/src/components/matches/match-actions.tsx`: si tengo una invitación pendiente, en vez de "Pedir sumarme" se ve
   **"Te invitaron"** con "Aceptar" y "Rechazar" (rechazar con confirmación en dos pasos, como el resto).
3. `front/src/app/(app)/mis-partidos/page.tsx`: sección **"Invitaciones"** arriba de todo (con `MyMatchesSection`) usando
   `invited` de `GET /matches/mine`. Si no hay, no se muestra.

**Criterios de aceptación**

- [ ] El invitado ve la notificación, entra al partido y lo acepta: queda "Estás dentro".
- [ ] Rechazar lo saca de "Invitaciones" y el partido vuelve a verse normal.
- [ ] Si el partido se llenó, aceptar muestra "El partido ya está lleno".
- [ ] Capturas (QA-05). `apiFetch`, cero colores sueltos, `padding`/`gap`. `npm run lint` y `npm run build` pasan.

**Bloqueado por:** SPO-262

---

# Recordatorio

## SPO-265 · Recordatorio 24 h antes del partido · 3 SP

**Referencia:** RF-05 · WBS 11.1.4 · `docs/reglas-de-negocio.md` §13

**Descripción**

Un aviso único 24 h antes del partido a los anotados y al organizador. Es el primer proceso programado del back.

**Pasos**

1. Dependencia `@nestjs/schedule`. **Justificación (QA-03):** es el módulo oficial de NestJS para tareas programadas; no
   hay alternativa nativa.
2. `Match.reminderSentAt DateTime?` (migración `add_match_reminder`) y `MATCH_REMINDER` en `NotificationType`.
3. `back/src/reminders/` en 4 capas (sin controller HTTP; el "controller" es el cron): cada 15 minutos busca partidos
   `ACTIVE`, con `date` dentro de las próximas 24 h, `reminderSentAt` en null y **creados al menos 24 h antes del partido**
   (regla: sin recordatorio para partidos creados con menos anticipación). A cada uno: `notifyMany` a anotados y
   organizador, y marca `reminderSentAt` en la misma transacción, para no mandar dos veces.
4. Front: texto en `front/src/lib/notification-message.ts`: "Mañana jugás {deporte} a las {hora} en {lugar}".
5. Si SPO-243 (push) está mergeado, el push sale solo desde `notifyMany`.

**Criterios de aceptación**

- [ ] Un partido del seed que empieza en 23 h 50 min y fue creado hace días recibe el recordatorio en la siguiente corrida.
- [ ] Nunca se manda dos veces para el mismo partido, aunque el back se reinicie.
- [ ] Un partido creado 5 h antes no recibe recordatorio. Un partido cancelado tampoco.
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Notas**

* **Infra:** el cron corre dentro del back. En Azure App Service hay que tener **Always On** activado, o el proceso se duerme
  y no corre. Con una sola instancia no hace falta lock distribuido; si se escala a más de una, se agrega.

**Bloqueado por:** —

---

# Moderación

## SPO-266 · Rol de administrador (`role` en `User` + `AdminGuard`) · 1 SP

**Referencia:** WBS 12.2.1 · riesgo R2 del cronograma

**Descripción**

El panel de moderación necesita un rol de administrador, que hoy no existe ni en el modelo ni en los guards (riesgo R2). Se
resuelve primero, antes de todo lo demás de moderación.

**Pasos**

1. `enum UserRole { USER ADMIN }` y `User.role UserRole @default(USER)` (migración `add_user_role`).
2. `back/src/auth/admin.guard.ts`: después de `FirebaseAuthGuard`, deja pasar solo si el usuario tiene `role: ADMIN`; si no,
   **403**. Mismo estilo que `back/src/auth/own-account.guard.ts`.
3. `GET /users/me` devuelve `role`. Los endpoints públicos de usuarios **no** lo exponen.
4. El rol se asigna a mano: en el seed, el usuario de `SEED_ADMIN_EMAIL` (nueva variable opcional en
   `back/src/config/env.validation.ts` y `back/.env.example`) queda como `ADMIN`.

**Criterios de aceptación**

- [ ] Un endpoint de prueba con `AdminGuard` da **403** a un usuario común y **200** al admin del seed.
- [ ] `GET /users/me` trae `role`; `GET /users/:id` no.
- [ ] No hay forma de volverse admin desde la API.
- [ ] `npm run lint` y `npm run build` pasan.

**Bloqueado por:** —

---

## SPO-267 · Reportes: modelo `Report` + `POST /reports` · 2 SP

**Referencia:** RF-06 · WBS 12.1.1 · 12.1.2 · `docs/reglas-de-negocio.md` §12

**Descripción**

Un jugador reporta a otro por su comportamiento. Se guarda el reporte para que lo revise un administrador.

**Pasos**

1. `back/prisma/schema.prisma`:

```prisma
enum ReportReason {
  AGGRESSIVE_BEHAVIOR
  OFFENSIVE_LANGUAGE
  FAKE_PROFILE
  OTHER

  @@map("report_reason")
}

enum ReportStatus {
  OPEN
  REVIEWED
  DISMISSED

  @@map("report_status")
}

model Report {
  id             String       @id @default(cuid())
  reporterId     String
  reporter       User         @relation("ReportsGiven", fields: [reporterId], references: [id])
  reportedUserId String
  reportedUser   User         @relation("ReportsReceived", fields: [reportedUserId], references: [id])
  matchId        String?
  match          Match?       @relation(fields: [matchId], references: [id], onDelete: SetNull)
  reason         ReportReason
  comment        String?
  status         ReportStatus @default(OPEN)
  reviewedById   String?
  reviewedAt     DateTime?
  createdAt      DateTime     @default(now())

  @@index([status, createdAt])
  @@index([reportedUserId])
  @@map("reports")
}
```

   (`reviewedBy` como relación a `User`, más las inversas.) Migración `add_reports`.
2. Módulo `back/src/reports/` en 4 capas: `POST /reports` con `{ reportedUserId, reason, comment?, matchId? }`.
   - reportarse a uno mismo → **400**; usuario inexistente → **404**;
   - si viene `matchId`, los dos tienen que haber estado en ese partido → si no, **403**;
   - ya hay un reporte `OPEN` del mismo jugador al mismo jugador (y mismo partido) → **409**;
   - `comment` hasta 500 caracteres.

**Criterios de aceptación**

- [ ] Un reporte válido queda `OPEN` y responde **201**.
- [ ] Todos los errores de la lista responden con el código indicado.
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Bloqueado por:** —

---

## SPO-268 · Reportar a un jugador desde su perfil y desde el partido · 2 SP

**Referencia:** RF-06 · WBS 12.1.3 · pantallas 05 y 12

**Descripción**

La acción "Reportar" en el perfil de otro jugador y en el detalle del partido. No hay pantalla en el Figma (2.2.8 no está
entregado): se arma con los componentes del repo.

**Pasos**

1. Componente `front/src/components/reports/report-dialog.tsx`: `Dialog` con los 4 motivos (radio: "Comportamiento
   agresivo", "Lenguaje ofensivo", "Perfil falso", "Otro"), comentario opcional (hasta 500) y "Enviar reporte"
   deshabilitado hasta elegir un motivo. Error dentro del diálogo; al enviar, toast "Gracias, vamos a revisarlo".
2. Perfil ajeno (`front/src/app/(app)/usuarios/[id]/page.tsx` / `ProfileHeader`): opción "Reportar" (en el perfil propio
   no aparece).
3. Detalle del partido: "Reportar" en cada jugador de la lista y en el organizador, solo para quienes jugaron ese partido
   (se manda `matchId`).
4. `front/src/lib/reports.ts` con `apiFetch`. El 409 muestra "Ya reportaste a este jugador".

**Criterios de aceptación**

- [ ] Se puede reportar desde el perfil ajeno y desde el partido; el reporte llega al back.
- [ ] No hay opción de reportarse a uno mismo.
- [ ] Capturas del diálogo (QA-05). `apiFetch`, cero colores sueltos, `padding`/`gap`. `npm run lint` y `npm run build`
  pasan.

**Bloqueado por:** SPO-267

---

## SPO-269 · Panel de reportes en el back: listar y resolver · 2 SP

**Referencia:** WBS 12.2.1

**Descripción**

Los endpoints del panel de moderación, solo para administradores.

**Pasos**

1. `back/src/reports/` (o `back/src/admin/`), todo con `FirebaseAuthGuard` + `AdminGuard` (SPO-266):
   - `GET /admin/reports?status=OPEN|REVIEWED|DISMISSED` (por defecto `OPEN`), del más nuevo al más viejo, con
     `reporter`, `reportedUser` (incluida la cantidad de reportes que recibió) y `match` embebidos;
   - `PATCH /admin/reports/:id` con `{ status: 'REVIEWED' | 'DISMISSED' }`: guarda `reviewedById` y `reviewedAt`.
2. Resolver un reporte que no está `OPEN` → **409**. Id inexistente → **404**.

**Criterios de aceptación**

- [ ] Un usuario común recibe **403** en los dos endpoints; el admin, **200**.
- [ ] El filtro por estado funciona y el orden es del más nuevo al más viejo.
- [ ] Resolver guarda quién y cuándo.
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Bloqueado por:** SPO-266, SPO-267

---

## SPO-270 · Panel de reportes para administradores (`/admin/reportes`) · 3 SP

**Referencia:** WBS 12.2.1

**Descripción**

La pantalla del panel. Solo la ven los administradores; no está en el Figma y se arma con los componentes del repo, en el
estilo de la app.

**Pasos**

1. Ruta `front/src/app/(app)/admin/reportes/page.tsx`. Si el usuario no es admin (`role` de `GET /users/me`), redirige a
   `/mapa`. Acceso: una fila "Moderación" en Ajustes (SPO-244) o en el menú de perfil, visible solo para admins.
2. Chips de estado (Abiertos · Revisados · Descartados) con el `FilterChip` de SPO-239 si ya existe.
3. Cada reporte: reportante → reportado (con avatar y link al perfil), motivo, comentario, partido (link), fecha, y cuántos
   reportes tiene el reportado. Acciones: "Marcar revisado", "Descartar" y el lugar para "Bloquear cuenta" (lo conecta
   SPO-272).
4. Estados de loading, vacío ("No hay reportes abiertos") y error.

**Criterios de aceptación**

- [ ] El admin ve los reportes abiertos, filtra por estado y los resuelve; la lista se actualiza.
- [ ] Un usuario común no ve el acceso y, si entra por URL, vuelve a `/mapa`.
- [ ] Se ve a 375px y en desktop; capturas (QA-05). `apiFetch`, cero colores sueltos, `padding`/`gap`. `npm run lint` y
  `npm run build` pasan.

**Bloqueado por:** SPO-269

---

## SPO-271 · Bloquear una cuenta desde el back (7 días, 30 días o permanente) · 3 SP

**Referencia:** WBS 12.2.2 · `docs/reglas-de-negocio.md` §12

**Descripción**

El administrador bloquea una cuenta y el bloqueado no puede usar la app. Es distinto de la suspensión por faltas (SPO-236),
que solo impide sumarse y crear partidos.

**Pasos**

1. `User.blockedAt DateTime?` y `User.blockedUntil DateTime?` (migración `add_user_block`). Bloqueo permanente = `blockedAt`
   con `blockedUntil` en null.
2. Con `AdminGuard`:
   - `POST /admin/users/:id/block` con `{ duration: 'DAYS_7' | 'DAYS_30' | 'PERMANENT', reportId? }`. Si viene `reportId`,
     el reporte pasa a `REVIEWED`.
   - `DELETE /admin/users/:id/block`: desbloquea.
   - Bloquearse a uno mismo o a otro admin → **400**.
3. `back/src/auth/firebase-auth.guard.ts`: si el usuario está bloqueado (vigente), responde **403** con
   `{ code: 'ACCOUNT_BLOCKED', until }` en **todos** los endpoints protegidos. Un bloqueo vencido no bloquea.

**Criterios de aceptación**

- [ ] Bloquear 7 días → el bloqueado recibe **403 ACCOUNT_BLOCKED** en cualquier endpoint, con la fecha.
- [ ] Permanente → `until: null`. Desbloquear → vuelve a funcionar.
- [ ] Un bloqueo vencido no afecta.
- [ ] Un usuario común no puede bloquear (**403**).
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Bloqueado por:** SPO-266

---

## SPO-272 · Bloquear desde el panel y pantalla de cuenta bloqueada · 1 SP

**Referencia:** WBS 12.2.2

**Descripción**

La acción "Bloquear cuenta" en el panel (SPO-270) y lo que ve el bloqueado.

**Pasos**

1. En cada reporte del panel: "Bloquear cuenta" abre un diálogo con la duración (7 días · 30 días · Permanente) y
   confirmación en dos pasos. Llama a `POST /admin/users/:id/block` con el `reportId`.
2. `front/src/lib/api.ts`: un 403 con `code: 'ACCOUNT_BLOCKED'` cierra la sesión (como el 401 de SPO-223) y lleva a
   `/login` con el mensaje "Tu cuenta está bloqueada hasta el dd/mm" (o "Tu cuenta está bloqueada" si es permanente).

**Criterios de aceptación**

- [ ] El admin bloquea desde el panel y el reporte queda revisado.
- [ ] El bloqueado, en su próxima acción, queda afuera con el mensaje correcto.
- [ ] Capturas (QA-05). `npm run lint` y `npm run build` pasan.

**Bloqueado por:** SPO-270, SPO-271

---

## SPO-273 · Historial de moderación por jugador · 3 SP

**Referencia:** WBS 12.2.3

**Descripción**

Registrar cada acción de moderación y poder verla por jugador, para saber si alguien ya fue sancionado antes.

**Pasos**

1. Back: modelo `ModerationAction` (`adminId`, `targetUserId`, `reportId?`, `type`: `REPORT_REVIEWED` ·
   `REPORT_DISMISSED` · `USER_BLOCKED` · `USER_UNBLOCKED`, `detail Json?` con la duración, `createdAt`). Migración
   `add_moderation_actions`.
2. Registrar la acción en la misma transacción que resolver un reporte (SPO-269) y que bloquear o desbloquear (SPO-271).
3. `GET /admin/users/:id/moderation` (`AdminGuard`): acciones del jugador, de la más nueva a la más vieja, con el admin
   embebido.
4. Front: en el panel (SPO-270), cada reportado tiene "Ver historial", que muestra esas acciones en un diálogo.

**Criterios de aceptación**

- [ ] Resolver, bloquear y desbloquear dejan una acción en el historial, con quién y cuándo.
- [ ] El admin ve el historial de un jugador desde el panel.
- [ ] Un usuario común recibe **403**.
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`. Capturas (QA-05). `npm run lint` y `npm run build` pasan.

**Bloqueado por:** SPO-269, SPO-271

---

# Documentación

## SPO-274 · Documentación de la API con Swagger · 2 SP

**Referencia:** WBS 10.2.2

**Descripción**

No hay documentación de endpoints. Swagger se genera desde el código y queda siempre actualizado.

**Pasos**

1. Dependencia `@nestjs/swagger`. **Justificación (QA-03):** es el módulo oficial de NestJS para OpenAPI; documentar a mano
   se desactualiza.
2. `back/src/main.ts`: `SwaggerModule` en `/docs`, con esquema Bearer (token de Firebase). Solo se monta si
   `SWAGGER_ENABLED=true` (nueva variable en `env.validation.ts` y `.env.example`), para no exponerlo en producción.
3. Plugin del CLI de Swagger en `back/nest-cli.json`, para que los DTOs se documenten sin decorar campo por campo.
4. `@ApiTags` por controller y `@ApiBearerAuth` en los protegidos.
5. Link a `/docs` en el README del back.

**Criterios de aceptación**

- [ ] Con `SWAGGER_ENABLED=true`, `/docs` lista todos los endpoints con sus DTOs y se pueden probar con un token.
- [ ] Sin la variable, `/docs` da **404**.
- [ ] `npm run lint` y `npm run build` pasan.

**Bloqueado por:** —
