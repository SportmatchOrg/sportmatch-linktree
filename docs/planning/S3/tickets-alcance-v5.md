# Tickets del alcance agregado en la v5 (creados el 14/10)

Bajada a tickets de los 11 paquetes de desarrollo nuevos de la **WBS v5** (🔷). Todos se crean en **Backlog,
sin assignee y sin `dueDate`**: la semana y el dev se fijan cuando se planee cada semana del S3. La columna
"Lane sugerida" sale del calendario del Cronograma v5 §6.

Rutas verificadas contra `origin/dev` al 14/10 (después del release #136).

| # | Ticket | WBS | Label | SP | Lane sugerida | Semana v5 | Bloqueado por |
|---|---|---|---|---:|---|---:|---|
| SPO-285 | Onboarding en el back: `User.onboardedAt` + `PATCH /users/:id/onboarding` | 5.3.1 | Backend | 2 | Pacheco | 11 | — |
| SPO-286 | Descubrir recomienda con el nivel y los deportes del perfil | 7.1.4 | Backend | 1 | Pacheco | 12 | — |
| SPO-287 | Pantalla de onboarding (`/bienvenida`) | 5.3.2 | Frontend | 3 | Rudolph | 13 | SPO-285 · diseño 2.2.9 |
| SPO-288 | Tutorial de Descubrir | 5.3.3 | Frontend | 1 | Siaba | 13 | diseño 2.2.9 |
| SPO-289 | Almacenamiento de imágenes en Azure Blob Storage (`StorageService`) | 14.1.1 | Infra | 3 | Siaba | 11 | — |
| SPO-290 | Foto de perfil propia: `POST /users/:id/photo` + Editar perfil | 14.1.2 | Backend · Frontend | 2 | Siaba | 12 | SPO-289 |
| SPO-291 | Foto del partido: `Match.photoUrl` + wizard, tarjeta y detalle | 14.1.3 | Backend · Frontend | 3 | Siaba | 11 | SPO-289 |
| SPO-292 | Módulo `ai`: proveedor, clave y límite de uso por usuario | 15.1.1 | Backend | 2 | Pacheco | 11 | decisión 10 |
| SPO-293 | `POST /ai/match-draft`: texto libre → borrador de partido | 15.1.2 | Backend | 2 | Pacheco | 11 | SPO-292 |
| SPO-294 | Crear partido por texto o voz en el wizard | 15.1.3 | Frontend | 3 | Siaba | 13 | SPO-293 · diseño 2.2.9 |
| SPO-295 | Generar foto de perfil o de partido con IA | 15.2.1 | Backend · Frontend | 4 | Siaba | 12 | SPO-290 · SPO-291 · SPO-292 |
| | **Total** | | | **26** | | | |

---

## SPO-285 · Onboarding en el back: `User.onboardedAt` + `PATCH /users/:id/onboarding`

**Referencia:** RF-02 · WBS 5.3.1

**Descripción**

Un usuario nuevo tiene que completar deportes, nivel y ciudad apenas crea la cuenta, para que Descubrir le recomiende partidos desde el primer día (7.1.4). Este ticket guarda esos datos en un solo paso y marca el onboarding como hecho, así el front sabe a quién mostrárselo.

**Pasos**

1. `back/prisma/schema.prisma`, modelo `User`: `onboardedAt DateTime?`. Migración `add_user_onboarded_at` que **marca como hechos a todos los usuarios existentes** (`UPDATE "users" SET "onboardedAt" = "createdAt";` dentro de la migración), para que el onboarding lo vean solo las cuentas nuevas.
2. `back/src/users/dto/complete-onboarding.dto.ts`: `sportIds` (array de strings, 1 a 5, únicos), `level` (`Level`, obligatorio), `city` (string, 2 a 80). Mismas validaciones que `UpdateUserDto` (`back/src/users/dto/update-user.dto.ts`), pero todos obligatorios.
3. `back/src/users/users.controller.ts`: `@Patch(':id/onboarding')` con `@UseGuards(OwnAccountGuard)`, igual que el `PATCH :id` que ya existe.
4. `back/src/users/users.service.ts`: `completeOnboarding(id, dto)`. Reusa `assertSportsExist`. Si el usuario ya tiene `onboardedAt`, `ConflictException`.
5. `back/src/users/users.repository.ts`: en una transacción, actualiza `level`, `city` y `onboardedAt: new Date()` y reemplaza los deportes con el `replaceSports` que ya usa `update`. Devuelve el usuario con `withSportList`, igual que `update`.
6. `GET /users/me` (`upsertFromFirebase`) devuelve `onboardedAt`. En el front, sumar `onboardedAt: string | null` al tipo `User` de `front/src/types/user.ts`.

**Criterios de aceptación**

- [ ] `PATCH /users/:id/onboarding` con datos válidos guarda deportes, nivel y ciudad y devuelve el usuario con `onboardedAt`.
- [ ] Después de la migración, todos los usuarios existentes tienen `onboardedAt` con fecha; una cuenta nueva lo tiene en `null`.
- [ ] Errores: **400** sin deportes, con más de 5, con nivel inválido o ciudad corta · **401** sin token · **403** sobre otra cuenta · **404** con un `sportId` inexistente · **409** si ya hizo el onboarding.
- [ ] Ningún archivo `.spec.ts`; el service no importa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Notas**

* Código en inglés; la ruta del front (`/bienvenida`) es la única en castellano.
* No se pide edad: ninguna función la usa (decisión 7 de la WBS v5).
* Se puede editar todo después desde Editar perfil (`PATCH /users/:id`), que no cambia.

**Bloqueado por:** —

---

## SPO-286 · Descubrir recomienda con el nivel y los deportes del perfil

**Referencia:** RF-04 · WBS 7.1.4

**Descripción**

Hoy `sortByCompatibility` (`back/src/matches/matches.service.ts`) usa como nivel preferido el que el usuario **más jugó** (`findPreferredLevel`) y no mira sus deportes. Un usuario nuevo no tiene historial, así que no recibe ninguna recomendación. Este ticket hace que el orden use lo que el usuario declaró en su perfil.

**Pasos**

1. `matches.service.ts`, `findPreferredLevel`: primero `user.level` del perfil; si es `null`, el nivel más jugado como hasta ahora.
2. Sumar a la comparación un criterio previo: **los partidos de un deporte del perfil del usuario van antes** (`UserSport`, los mismos que devuelve `GET /users/me`). Orden final: deporte del perfil → nivel preferido → puntaje del organizador → fecha.
3. Si hace falta leer los deportes del usuario, agregarlo en `back/src/users/users.repository.ts` y exponerlo desde `UsersService`: el service de partidos no consulta Prisma.

**Criterios de aceptación**

- [ ] Un usuario sin partidos jugados, con Pádel e Intermedio en el perfil, ve primero los partidos de pádel de nivel intermedio.
- [ ] Un usuario sin deportes ni nivel ve el mismo orden que hoy.
- [ ] `GET /matches` con filtros (`sportId`, `level`, `lat`/`lng`) sigue devolviendo lo mismo, solo cambia el orden.
- [ ] Ningún archivo `.spec.ts`; el service no importa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Notas**

* La ciudad no entra en el orden: es texto libre y no tiene coordenadas. La cercanía ya la resuelve el mapa.
* No depende de SPO-285: usa campos del perfil que existen desde SPO-278.

**Bloqueado por:** —

---

## SPO-287 · Pantalla de onboarding (`/bienvenida`)

**Referencia:** RF-02 · WBS 5.3.2 · diseño 2.2.9

**Descripción**

Al entrar por primera vez, el usuario completa deportes, nivel y ciudad antes de ver el mapa. Son los datos que alimentan la recomendación de Descubrir (SPO-286).

**Pasos**

1. Ruta `front/src/app/(app)/bienvenida/page.tsx`, tres pasos cortos con indicador de progreso (reusar `WizardProgress` de `front/src/components/matches/wizard-progress.tsx`): **deportes** (chips `FilterChip`, hasta 5, con `useSports()`), **nivel** (`LevelPicker`) y **ciudad** (`EditField`). Los mismos componentes que usa `front/src/components/profile/edit-profile-form.tsx`.
2. `front/src/lib/users.ts`: `completeOnboarding(userId, data)` con `apiFetch` contra `PATCH /users/:id/onboarding`.
3. `front/src/app/(app)/layout.tsx`: si el usuario de `GET /users/me` tiene `onboardedAt: null` y no está en `/bienvenida`, `router.replace('/bienvenida')`. Al terminar, va a `/mapa`.
4. Botón "Más tarde" en cada paso: va a `/mapa` sin guardar y vuelve a aparecer en la próxima sesión.

**Criterios de aceptación**

- [ ] Una cuenta nueva, con email o con Google, cae en `/bienvenida` después del splash; una cuenta existente no la ve nunca.
- [ ] Al terminar, el perfil muestra los deportes, el nivel y la ciudad elegidos y Descubrir los usa para ordenar.
- [ ] "Continuar" queda deshabilitado sin al menos un deporte; un error del back se muestra en la pantalla sin perder lo cargado.
- [ ] Se ve a 375px y en desktop; capturas de los tres pasos (QA-05). `apiFetch`, cero colores sueltos, `padding`/`gap`, UI en castellano. `npm run lint` y `npm run build` pasan.

**Notas**

* No es una de las 14 pantallas del diseño. Si el diseño 2.2.9 no está al arrancar, se arma con los componentes de Editar perfil, sin inventar estilos.
* La foto de perfil no va en el onboarding: la ponen SPO-290 y SPO-295 desde Editar perfil.

**Bloqueado por:** SPO-285 · diseño 2.2.9 (PMs)

---

## SPO-288 · Tutorial de Descubrir

**Referencia:** RF-04 · WBS 5.3.3 · pantalla 04 · diseño 2.2.9

**Descripción**

La primera vez que alguien entra a Descubrir no sabe que la tarjeta se desliza. Un recorrido de tres pasos explica los gestos y no vuelve a aparecer.

**Pasos**

1. `front/src/components/matches/discover-tutorial.tsx`: overlay sobre `SwipeDeck` (`front/src/components/matches/swipe-deck.tsx`) con tres pasos: "Deslizá a la derecha para pedir sumarte", "A la izquierda para pasar" y "Tocá la tarjeta para ver el detalle". Botones "Siguiente" y "Saltar".
2. `front/src/lib/discover-tutorial.ts`: marca de "ya visto" en `localStorage`, con `try/catch` igual que `front/src/lib/splash.ts`. Si el storage falla, el tutorial no se muestra.
3. Montarlo desde `front/src/app/(app)/buscar/page.tsx` solo cuando hay partidos en el mazo.

**Criterios de aceptación**

- [ ] La primera visita a `/buscar` muestra el tutorial; después de "Saltar" o del último paso no vuelve a aparecer.
- [ ] Con el mazo vacío no se muestra.
- [ ] Mientras está abierto, la tarjeta no se puede deslizar.
- [ ] Se ve a 375px y en desktop; captura o video (QA-05). Sin dependencias nuevas (QA-03), cero colores sueltos. `npm run lint` y `npm run build` pasan.

**Notas**

* Se hace a mano, sin librería de tours: son tres pasos sobre una sola pantalla.
* La marca es por navegador, no por cuenta. Es suficiente para un tutorial de primer uso.

**Bloqueado por:** diseño 2.2.9 (PMs)

---

## SPO-289 · Almacenamiento de imágenes en Azure Blob Storage (`StorageService`)

**Referencia:** WBS 14.1.1 · decisión 8 de la WBS v5

**Descripción**

Base de las fotos de perfil, de partido y de las generadas con IA. Las imágenes se guardan en Azure Blob Storage, junto al back que ya corre en Azure, y la base guarda solo la URL.

**Pasos**

1. Azure: cuenta de Storage y un contenedor `images` con acceso de lectura pública a los blobs, uno para dev y otro para prod. Documentar los pasos en `back/README.md`.
2. Dependencia `@azure/storage-blob`. **Justificación (QA-03):** es el SDK oficial de Azure para Blob Storage; la alternativa es firmar las requests REST a mano.
3. Variables `AZURE_STORAGE_CONNECTION_STRING` y `AZURE_STORAGE_CONTAINER` en `back/src/config/env.validation.ts` y `back/.env.example`, y cargadas en las Web Apps de dev y prod.
4. `back/src/storage/storage.module.ts` + `storage.service.ts`: `upload(buffer, contentType, path)` devuelve la URL pública y `remove(url)` borra. Valida tipo (`image/jpeg`, `image/png`, `image/webp`) y tamaño (hasta 5 MB) y lanza `BadRequestException` si no cumple. Es un servicio de infraestructura, como `PrismaService`: no lleva controller ni repository.
5. `front/next.config.ts`: sumar el host de Blob Storage a `images.remotePatterns`, tomado de una variable de entorno (QA-06).

**Criterios de aceptación**

- [ ] Desde un script o un endpoint temporal de prueba, una imagen subida queda accesible por su URL pública.
- [ ] Un archivo que no es imagen, o de más de 5 MB, da **400**.
- [ ] Sin las variables, el back no arranca y el error dice cuál falta.
- [ ] `next/image` muestra una URL del contenedor sin error de host.
- [ ] Ningún archivo `.spec.ts`. `npm run lint` y `npm run build` pasan en back y front.

**Notas**

* Los endpoints de subida los agregan SPO-290 y SPO-291; este ticket deja solo el servicio.
* Los nombres de blob llevan un id aleatorio: nunca el nombre original del archivo.

**Bloqueado por:** —

---

## SPO-290 · Foto de perfil propia: `POST /users/:id/photo` + Editar perfil

**Referencia:** RF-02 · WBS 14.1.2 · pantalla 14

**Descripción**

Hoy la foto de perfil es la de Google, y quien entra con email no tiene foto. El usuario puede subir o cambiar su foto desde Editar perfil.

**Pasos**

1. Back: `@Post(':id/photo')` en `back/src/users/users.controller.ts`, con `OwnAccountGuard` y `FileInterceptor('photo')` de `@nestjs/platform-express`, que ya está instalado (sumar `@types/multer` como devDependency). El service sube con `StorageService` (SPO-289), guarda `photoUrl` con el repository y borra la foto anterior si era del contenedor (no la de Google).
2. Front: en `front/src/components/profile/edit-profile-form.tsx`, el avatar (`ProfileAvatar`) pasa a ser un botón "Cambiar foto" con `<input type="file" accept="image/*">`. Se sube al elegir el archivo, con estado de carga sobre el avatar.
3. `front/src/lib/users.ts`: `uploadProfilePhoto(userId, file)` con `apiFetch` y `FormData`. Hoy `apiFetch` (`front/src/lib/api.ts`) fija siempre `Content-Type: application/json`: cuando el body es `FormData` no tiene que mandarlo, para que el navegador ponga el `boundary`. SPO-291 y SPO-295 usan el mismo cambio.

**Criterios de aceptación**

- [ ] Subir una foto la muestra en el perfil propio, en el perfil ajeno y en las listas de jugadores, sin recargar.
- [ ] Errores: **400** si no es imagen o pesa más de 5 MB (mensaje "La foto tiene que ser JPG, PNG o WebP de hasta 5 MB") · **401** · **403** sobre otra cuenta.
- [ ] Captura de Editar perfil con la foto nueva (QA-05). `apiFetch`, cero colores sueltos. Ningún `.spec.ts`. `npm run lint` y `npm run build` pasan.

**Notas**

* `sharpPhotoUrl` (`front/src/lib/photo-url.ts`) solo transforma fotos de Google; una URL del contenedor pasa sin cambios.

**Bloqueado por:** SPO-289

---

## SPO-291 · Foto del partido: `Match.photoUrl` + wizard, tarjeta y detalle

**Referencia:** RF-03 · WBS 14.1.3 · pantallas 04, 05 y 09

**Descripción**

El organizador puede ponerle una foto al partido, por ejemplo la de la cancha. Sin foto se sigue usando la del deporte (`front/src/lib/sport-photo.ts`).

**Pasos**

1. Back: `Match.photoUrl String?` (migración `add_match_photo`). `@Post(':id/photo')` en `back/src/matches/matches.controller.ts`, con `FileInterceptor('photo')`; solo el organizador (**403** para el resto) y nunca sobre un partido cancelado (**409**). Sube con `StorageService` (SPO-289). El `photoUrl` entra en las respuestas de listado y detalle (`back/src/matches/matches.repository.ts`).
2. Front, wizard (`front/src/components/matches/match-wizard.tsx`): campo opcional "Foto del partido" en el paso **Jugadores**, con vista previa. Como la foto necesita el id del partido, se sube después del `POST /matches` dentro de `save()`; si la subida falla, el partido queda creado y un toast avisa "No pudimos subir la foto".
3. Mostrar `match.photoUrl ?? sportPhotoUrl(...)` en los lugares que hoy usan `sportPhotoUrl`: `swipe-card.tsx`, `match-card.tsx`, `match-row.tsx`, `match-summary.tsx` y `front/src/app/(app)/partidos/[id]/page.tsx`.
4. En modo edición (`front/src/app/(app)/partidos/[id]/editar/page.tsx`), la foto se puede reemplazar.

**Criterios de aceptación**

- [ ] Un partido creado con foto la muestra en Descubrir, en Tus partidos y en el detalle; uno sin foto sigue mostrando la del deporte.
- [ ] Solo el organizador puede subir o cambiar la foto.
- [ ] Errores: **400** formato o tamaño · **403** no organizador · **404** partido inexistente · **409** partido cancelado.
- [ ] Capturas del paso Jugadores y de la tarjeta con foto (QA-05). Ningún `.spec.ts`. `npm run lint` y `npm run build` pasan.

**Notas**

* El `photoUrl` no se acepta en `POST`/`PATCH /matches`: solo se escribe por el endpoint de subida, para que nadie apunte a una URL externa.
* Las fotos quedan alcanzadas por los reportes de moderación (12.1) sin cambios: se reporta al organizador.

**Bloqueado por:** SPO-289

---

## SPO-292 · Módulo `ai`: proveedor, clave y límite de uso por usuario

**Referencia:** WBS 15.1.1 · decisión 10 de la WBS v5

**Descripción**

Un único punto del back para llamar a los modelos de IA (texto en SPO-293, imágenes en SPO-295), con la clave fuera del front y un límite diario por usuario para acotar el costo.

**Pasos**

1. `back/src/ai/`: `ai.module.ts`, `ai.controller.ts` (vacío hasta SPO-293), `ai.service.ts` y `ai.repository.ts`, con la estructura de `users` (SPO-155).
2. Modelo `AiUsage` (`userId`, `kind`: `MATCH_DRAFT` · `IMAGE`, `createdAt`), migración `add_ai_usage`. `AiService.assertQuota(userId, kind)` cuenta las del día y lanza **429** (`HttpException` con `HttpStatus.TOO_MANY_REQUESTS`) al pasar el límite: 20 borradores y 5 imágenes por día, configurables por variable.
3. Cliente del proveedor de texto. **Si se elige Claude:** dependencia `@anthropic-ai/sdk` (**QA-03:** SDK oficial), clave en `ANTHROPIC_API_KEY`, modelo en `AI_TEXT_MODEL` (por defecto `claude-opus-5-5`). El cliente vive en `back/src/ai/` y nada fuera del módulo lo importa.
4. Variables nuevas en `back/src/config/env.validation.ts` y `back/.env.example`: la clave, el modelo y los dos límites. Cargadas en dev y prod.

**Criterios de aceptación**

- [ ] Sin la clave, el back arranca, pero los endpoints de IA responden **503** "El asistente no está disponible".
- [ ] El límite diario se respeta por usuario y por tipo; al pasarlo, **429**.
- [ ] La clave no aparece en el front, ni en los logs, ni en ninguna respuesta.
- [ ] Ningún `.spec.ts`; solo `ai.repository.ts` usa `PrismaService`. `npm run lint` y `npm run build` pasan.

**Notas**

* **Antes de arrancar, los PMs eligen el proveedor y consiguen la clave** (decisión 10). El de imágenes puede ser otro: Claude no genera imágenes.
* El modelo por defecto es el más capaz; bajarlo a uno más barato (`claude-haiku-5-5`) es una decisión de costo que queda en la variable `AI_TEXT_MODEL`, sin cambiar código.

**Bloqueado por:** decisión 10 (proveedor y clave)

---

## SPO-293 · `POST /ai/match-draft`: texto libre → borrador de partido

**Referencia:** RF-03 · WBS 15.1.2

**Descripción**

Convierte una frase como "fútbol 5 el sábado a las 19 en River Courts, faltan 3, nivel intermedio" en los campos del wizard. **No crea el partido**: devuelve un borrador que el usuario revisa (SPO-294).

**Pasos**

1. `ai.controller.ts`: `@Post('match-draft')` con `FirebaseAuthGuard`, body `{ text }` (DTO con `text` de 3 a 500 caracteres).
2. `ai.service.ts`: `assertQuota` (SPO-292) y después la llamada al modelo con salida estructurada. Con Claude: `client.messages.parse()` + `output_config: { format: zodOutputFormat(schema) }` (helper `@anthropic-ai/sdk/helpers/zod`; dependencia `zod`, **QA-03:** es el formato que pide el helper del SDK). Esquema: `sport` (uno de `FUTBOL`, `BASQUET`, `TENIS`, `PADEL`, `RUNNING` o `null`), `level`, `date` (ISO), `location`, `capacity` y `description`, cada uno `null` si no se dice.
3. El prompt incluye la fecha y hora actuales en `America/Argentina/Buenos_Aires`, para resolver "el sábado" o "mañana".
4. Post-proceso en el service: `sport` → `sportId` con el catálogo de `sports`, `capacity` entre `CAPACITY_MIN` y `CAPACITY_MAX`, y una fecha pasada pasa a `null`. Registrar el uso en `AiUsage`.
5. Si la respuesta tiene `stop_reason === 'refusal'` o `parsed_output` es `null`, **422** "No pudimos entender el partido. Probá con otras palabras".

**Criterios de aceptación**

- [ ] La frase de ejemplo devuelve fútbol, el sábado próximo a las 19:00, "River Courts", cupo 3 e intermedio.
- [ ] Una frase sin fecha devuelve `date: null` y el resto completo; nunca devuelve una fecha pasada.
- [ ] Errores: **400** texto vacío o largo · **401** · **422** sin interpretación · **429** límite · **503** sin clave.
- [ ] Ningún `.spec.ts`. `npm run lint` y `npm run build` pasan.

**Notas**

* Las coordenadas no se piden al modelo: las resuelve el front con el autocompletado de lugares que ya usa el paso Lugar.

**Bloqueado por:** SPO-292

---

## SPO-294 · Crear partido por texto o voz en el wizard

**Referencia:** RF-03 · WBS 15.1.3 · pantallas 06 a 10 · diseño 2.2.9

**Descripción**

Al abrir el wizard, el usuario puede describir el partido en una frase, escrita o dictada, y el asistente completa los pasos. El usuario revisa el borrador y lo acepta o lo descarta (decisión 9).

**Pasos**

1. Componente `front/src/components/matches/match-assistant.tsx`, arriba del paso **Deporte** de `match-wizard.tsx`: un campo de texto con un botón de micrófono y "Completar".
2. **Micrófono:** Web Speech API del navegador (`SpeechRecognition` / `webkitSpeechRecognition`, `lang: 'es-AR'`), que escribe lo dictado en el mismo campo. Si el navegador no la soporta (Firefox), el botón no se muestra. Sin dependencias (QA-03).
3. `front/src/lib/ai.ts`: `fetchMatchDraft(text)` con `apiFetch`.
4. Con el borrador: una tarjeta "¿Lo armamos así?" con los datos interpretados (reusar `MatchSummary`). **Aceptar** carga el borrador en el `MatchForm`, resuelve el lugar con el autocompletado del paso Lugar y salta al primer paso con datos faltantes (`firstStepWithError` de `front/src/lib/match-wizard.ts`) o a Revisión. **Descartar** deja el wizard vacío.
5. Errores 422, 429 y 503 se muestran debajo del campo sin bloquear el wizard manual.

**Criterios de aceptación**

- [ ] Escribir o dictar la frase de ejemplo y aceptar deja el wizard en Revisión con los datos completos.
- [ ] Si falta la fecha, el wizard se para en Horario con el resto completo.
- [ ] Descartar no cambia nada; el wizard manual funciona igual que antes.
- [ ] En un navegador sin reconocimiento de voz no aparece el micrófono.
- [ ] Video del flujo con voz y con texto (QA-05). `apiFetch`, cero colores sueltos. `npm run lint` y `npm run build` pasan.

**Notas**

* No hay pantalla en el diseño: es parte de 2.2.9. Plan B: un campo más con los componentes del wizard (`TextareaField`).
* El asistente nunca publica el partido: siempre pasa por Revisión.

**Bloqueado por:** SPO-293 · diseño 2.2.9 (PMs)

---

## SPO-295 · Generar foto de perfil o de partido con IA

**Referencia:** RF-02 · RF-03 · WBS 15.2.1

**Descripción**

Desde Editar perfil y desde el paso Jugadores del wizard, el usuario puede generar una imagen a partir de una descripción ("una cancha de pádel al atardecer") en vez de subir una foto. La imagen generada se guarda como cualquier otra (SPO-289).

**Pasos**

1. Back: `@Post('images')` en `ai.controller.ts`, body `{ prompt, target: 'profile' | 'match', matchId? }`. El service valida permisos como SPO-290 y SPO-291 (dueño de la cuenta u organizador), llama a `assertQuota(userId, 'IMAGE')`, pide la imagen al proveedor elegido, la sube con `StorageService` y actualiza `photoUrl`.
2. Cliente del proveedor de imágenes en `back/src/ai/`, con su clave en una variable propia (`AI_IMAGE_API_KEY`).
3. Front: botón "Generar con IA" junto a "Cambiar foto" (SPO-290) y en el campo de foto del partido (SPO-291). Abre un `Dialog` con el texto, estado de carga y la vista previa; "Usar esta" la guarda y "Otra" vuelve a generar (y cuenta para el límite).
4. `front/src/lib/ai.ts`: `generateImage(...)` con `apiFetch`.

**Criterios de aceptación**

- [ ] Una imagen generada para el perfil o para un partido queda guardada en el contenedor y se ve donde se ve la foto subida.
- [ ] Errores: **400** prompt vacío · **403** cuenta o partido ajeno · **422** el proveedor rechazó el pedido · **429** límite diario · **503** sin clave.
- [ ] Captura del diálogo y de la imagen aplicada (QA-05). Ningún `.spec.ts`. `npm run lint` y `npm run build` pasan.

**Notas**

* Es el primero que se corta si el S3 no alcanza (riesgo R5 del Cronograma v5): no es prerrequisito de nada.
* El texto del usuario se manda al proveedor tal cual; el filtro de contenido es el del proveedor.

**Bloqueado por:** SPO-290 · SPO-291 · SPO-292
