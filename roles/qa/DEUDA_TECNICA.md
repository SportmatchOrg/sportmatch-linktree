# Deuda técnica — Auditoría QA

**Fecha:** 2026-09-17 · **Entorno:** `dev` · **Target:** [https://sportmatch-git-dev-sportmatch2.vercel.app](https://sportmatch-git-dev-sportmatch2.vercel.app)
**Método:** caja negra con Playwright headless (desktop 1280, iPhone 14 touch, tablet 768), 2 cuentas de prueba, recorrido de todas las rutas en ambos roles (organizador y jugador) + pruebas directas contra la API.

**Stack observado:** Next.js (App Router) en Vercel · Firebase Auth · API NestJS en Azure (`sportmatch-dev-*.brazilsouth-01.azurewebsites.net`).

> No se leyó código fuente: la app desplegada vive en otro proyecto, no en este repo.

## Resumen


| ID                                                                      | Hallazgo                                                | Área           | Severidad | Estado    |
| ----------------------------------------------------------------------- | ------------------------------------------------------- | -------------- | --------- | --------- |
| [DT-01](#dt-01--el-título-del-partido-se-pide-se-muestra-y-se-descarta) | El título del partido se pide, se muestra y se descarta | `front` `back` | Alta      | Pendiente |
| [DT-02](#dt-02--se-pierde-el-deep-link-al-pasar-por-login)              | Se pierde el deep link al pasar por login               | `front`        | Alta      | Pendiente |
| [DT-03](#dt-03--la-app-se-puede-embeber-en-un-iframe-clickjacking)      | La app se puede embeber en un iframe (clickjacking)     | `infra`        | Alta      | Pendiente |
| [DT-04](#dt-04--jugadores-totales-no-incluye-al-organizador)            | "Jugadores totales" no incluye al organizador           | `front` `back` | Media     | Pendiente |
| [DT-05](#dt-05--en-mobile-el-deck-no-tiene-botones-de-acción)           | En mobile el deck no tiene botones de acción            | `front`        | Media     | Pendiente |
| [DT-06](#dt-06--las-cards-del-deck-no-son-accesibles-por-teclado)       | Las cards del deck no son accesibles por teclado        | `front` `a11y` | Media     | Pendiente |
| [DT-07](#dt-07--los-inputs-de-login-y-signup-no-tienen-label)           | Los inputs de login y signup no tienen label            | `front` `a11y` | Media     | Pendiente |
| [DT-08](#dt-08--la-página-404-es-la-default-de-nextjs-en-inglés)        | La página 404 es la default de Next.js, en inglés       | `front`        | Baja      | Pendiente |
| [DT-09](#dt-09--el-ítem-ajustes-del-menú-de-perfil-no-hace-nada)        | El ítem "Ajustes" del menú de perfil no hace nada       | `front`        | Baja      | Pendiente |
| [DT-10](#dt-10--polling-de-60-reqmin-por-pestaña)                       | Polling de 60 req/min por pestaña                       | `front` `back` | Baja      | Pendiente |
| [DT-11](#dt-11--el-estado-de-pasar-no-persiste)                         | El estado de "pasar" no persiste                        | `front`        | Baja      | Pendiente |
| [DT-12](#dt-12--errores-de-consola-durante-el-login-con-google)         | Errores de consola durante el login con Google          | `front`        | Baja      | Pendiente |
| [DT-13](#dt-13--hooks-de-datos-todavía-en-useeffect)                    | Hooks de datos todavía en `useEffect`                   | `front`        | Baja      | Pendiente |


**Severidad:** Alta = pérdida de datos, riesgo de seguridad o flujo roto de cara al usuario · Media = funcionalidad degradada o barrera de accesibilidad · Baja = pulido, performance o ruido.

**Origen:** DT-01 a DT-12 salen de la auditoría de caja negra del 2026-09-17. DT-13 sale de lo que el propio equipo dejó anotado como fuera de alcance en `[issue-solicitudes-tiempo-real.md](issue-solicitudes-tiempo-real.md)`.

**Issues relacionados:** DT-10 ya tiene plan de resolución escrito en `[issue-solicitudes-tiempo-real.md](issue-solicitudes-tiempo-real.md)` (SSE + TanStack Query). Ese documento es la fuente de verdad del diseño; acá sólo se lo referencia para no duplicarlo.

---



## Hallazgos



### DT-01 · El título del partido se pide, se muestra y se descarta

**Áreas:** `front`, `back` · **Severidad:** Alta

El paso 4 del wizard (`/partidos/nuevo`) tiene un campo `TÍTULO`. El paso 5 lo muestra de vuelta en la revisión ("Título | QA AUDIT MATCH - borrar"). Después se pierde: nunca se persiste.

Evidencia:

- El registro que devuelve la API no tiene campo `titulo`:
  ```json
  {"id":"...","deporteId":"...","nivel":"AVANZADO","fecha":"...","ubicacion":"...",
   "cupo":8,"descripcion":"...","organizadorId":"...","organizador":{...},"deporte":{...}}
  ```
- `PATCH /partidos/:id` con `{"titulo":"..."}` responde `400 {"message":["property titulo should not exist"]}`.
- El formulario de edición (`/partidos/:id/editar`) carga el campo vacío, aunque el resto sí viene precargado.
- El detalle del partido nunca muestra un título.

**Impacto:** el usuario escribe un dato que se pierde en silencio, sin ningún aviso.

**A decidir:** o se agrega `titulo` al modelo y al DTO, o se saca el campo del wizard y de la pantalla de revisión. Hoy la UI promete algo que el back no soporta.

---



### DT-02 · Se pierde el deep link al pasar por login

**Áreas:** `front` · **Severidad:** Alta

Cualquier ruta privada (`/partidos/:id`, `/mis-partidos`, `/perfil`) redirige a `/login` cuando no hay sesión — correcto. El problema es lo que pasa después: al iniciar sesión, el usuario cae siempre en `/buscar`, no en la ruta que pidió.

Repro:

1. Sesión cerrada, abrir `https://.../partidos/<id>` → redirige a `/login`.
2. Iniciar sesión.
3. Termina en `/buscar`. El partido quedó por el camino.

**Impacto:** alto para el ciclo de crecimiento del producto. Si alguien comparte el link de un partido y quien lo recibe no tiene sesión abierta, nunca llega a ese partido: aterriza en el deck genérico.

**Fix sugerido:** guardar la ruta original (query `?next=` o `sessionStorage`) en el guard que redirige, y restaurarla después del login.

---



### DT-03 · La app se puede embeber en un iframe (clickjacking)

**Áreas:** `infra` · **Severidad:** Alta

No hay `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` ni `Permissions-Policy`.

Verificado: una página en un origen arbitrario embebe `/login` en un `<iframe>` y se renderiza completo, formulario incluido.

Lo que sí está presente y correcto: `strict-transport-security: max-age=63072000; includeSubDomains; preload` y `x-robots-tag: noindex`.

**Fix sugerido:** `headers()` en `next.config` con al menos `frame-ancestors 'none'` (vía CSP), `X-Content-Type-Options: nosniff` y `Referrer-Policy: strict-origin-when-cross-origin`.

---



### DT-04 · "Jugadores totales" no incluye al organizador

**Áreas:** `front`, `back` · **Severidad:** Media

El back excluye al organizador de los participantes de forma deliberada:

```
POST /partidos/:id/join-requests  (como organizador)
→ 400 {"message":"The organizer cannot request to join"}
```

Pero la UI no lo dice en ningún lado. Un partido recién creado por vos muestra `JUGADORES 0/8`, "8 lugares libres" y "Todavía no se anotó nadie", y el wizard etiqueta el campo como **"Jugadores totales"**.

**Impacto:** si ponés 8 para un partido de tenis, van a jugar 9 personas. El cupo real es `cupo + 1` y nada lo comunica.

**A decidir:** o se renombra la etiqueta (p. ej. "Jugadores que buscás" / "Lugares disponibles"), o el organizador pasa a contar como participante. Lo importante es que el número que se ve sea el número de gente en la cancha.

---



### DT-05 · En mobile el deck no tiene botones de acción

**Áreas:** `front` · **Severidad:** Media

En desktop `/buscar` muestra dos botones bajo la card: ✗ (Pasar) y ✓ (Sumarme al partido).

En un perfil iPhone 14 con touch real, el único botón visible en toda la pantalla es "Mapa" (que además está deshabilitado). Tampoco hay texto que sugiera deslizar (no aparece "desliz", "swipe" ni "arrastrá" en el DOM).

Sí funciona tocar la card → abre el detalle → "Pedir sumarme". O sea que no es un callejón sin salida, pero la superficie mobile principal no ofrece ninguna forma visible de aceptar o pasar.

**Fix sugerido:** replicar los botones ✗/✓ en mobile, o agregar un hint visible de gesto la primera vez.

---



### DT-06 · Las cards del deck no son accesibles por teclado

**Áreas:** `front`, `a11y` · **Severidad:** Media · **WCAG 2.1.1 (Keyboard)**

Las cards de partido son `<div>` planos: sin `role`, sin `tabindex`, sin `href`.

Orden de tabulación real en `/buscar`:

```
SportMatch → Descubrir → Partidos → Mapa → Perfil → Crear partido → QA
           → Pasar → Sumarme al partido → (body)
```

La card nunca recibe foco. Un usuario de teclado no puede abrir el detalle de un partido desde el deck. Como efecto secundario tampoco se puede abrir en pestaña nueva ni copiar el link, porque no hay `<a href>`.

**Fix sugerido:** envolver la card en un `<a href="/partidos/:id">` (resuelve teclado, foco, menú contextual y open-in-new-tab de una).

---



### DT-07 · Los inputs de login y signup no tienen label

**Áreas:** `front`, `a11y` · **Severidad:** Media · **WCAG 1.3.1 / 3.3.2**

Todos los inputs de `/login` y `/signup` no tienen `<label>` asociado ni `aria-label`: sólo `placeholder`, que desaparece apenas se escribe.

```
type=email    ph="Email"              aria-label=NONE  labelled=false
type=password ph="Contraseña"         aria-label=NONE  labelled=false
type=text     ph="Nombre completo"    aria-label=NONE  labelled=false
type=password ph="Repetir contraseña" aria-label=NONE  labelled=false
```

Vale la pena notar que el botón de mostrar contraseña **sí** tiene `aria-label="Mostrar contraseña"` — el etiquetado se pensó, faltó aplicarlo a los campos.

**Fix sugerido:** `<label>` visible o, como mínimo, `aria-label` en cada input.

---



### DT-08 · La página 404 es la default de Next.js, en inglés

**Áreas:** `front` · **Severidad:** Baja

`/ruta-inexistente` devuelve la pantalla default de Next: `404 | This page could not be found.` — en inglés, sin el shell de la app, sin navegación de vuelta.

Contrasta con el resto de los estados de error, que están bien resueltos en español:

- Partido inexistente: "No encontramos este partido · Puede que se haya cancelado o que el link esté mal." + botón "Ver otros partidos".
- Usuario inexistente: "No encontramos este jugador · Puede que el perfil ya no exista o que el link esté mal."

**Fix sugerido:** agregar `app/not-found.tsx` con el mismo tono que los otros vacíos.

---



### DT-09 · El ítem "Ajustes" del menú de perfil no hace nada

**Áreas:** `front` · **Severidad:** Baja

En `/perfil` → "Opciones de perfil" el menú tiene "Ajustes" y "Cerrar sesión". "Cerrar sesión" funciona. "Ajustes" no navega, no abre modal, no muestra nada; la URL no cambia.

Compará con "Mapa", que está resuelto bien: `aria-disabled="true"` y tooltip "Próximamente".

**Fix sugerido:** mismo tratamiento que "Mapa" (deshabilitado + "Próximamente"), o sacarlo hasta que exista la pantalla.

---



### DT-10 · Polling de 60 req/min por pestaña

**Áreas:** `front`, `back` · **Severidad:** Baja · **Ya trackeado en** `[issue-solicitudes-tiempo-real.md](issue-solicitudes-tiempo-real.md)`

Medido en `/mis-partidos` como organizador, 20 segundos en reposo:

```
10x  GET /partidos/mios
10x  GET /partidos/:id/join-requests
```

Son 60 req/min por pestaña, y escala con la cantidad de partidos que organizás: es un poll de `join-requests` por partido. Con 10 partidos organizados serían ~330 req/min por pestaña.

El reemplazo por SSE ya está diseñado en el issue existente.

---



### DT-11 · El estado de "pasar" no persiste

**Áreas:** `front` · **Severidad:** Baja

Al pasar todas las cards aparece "Viste todo por hoy · Ya viste todos los partidos cerca. Volvé más tarde." con un botón "Empezar de nuevo".

Pero un simple refresh devuelve todos los partidos pasados. El copy ("volvé más tarde") sugiere persistencia que no existe.

**A decidir:** o se persiste el descarte, o se ajusta el copy para que no prometa algo que no pasa.

---



### DT-12 · Errores de consola durante el login con Google

**Áreas:** `front` · **Severidad:** Baja

El popup de Google abre bien y el botón muestra su estado "Conectando…". En la consola quedan:

```
404 GET https://sportmatch-84856.firebaseapp.com/__/firebase/init.json
[error] Cross-Origin-Opener-Policy policy would block the window.closed call.
[warning] No available adapters.
```

No bloquean el flujo, pero ensucian la consola y el COOP puede complicar la detección de cierre del popup en algunos navegadores.

---



### DT-13 · Hooks de datos todavía en `useEffect`

**Áreas:** `front` · **Severidad:** Baja · **Fuente:** declarado fuera de alcance en `[issue-solicitudes-tiempo-real.md](issue-solicitudes-tiempo-real.md)`

> No verificado en esta auditoría (no se leyó código fuente). Queda acá porque el equipo ya lo identificó y no tiene ticket propio: el issue dice *"va en otro issue"*, y ese issue todavía no existe.

El issue de SSE migra a TanStack Query sólo tres hooks (`use-join-requests`, `use-partido`, `use-partidos-mios`). El resto sigue resolviendo fetching a mano con `useEffect`: `use-partidos`, `use-deportes`, `use-public-profile`, `use-rating-targets`.

**Impacto:** convivencia de dos patrones de data fetching en la misma app. Cada hook con `useEffect` vuelve a resolver por su cuenta control de carrera, estados de carga y error, e invalidación — que es exactamente el trabajo manual que el issue de SSE describe como costo a eliminar.

**Fix sugerido:** terminar la migración una vez que el issue de SSE esté mergeado, para no mantener los dos patrones en paralelo más tiempo del necesario.

---



## Verificado y funcionando

Lo que se probó y pasó, para que no se re-audite:

**Seguridad y autorización**

- Guard de sesión en todas las rutas privadas.
- Errores de login genéricos ("Email o contraseña incorrectos") — sin enumeración de usuarios.
- Recuperar contraseña con mensaje neutro: "Si  tiene una cuenta, te va a llegar un mail…" — sin enumeración.
- API sin token → `401`. Token inválido → `401`.
- IDOR de lectura: `GET /partidos/:id/join-requests` de otro → `403 "Only the organizer can manage join requests"`.
- IDOR de escritura: `PATCH` y `DELETE` sobre un partido ajeno → `403 "Only the organizer can modify this partido"`.
- `/partidos/:id/editar` de otro → pantalla "Solo el organizador puede editar este partido".
- Payload XSS (`<img src=x onerror=alert(1)>`) guardado en `ubicacion`: se renderiza como texto, no ejecuta. Sin `alert`, sin nodo `<img>` en el DOM.
- CORS restringido al origen de Vercel incluso enviando un `Origin` falso — no es `*`.
- HSTS presente y `x-robots-tag: noindex` en el preview.

**Reglas de negocio (todas validadas del lado del servidor)**

- Solicitud duplicada → `409 "You already joined this partido"`.
- Organizador pidiendo sumarse a su propio partido → `400`.
- `cupo` menor a 2 → `400 "cupo must not be less than 2"`.
- `fecha` en el pasado → `400 "fecha must be in the future"`.
- `ubicacion` de 5000 caracteres → `400 "must be shorter than or equal to 120 characters"`.
- DTO con whitelist: propiedad desconocida → `400 "property X should not exist"`.

**Flujos**

- Ciclo completo: crear → descubrir → solicitar → aceptar → salirse → cancelar. Los contadores quedan consistentes de los dos lados en cada paso (`0/8` → `1/8` → `0/8`).
- El selector de horario deshabilita las horas pasadas **y los minutos pasados** cuando el día es hoy, y los vuelve a habilitar al elegir un día futuro. Además reubica la selección sola (19:00 → 19:30 a las 19:29).
- Validación por paso del wizard: "Elegí un deporte.", "La ubicación necesita al menos 3 caracteres.", "Elegí un nivel."
- Límites de jugadores: 2 a 30, con los botones deshabilitados en los extremos.
- El formulario de edición precarga todo (deporte con `aria-pressed`, ubicación, día, hora, cupo, nivel, descripción) — salvo el título, ver DT-01.
- Acciones destructivas con confirmación y copy claro: "Se cancela para todos los jugadores. No se puede deshacer." / "Se libera tu lugar para que lo tome otra persona."
- Logout limpio: no hay fuga de datos con el botón atrás.
- Partido cancelado → su URL muestra el vacío correcto.
- Estados vacíos en español y bien redactados en todas las pantallas.

**Responsive y runtime**

- Sin overflow horizontal en 360, 390 y 768 px.
- **Cero errores de consola o de página en todas las rutas** (`/`, `/login`, `/signup`, `/forgot-password`, `/buscar`, `/mis-partidos`, `/perfil`, `/partidos/nuevo`, `/partidos/:id`, `/partidos/:id/editar`, `/usuarios/:id`).

> La autorización del lado del servidor está bien hecha: toda restricción que la UI impone se verificó que la API la aplica por su cuenta.



## Datos de prueba

El partido de prueba quedó cancelado (`404`). Quedaron dos cuentas en el Firebase de dev, conviene borrarlas:

- `qa.audit.1789683782725@mailinator.com`
- `qa.audit.b.1789684465903@mailinator.com`

