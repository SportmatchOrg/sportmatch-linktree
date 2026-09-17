# Estado real del proyecto al 15/09

**Criterio:** los tickets en **Todo** o **In Review** se cuentan como hechos — cierran antes del steering.
Los tickets en **Backlog** cuentan como no hechos.

| Estado | Significado |
|---|---|
| ✅ | Hecho y verificable en el repo o en el entorno `dev`. |
| 🟡 | Parcial: hay algo funcionando, pero el paquete no está completo. |
| ⬜ | No se empezó. |

## Resumen

| Módulo                   | ✅      | 🟡     | ⬜      | Lectura                                           |
| ------------------------ | ------ | ------ | ------ | ------------------------------------------------- |
| 1.0 Gestión del proyecto | 4      | 6      | 2      | Falta el informe final, las minutas y sostener el seguimiento. |
| 2.0 Diseño del producto  | 8      | 2      | 2      | Diseño completo salvo los módulos nuevos.         |
| 3.0 Capacitación y setup | 6      | 0      | 0      | Cerrado, y con más alcance del planificado.       |
| 4.0 Autenticación        | 4      | 0      | 0      | Cerrado.                                          |
| 5.0 Perfil de usuario    | 4      | 3      | 1      | Falta editar el perfil y el historial completo.   |
| 6.0 Gestión de partidos  | 11     | 1      | 7      | Núcleo cerrado; falta cancelación e invitaciones. |
| 7.0 Matchmaking          | 2      | 1      | 5      | Swipe sí, mapa y filtros no.                      |
| 8.0 QA y validación      | 3      | 2      | 9      | QA técnico sí, validación con usuarios no.        |
| 9.0 Deployment           | 3      | 0      | 0      | Cerrado sobre el entorno `dev`.                   |
| 10.0 Documentación final | 1      | 1      | 2      | Falta manual y documentación de API.              |
| 11.0 Notificaciones      | 0      | 0      | 7      | Fuera de alcance.                                 |
| 12.0 Moderación          | 0      | 0      | 6      | Fuera de alcance.                                 |
| **Total**                | **46** | **16** | **41** | 103 paquetes.                                     |

**Esfuerzo real cargado en Linear (tickets de sprint, SPO-135 en adelante):** 107 SP ≈ 107 h.
82 SP entregados, 8 SP en vuelo para el steering, 16 SP en backlog.

---

## 1.0 Gestión del Proyecto

| WBS | Paquete | Estado | Qué se hizo | Qué falta |
|---|---|---|---|---|
| 1.1.1 | Project Charter | ✅ | Documento completo con objetivo, alcance, supuestos, stakeholders y RF-01…RF-06 con MoSCoW. | — |
| 1.1.2 | WBS | ✅ | WBS v3 con 103 paquetes, bajada entera a Linear como 10 milestones + SPO-6…SPO-112. | Reflejar los entregables extra de la sección "Fuera de la WBS". |
| 1.1.3 | Cronograma y PERT | 🟡 | Se hizo el PERT con camino crítico (`gestion/scripts/pert_v2.py`, `PERT y Camino Crítico.md`). | Hay que rehacerlo contra la ejecución real: 3 sprints mensuales con semanas de jueves a jueves adentro; el S1 cierra en la semana 6 con la demo del 17/09. **Es el objetivo de este relevamiento.** |
| 1.2.1 | Backlog priorizado | ✅ | Backlog completo: SPO-6…SPO-112 (WBS) y SPO-135…SPO-219 (85 tickets de sprint, con estimación, label y dependencias "blocked by" reales). | — |
| 1.2.2 | Plan de sprints | 🟡 | Cinco planes semanales escritos y ejecutados dentro del S1 (`gestion/sprints/Sprint 1…5`, semanas 2 a 6), con capacidad, objetivo, reparto por dev y orden día por día. | Los planes semanales del S2 y el S3. |
| 1.2.3 | Reportes de avance y control de desvíos | 🟡 | Primer reporte formal para el steering 1: este relevamiento, la vista Steering del linktree (avance, presupuesto y valor ganado) y la vista Discrepancias. | Sostenerlo en cada steering del S2 y el S3. |
| 1.2.4 | Registro de riesgos | 🟡 | Registro inicial con impacto y mitigación en el Cronograma v4 §7 (R1–R4). | Actualizarlo en cada steering. |
| 1.3.1 | Acta de kick-off | ✅ | Kick-off hecho: objetivos, roles (PO + 3 devs), forma de trabajo y convenciones. | — |
| 1.3.2 | Minutas quincenales de seguimiento | ⬜ | — | No hay minutas en este repo. Si existen en otro lado, enlazarlas y pasar a 🟡. |
| 1.3.3 | Sprint reviews | 🟡 | La review del S1 es la demo del steering del 17/09. | Las reviews del S2 (15/10) y el S3 (05/11). |
| 1.4.1 | Informe final | ⬜ | — | Todo. Depende de 8.2.4 (que no se hizo) y 9.1.3. |
| 1.4.2 | Presentación final | 🟡 | En armado: steering + demo del 17/09. | Cerrarla. |

## 2.0 Diseño del Producto

| WBS | Paquete | Estado | Qué se hizo | Qué falta |
|---|---|---|---|---|
| 2.1.1 | Perfiles de usuario | ✅ | Jugador y organizador definidos; el modelo de datos los distingue por rol en cada partido, no por tipo de cuenta. | — |
| 2.1.2 | Sistema visual base | ✅ | Paleta, tipografía y componentes sobre shadcn + tokens en `globals.css`. Regla dura: nada de colores hardcodeados. | — |
| 2.2.1 | Pantallas de autenticación | ✅ | Diseñadas **e implementadas** (SPO-158, SPO-159, SPO-214). Incluye recuperar contraseña, que no estaba en la WBS. | — |
| 2.2.2 | Pantallas de perfil | ✅ | Pantalla 12 diseñada e implementada (SPO-142, SPO-191, SPO-216). | — |
| 2.2.3 | Creación y edición de partido | ✅ | Pantallas 06–10 diseñadas e implementadas como wizard de 5 pasos (SPO-189) y en modo edición (SPO-219). | — |
| 2.2.4 | Pantalla de solicitudes | ✅ | Diseñada e implementada (SPO-198, SPO-199, SPO-217). | — |
| 2.2.5 | Vista swipe | ✅ | Pantalla 04 diseñada e implementada (SPO-178). | — |
| 2.2.6 | Vista mapa | 🟡 | **El diseño existe**, la pantalla no. La pestaña Mapa se ocultó del tab bar para la demo (SPO-214). | Toda la implementación (7.3). Decisión tomada: fuera de alcance hasta el 17/09. |
| 2.2.7 | Pantallas de notificaciones | ⬜ | — | Todo. Módulo 11.0 fuera de alcance. |
| 2.2.8 | Pantallas de moderación | ⬜ | — | Todo. Módulo 12.0 fuera de alcance. |
| 2.3.1 | Diagrama Entidad-Relación | ✅ | Seis entidades vivas en `back/prisma/schema.prisma`: `User`, `Deporte`, `Partido`, `Participante`, `JoinRequest`, `Rating`, más los enums `Nivel` y `JoinRequestStatus`. | Las entidades de los módulos nuevos: cancelación, notificación, reporte. |
| 2.3.2 | Reglas de negocio | 🟡 | Implementadas: control de cupo, unirse directo, solicitudes con estados, permisos del organizador y del dueño de la cuenta (SPO-185, SPO-186, SPO-196), rating solo sobre partidos jugados (SPO-207). | No-show, visibilidad de partidos y reglas de cancelación. |

## 3.0 Capacitación y Setup

| WBS | Paquete | Estado | Qué se hizo | Qué falta |
|---|---|---|---|---|
| 3.1.1 | Stack definido | ✅ | Next.js + Tailwind + shadcn / NestJS + Prisma 7 / Postgres (Neon) / Firebase Auth / Vercel + Azure. | — |
| 3.1.2 | Equipo capacitado en el stack | ✅ | Ejercicio end-to-end de la feature "Partidos" en repos de práctica, uno por dev: Docker, modelo Prisma, CRUD en NestJS y vista con cards (SPO-113…SPO-126). Más alcance del que pedía el paquete. | — |
| 3.1.3 | Buenas prácticas | ✅ | Convención de ramas `feature/SPO-###`, commits `feat(SPO-###)`, PR contra `dev`, uso de Linear. Escrito en `sportmatch/AGENTS.md`. | — |
| 3.2.1 | Repos y entornos | ✅ | Monorepo `front/` + `back/` + Postgres local con Docker Compose (SPO-143, SPO-144, SPO-145, SPO-146). | — |
| 3.2.2 | BD inicial con seed | ✅ | Migraciones y `npm run db:seed` funcionando (SPO-146, SPO-163). | El dataset rico para la demo es aparte: 8.1.1. |
| 3.2.3 | Pipeline de CI | ✅ | CI en GitHub Actions con build, lint y typecheck (SPO-148), hook pre-push con Husky (SPO-147), workflow orquestador único para PRs y merges (SPO-174) y dos hotfix de raíz (SPO-184, SPO-194). | — |

## 4.0 Autenticación

| WBS | Paquete | Estado | Qué se hizo | Qué falta |
|---|---|---|---|---|
| 4.1.1 | Modelo de usuario | ✅ | `User` con `firebaseUid`, email, nombre y foto; módulo `users` en 4 capas con CRUD completo (SPO-149, SPO-155). | — |
| 4.1.2 | Registro, login y logout | ✅ | **Resuelto con Firebase Auth en vez de sesiones propias:** `firebase-admin` en el back (SPO-151), SDK y `AuthProvider` en el front (SPO-153), cliente API que adjunta el ID token (SPO-154), y `GET /users/me` que hace upsert del usuario desde Firebase en el primer login (SPO-157). | — |
| 4.1.3 | Middleware de rutas privadas | ✅ | `FirebaseAuthGuard` protegiendo el CRUD (SPO-152), route group `(app)` con layout privado y tab bar (SPO-165), router ordenado (SPO-177) y autorización fina: guard "es mi cuenta" y reglas del organizador (SPO-185). | — |
| 4.2.1 | Pantalla de registro e inicio de sesión | ✅ | Login y signup con email/password (SPO-158), login con Google (SPO-159), recuperar contraseña (`/forgot-password`) y arreglos de legibilidad (SPO-214). | — |

## 5.0 Perfil de Usuario

| WBS   | Paquete                       | Estado | Qué se hizo                                                                                                                                                                                                | Qué falta                                                                                                                                                                                                                              |
| ----- | ----------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1.1 | Modelo de perfil              | 🟡     | `User` tiene nombre, email y foto.                                                                                                                                                                         | **Deportes y ubicación del usuario no están en el modelo.** El `nivel` sí se sacó a propósito: por decisión de producto es del partido, no del usuario — ese desvío conviene declararlo en el steering, no arrastrarlo como pendiente. |
| 5.1.2 | API de perfil                 | ✅      | `GET /users/me` con upsert (SPO-157), `GET /users/:id` y `PATCH /users/:id` con guard de dueño (SPO-155, SPO-185, SPO-212).                                                                                | —                                                                                                                                                                                                                                      |
| 5.1.3 | API de historial              | ✅      | `GET /partidos/mios` devuelve organizados, jugando y jugados (SPO-172, SPO-187), más `requested` y `rating_pending` por partido (SPO-213). También `GET /partidos/played-by/:userId` para el perfil ajeno. | —                                                                                                                                                                                                                                      |
| 5.1.4 | Servicio de cálculo de rating | 🟡     | El promedio de ratings recibidos se calcula en `users.service` y sale en la API para cualquier usuario (SPO-212).                                                                                          | La penalización por no-show (depende de 6.4.3, que no existe).                                                                                                                                                                         |
| 5.2.1 | Vista de perfil               | ✅      | Perfil propio con foto, nombre, tiles y partidos recientes (SPO-142, SPO-191) y perfil público de otro jugador, sin datos personales ni ajustes (SPO-216).                                                 | —                                                                                                                                                                                                                                      |
| 5.2.2 | Edición de perfil             | ⬜      | El endpoint `PATCH /users/:id` existe y funciona.                                                                                                                                                          | **La pantalla: no hay ninguna ruta de edición de perfil en el front.** Es el hueco más visible del módulo 5.0 en la demo.                                                                                                              |
| 5.2.3 | Vista de historial            | 🟡     | El perfil muestra "Partidos recientes" con datos reales, hasta 4 (SPO-191).                                                                                                                                | El "Ver todos" con el historial completo de partidos jugados (SPO-209, **en backlog**). Hoy ese link lleva a `/mis-partidos`, que muestra los partidos por jugar — o sea, va a un lugar equivocado.                                    |
| 5.2.4 | Visualización de rating       | ✅      | Los tres tiles del perfil —Puntaje, Partidos y Semanas— salen con datos reales (SPO-191, SPO-212) y hay aviso de partidos sin calificar (SPO-218).                                                         | El "estado reputacional" del enunciado no se hizo: se muestra el número, no una etiqueta. Decisión del PO.                                                                                                                             |

## 6.0 Gestión de Partidos

| WBS | Paquete | Estado | Qué se hizo | Qué falta |
|---|---|---|---|---|
| 6.1.1 | Modelo de partido | ✅ | `Partido` con deporte, nivel, fecha, ubicación, cupo, descripción y organizador, más migración y seed (SPO-163). Sin título, por decisión de producto. | — |
| 6.1.2 | CRUD de partidos | ✅ | Módulo `partidos` en 4 capas con `POST`, `GET`, `PATCH` y `DELETE` (SPO-164) y participantes embebidos en el detalle (SPO-182). | — |
| 6.1.3 | Listado de partidos disponibles | ✅ | `GET /partidos` con `deporte` anidado y `estoy_anotado` (SPO-170), y excluyendo los que organizo, los que ya tengo y los llenos (SPO-186). | — |
| 6.1.4 | Cancelación con motivo | ⬜ | — | Todo: `Partido` no tiene estado ni campo motivo. |
| 6.2.1 | Formulario de creación | ✅ | Primero un formulario simple (SPO-166), después el wizard de 5 pasos de las pantallas 06–10 (SPO-189), con deportes traídos de la API (SPO-183). | Mejorar el paso 3 (Horario) con Date Picker y Time Picker: hoy son tres filas con scroll y no deja elegir más allá de 14 días (SPO-210, **en backlog**). |
| 6.2.2 | Formulario de edición | ✅ | El mismo wizard en modo edición contra `PATCH /partidos/:id` (SPO-219). | — |
| 6.2.3 | Detalle de partido | ✅ | Detalle con participantes, "Unirme" / "Salirme" (SPO-179) y variante de partido ya jugado, sin inscripción (SPO-208). | — |
| 6.2.5 | Interfaz de cancelación | ⬜ | — | Todo. Depende de 6.1.4. |
| 6.2.6 | Aviso de cancelación | ⬜ | — | Todo. Depende de notificaciones (11.1.3), fuera de alcance. |
| 6.3.1 | Modelo de solicitud | ✅ | `JoinRequest` con estados PENDING / ACCEPTED / REJECTED (SPO-196). | — |
| 6.3.2 | Envío de solicitud | ✅ | Dos caminos: unirse directo mientras haya cupo (SPO-168) y pedir sumarse cuando corresponde solicitud (SPO-196). Bajarse de un partido con `DELETE /partidos/:id/participantes/me` (SPO-171). | — |
| 6.3.3 | Gestión por el organizador | ✅ | `PATCH /join-requests/:id` para aceptar o rechazar (SPO-197) y panel del organizador en el detalle del partido (SPO-199). | SPO-206 (montar ese panel también en la card de "Tus partidos") quedó **cancelado a propósito**: el panel vive en el detalle y alcanza. |
| 6.3.4 | Estado de la solicitud | ✅ | El jugador ve su estado en el mazo y en el detalle (SPO-198), `requested` viaja en `GET /partidos/mios` (SPO-213) y el panel muestra solo pendientes más "Esperando respuesta" en Tus partidos (SPO-217). | — |
| 6.4.1 | Modelo de calificación | ✅ | `Rating` de 1 a 5 con comentario, atado a partido y a los dos usuarios; `GET /ratings/pending` resuelve a quién me toca calificar (SPO-207) y `POST /partidos/:id/ratings` recibe las calificaciones (SPO-211). | — |
| 6.4.2 | Interfaz de calificación | 🟡 | El detalle del partido jugado ya está (SPO-208) y el modal para puntuar a los compañeros está en vuelo para el steering (SPO-215), junto con el aviso en el perfil (SPO-218). | Cerrar SPO-215 y SPO-218: **hoy no hay una sola línea de UI de rating en `front/src`.** Es el pendiente más caliente de la semana. |
| 6.4.3 | Penalización por no-show | ⬜ | — | Todo: no existe el concepto de no-show en el modelo. |
| 6.5.1 | Link compartible | ⬜ | La landing pública en `/` (SPO-192) es la base técnica: ya hay una ruta que se ve sin sesión. | El link por partido y la vista de solo lectura. |
| 6.5.2 | Invitación directa | ⬜ | — | Todo. Depende de notificaciones. |
| 6.5.3 | Aceptación de invitación | ⬜ | — | Todo. |

## 7.0 Sistema de Matchmaking

| WBS | Paquete | Estado | Qué se hizo | Qué falta |
|---|---|---|---|---|
| 7.1.1 | Búsqueda de partidos | 🟡 | `GET /partidos` ya filtra por cupo disponible y excluye los propios y los ya anotados (SPO-186), ordenado por fecha. | Búsqueda real por deporte, ubicación, fecha y nivel. No hay query params. |
| 7.1.2 | Filtros | ⬜ | — | Los chips de deporte en `/buscar` están escritos y estimados, pero quedaron **en backlog** (SPO-193). Es 1 SP y es lo que más se nota en el uso. |
| 7.1.3 | Ordenamiento por rating y compatibilidad | ⬜ | — | Todo. Depende de 7.1.1 y 5.1.4. |
| 7.2.1 | Tarjeta de partido | ✅ | Mazo de tarjetas de la pantalla 04, con estado vacío cuando no hay partidos (SPO-178). | Toast al sumarse y que "Empezar de nuevo" refresque el mazo en vez de repetir partidos ya tomados (SPO-190, **en backlog**). |
| 7.2.2 | Navegación tipo swipe | ✅ | Deslizar suma o descarta, y se puede abrir el detalle desde la tarjeta (SPO-178, SPO-179, SPO-198). | — |
| 7.3.1 | Integración con proveedor de mapa | ⬜ | — | Todo. **Descartado a propósito** para llegar al 17/09: no se contrató proveedor ni se tocaron coordenadas. |
| 7.3.2 | Partidos en el mapa | ⬜ | — | Todo. Además falta el paso previo: `Partido.ubicacion` es texto libre, no hay coordenadas. |
| 7.3.3 | Detalle desde el mapa | ⬜ | — | Todo. |

## 8.0 QA Manual y Validación

| WBS | Paquete | Estado | Qué se hizo | Qué falta |
|---|---|---|---|---|
| 8.1.1 | Dataset de demo | ⬜ | Hay una seed mínima (deportes y poco más) que corre con `npm run db:seed`. | El dataset representativo desde JSON por entidad, incluyendo solicitudes sembradas (SPO-188, **en backlog desde la semana 5**). **Riesgo directo sobre la demo del 17/09:** sin datos, el panel del organizador y el rating no se pueden mostrar con naturalidad. |
| 8.1.2 | Prueba manual de autenticación | ✅ | Checklist de login, signup, Google, logout y rutas protegidas en `sportmatch/docs/smoke-test.md`, ejecutado después de cada deploy. | — |
| 8.1.3 | Prueba manual de perfil | 🟡 | Se probó visualización, tiles y partidos recientes. | No hay edición ni historial completo que probar (5.2.2, 5.2.3). |
| 8.1.4 | Prueba manual de partidos | ✅ | Cubierto en el smoke test y en la revisión automática de cada PR. | — |
| 8.1.5 | Prueba manual de solicitudes | ✅ | Cubierto en el smoke test y en la revisión de cada PR; el flujo completo solicitar → aceptar → rechazar se probó a mano con dos cuentas. | — |
| 8.1.6 | Prueba manual de matchmaking | 🟡 | Swipe probado end-to-end. | Mapa y filtros: no existen. |
| 8.1.7 | Prueba manual de rating | ⬜ | — | Se puede recién cuando cierre 6.4.2 (SPO-215). |
| 8.1.8 | Prueba de notificaciones | ⬜ | — | Fuera de alcance. |
| 8.1.9 | Prueba de invitaciones | ⬜ | — | Fuera de alcance. |
| 8.1.10 | Prueba de moderación | ⬜ | — | Fuera de alcance. |
| 8.2.1 | Guion de prueba | ⬜ | — | Todo. |
| 8.2.2 | Ejecución con usuarios | ⬜ | — | Todo. **Es el paquete más caro que no se hizo** (11.5 h estimadas) y el que rompe la cadena hacia 8.2.4 y 1.4.1. |
| 8.2.3 | Registro de feedback | ⬜ | — | Todo. Hay feedback informal de QA (los BUG-1…BUG-5 que resolvió SPO-214), pero no una ronda con usuarios. |
| 8.2.4 | Backlog de ajustes finales | ⬜ | — | Todo. En los hechos, el backlog de SPO-188…SPO-210 cumple esa función, pero no salió de una validación con usuarios. |

## 9.0 Deployment

| WBS | Paquete | Estado | Qué se hizo | Qué falta |
|---|---|---|---|---|
| 9.1.1 | Ambiente productivo | ✅ | Neon como base gestionada, con variables por entorno (SPO-173). Antes: `Dockerfile` de producción del back (SPO-161) e imagen publicada en GHCR en cada merge (SPO-167). | — |
| 9.1.2 | Deploy final del MVP | ✅ | Front en Vercel y back en Azure Web App, con redeploy automático en cada merge a `dev` (SPO-175, SPO-176). | **Aclaración para el steering:** por decisión explícita, un merge a `main` **no** despliega producción (SPO-194). La demo va contra el entorno `dev`, que es el que está vivo y actualizado. |
| 9.1.3 | Smoke test post-deploy | ✅ | Checklist completo en `sportmatch/docs/smoke-test.md`: entornos, datos de la ejecución, pasos y registro de fallas (SPO-176). | — |

## 10.0 Documentación Final

| WBS | Paquete | Estado | Qué se hizo | Qué falta |
|---|---|---|---|---|
| 10.1.1 | Manual de uso | ⬜ | — | Todo. Depende del deploy, que ya está: se puede escribir ahora. |
| 10.1.2 | Entrega final de diseño | 🟡 | El Figma tiene todas las pantallas del MVP implementado. | Consolidarlo como entregable. Los flujos 2.2.7 y 2.2.8 no van a existir. |
| 10.2.1 | README del proyecto | ✅ | `sportmatch/README.md` con instalación y ejecución local, más `sportmatch/AGENTS.md` con las reglas técnicas del repo. | — |
| 10.2.2 | Documentación de APIs y modelo | ⬜ | — | Todo. Hay 22 endpoints y 6 entidades sin documentar. Es barato (1.5 h) y sostiene el entregable final. |

## 11.0 Notificaciones · 12.0 Moderación

| WBS | Paquete | Estado |
|---|---|---|
| 11.1.1 … 11.2.3 | Los 7 paquetes de notificaciones | ⬜ Fuera de alcance. No se empezó: ni modelo, ni proveedor, ni centro de notificaciones. |
| 12.1.1 … 12.2.3 | Los 6 paquetes de moderación | ⬜ Fuera de alcance. No se empezó: ni reportes, ni panel, ni suspensión. |

Los dos módulos se declararon fuera de alcance para el 17/09 cuando se vio que el calendario no daba. Arrastran
con ellos 2.2.7, 2.2.8, 6.2.6, 6.5.2, 8.1.8 y 8.1.10.

---

# Lo que se hizo y **no está en la WBS**

Trabajo de producto y de proceso que se entregó y no tiene paquete propio. No son fixes ni deuda técnica:
son features y entregables que se agregaron en la ejecución. Esto es lo que hay que incorporar a la WBS
antes de rehacer el cronograma, porque hoy son horas que se trabajaron y no figuran en ningún lado.

| # | Qué se agregó | Tickets | SP | Dónde debería colgar |
|---|---|---|---|---|
| E1 | **Landing pública en `/`** para quien entra sin sesión. Antes `/` redirigía a `/login` y nadie sin cuenta veía de qué se trata la app. | SPO-192 | 2 | 4.2 o un paquete nuevo "Presentación del producto". |
| E2 | **Splash animado de entrada**, en CSS/SVG, que se ve una vez al entrar después de login o registro. | SPO-192 | — | Junto con E1. |
| E3 | **Tab bar y shell de navegación**: el route group `(app)` con layout privado y las 5 pestañas. La WBS no tiene ningún paquete de navegación, y es la pieza que sostiene todas las pantallas. | SPO-165, SPO-177 | 3 | Paquete nuevo en 2.2 / 4.1. |
| E4 | **Pantalla "Tus partidos"** (pantalla 11): los que organizás y los que jugás, separados. La WBS solo preveía historial dentro del perfil. | SPO-180 | 2 | Paquete nuevo en 6.2. |
| E5 | **Autenticación federada con Google** y Firebase Auth como proveedor, en lugar de sesiones propias. Cambia el supuesto de 4.1.2. | SPO-151, SPO-152, SPO-153, SPO-154, SPO-159 | 7 | Reescribe 4.1.2. |
| E6 | **Recuperación de contraseña** (`/forgot-password`). | SPO-158 | — | 4.2.1. |
| E7 | **Catálogo de deportes como entidad**: modelo `Deporte`, `GET /deportes` y front consumiéndolo en vez de una lista hardcodeada. | SPO-169, SPO-183 | 2 | 6.1 o 2.3.1. |
| E8 | **Bajarse de un partido** y **unirse directo mientras haya cupo**, que es el flujo real de la demo — distinto del circuito de solicitud con aprobación que preveía la WBS. | SPO-168, SPO-171 | 3 | 6.3, como alternativa a 6.3.2. |
| E9 | **Perfil público de otro jugador** y estadísticas calculadas (Puntaje, Partidos jugados, Semanas activas). La WBS solo tenía perfil propio y rating. | SPO-212, SPO-216 | 4 | 5.2, paquete nuevo. |
| E10 | **Agentes de IA de QA sobre cada PR**: instalación del paquete en el repo, QA PR Review Agent que deja una review con observaciones contra los criterios QA-01…QA-10, y harness e2e. Es lo que reemplazó al QA manual sistemático. | SPO-135, SPO-181, SPO-195 | 3 | Paquete nuevo en 8.1 — cambia la naturaleza del módulo 8.0. |
| E11 | **Contenedorización y registry**: `Dockerfile` de producción del back e imagen publicada sola en GHCR en cada merge a `dev`. La WBS daba el deploy por hecho sin este paso. | SPO-161, SPO-167 | 3 | 9.1, paquete nuevo. |
| E12 | **Hook pre-push con Husky** y workflow orquestador único para PRs y merges. La WBS pedía "build, lint y typecheck"; se entregó bastante más. | SPO-147, SPO-174 | 3 | Amplía 3.2.3. |
| E13 | **Capacitación con repos de práctica**: cuatro repos privados donde cada dev implementó la feature "Partidos" entera antes de tocar el producto. La WBS estimaba 3 h de "nivelación". | SPO-113…SPO-126 | — | Amplía 3.1.2. |
| E14 | **Refactor de idioma** (código en inglés, producto en castellano) con glosario de renombres en `AGENTS.md`. Escrito y estimado, **no ejecutado**. | SPO-200…SPO-205 | 10 | Paquete nuevo de deuda técnica. |

**Peso:** los extras ya entregados suman del orden de **32 SP**, casi dos semanas enteras de las cinco de
desarrollo del S1. Ese es el motivo principal por el que el cronograma original no cierra contra la realidad: no es
que se haya trabajado menos, es que se trabajó en cosas que la WBS no tenía.

---

# Insumos para rehacer el cronograma

**Calendario real ejecutado:** el S1, primer sprint mensual del Charter, en 6 semanas de jueves a jueves.
Capacidad 6 SP por dev por semana, 18 SP por semana, 3 devs.

| Semana del S1 | Cierre | SP entregados | Capacidad | Lectura |
|---|---|---|---|---|
| 1 · Capacitación | 13/08 | — | — | Ejercicio previo en repos de práctica (SPO-113…SPO-126). |
| 2 | 20/08 | 18 | 18 | Setup, Firebase Auth y modelo `User`. |
| 3 | 27/08 | 16 | 18 | Perfil, modelo `Partido`, CI y Docker. |
| 4 | 03/09 | 20 | 18 | Deploy, swipe, detalle de partido. Recupera lo de la semana 3. |
| 5 | 10/09 | 18 | 18 | Solicitudes, wizard, "Tus partidos". |
| 6 | 17/09 | 10 + 8 en vuelo | 18 | Rating, perfil ajeno, landing. |

**90 SP entregados sobre una capacidad de 90.** La velocity fue exacta: el desvío del proyecto no está en
la ejecución ni en la estimación, está en el alcance — entraron ~32 SP de entregables que la WBS no tenía.

> **Unidades.** Esta lectura es en story points de Linear. En horas de la WBS (Cronograma v4 §5), los paquetes
> cerrados suman 122,07 h estimadas y entraron en 108 h de capacidad: la estimación quedó del lado conservador.
> Las dos lecturas son compatibles. Para el steering se presenta la del Cronograma v4.

**Pendiente vivo en backlog al 15/09 — 16 SP:**

| Ticket | SP | Qué es | WBS |
|---|---|---|---|
| SPO-188 | 1 | Dataset de demo desde JSON | 8.1.1 |
| SPO-193 | 1 | Filtro por deporte con chips | 7.1.2 |
| SPO-190 | 1 | Toast al sumarse + refrescar el mazo | 7.2.1 |
| SPO-209 | 1 | Historial completo de partidos jugados | 5.2.3 |
| SPO-210 | 2 | Date Picker y Time Picker en el wizard | 6.2.1 |
| SPO-200…205 | 10 | Refactor de idioma | E14 |

**Lo que hay que decidir antes de armar el cronograma nuevo:**

1. Qué se hace con los módulos 11.0 y 12.0: ¿salen de la WBS, o quedan como fase 2 con fecha posterior al 17/09?
2. Ídem 7.3 (mapa) y 8.2 (validación con usuarios): son los dos bloques grandes que quedaron sin ejecutar.
3. Si los 14 extras entran a la WBS como paquetes, el alcance entregado sube y el desvío de cronograma se
   explica solo. Si no entran, quedan 32 SP de trabajo invisible.
4. 5.2.2 (editar perfil) no tiene ticket escrito y es el hueco más visible que queda del módulo 5.0.
