# [Sin crear] Borrar `GET /users`

**Prioridad:** P3 · **Estado:** documentado, no creado en Linear (31/10) · **Área:** back (`users.*`) · **Cambia la API:** solo se borra un endpoint que
nadie usa
**Evidencia:** [audit §3](audit-rendimiento.md#3-mediciones)

La compresión HTTP que estaba acá pasó a BUG-18 ([SPO-307](02-matches-paginado-y-por-zona.md)).

> **No incluye la cache de partidos en el front:** eso ya lo cubre **SPO-296** (Todo, "Deportes y partidos con
> TanStack Query + precarga al entrar a la app"). Ojo: SPO-296 precarga `GET /matches` en cada login. Hasta
> que estén el 01 y el 02, esa precarga es la request de ~2,2 s y 1,2 MB del audit.

## Borrar `GET /users`

**Problema:** devuelve los 2.000 usuarios (`id`, `name`, `photoUrl`) en 147 KB a cualquier usuario
autenticado. **El front no lo llama:** se buscó en `front/src` y su único uso es `users.controller.ts:39`.
Con volumen, es una forma fácil de listar a todos los usuarios.

**Antecedente:** **SPO-185** (Done, 06/09) fue un ticket de seguridad: `GET /users` y `GET /users/:id`
devolvían `email` y `firebaseUid` de terceros, y se recortaron a `id`, `name` y `photoUrl`. De paso dijo "los
endpoints se quedan (los va a usar el front)". Era un supuesto, no una decisión sobre `GET /users`: el
listado nunca se usó, y para buscar jugadores se hizo `GET /users/search` (SPO-242), con límite de 10. Este
ticket cierra ese supuesto. Avisar a jrudolph, que hizo SPO-185.

**Propuesta:** borrar el handler, `UsersService.findAll` y `UsersRepository.findAll`.

**Criterios de aceptación**
- [ ] `GET /users` responde `404`. `GET /users/me`, `/users/search` y `/users/:id` siguen funcionando.
- [ ] Swagger ya no lista `GET /users`.

## Fuera de alcance

- La cache de partidos en el front (SPO-296).
- Achicar `toListResponse`, que hoy incluye `updatedAt`, `reminderSentAt`, `cancelReason`, etc. Con la
  paginación del issue 02, la ganancia es marginal.
