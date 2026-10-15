# Reglas de negocio — SportMatch

Decisiones de producto del PO para el Sprint 2, tomadas el 24/09/2026 y ampliadas el 30/09/2026 y el 08/10/2026 (§14, cupo). Son la referencia de los tickets de
las semanas 8 a 10 y de lo que se demuestra en el Steering 2. El vocabulario está definido en
[`CONTEXT.md`](./CONTEXT.md).

Si una regla cambia, se actualiza este documento **antes** que el ticket.

---

## 1. Partido jugado y ventana de cierre

- Un partido está **jugado** cuando pasó su hora de inicio y no está cancelado. No existe una duración.
- La **ventana de cierre** son las **48 h** posteriores a la hora de inicio.
  - Dentro de la ventana: se califica y se marcan faltas.
  - Fuera de la ventana: no se puede calificar ni marcar faltas (hoy calificar no tiene plazo; pasa a tenerlo).
- Calificar sigue siendo **un solo envío** por jugador y partido. Las faltas se marcan en ese mismo envío.

## 2. Faltas (no-show)

| Regla | Valor |
|---|---|
| Quién puede marcar | El organizador y cualquier jugador anotado del partido. Nadie se marca a sí mismo |
| A quién se puede marcar | A cualquier otro anotado, incluido el organizador |
| Dónde se marca | En el paso "¿Faltó alguien?" del modal de calificación, que lista a **todos** los anotados |
| Cuándo existe una falta | En el momento en que la marca el **organizador** o **al menos 2 jugadores** |
| Cuándo se calcula | Cada vez que alguien envía su calificación |
| ¿Se puede deshacer? | **No.** Las marcas son de un solo envío. Un error se corrige a mano en la base |
| Efecto en el puntaje | Cuenta como **una calificación de 1 ★** |
| Estrellas de ese partido | Se descartan las que el jugador que faltó **recibió** y las que **dio** en ese partido |
| Visibilidad | "Faltas (90 días): N" en el perfil propio y en el ajeno |

Si una marca no llega al umbral antes de que cierre la ventana, se pierde: no hay falta.

## 3. Baja tarde

- Es **baja tarde** cuando un jugador anotado se baja a **menos de 2 h** de la hora de inicio, o cuando el
  **organizador cancela** el partido a menos de 2 h.
- Cuenta como **una calificación de 2 ★** en el puntaje de quien se baja o cancela.
- **No es una falta** y no cuenta para la suspensión.
- Cancelar una **solicitud pendiente**, aunque sea a último momento, no penaliza: el jugador todavía no
  estaba anotado.

## 4. Puntaje

```
puntaje = promedio de:
  + las estrellas recibidas (descontando las de los partidos donde hubo falta, propia o de quien calificó)
  + 1 ★ por cada falta
  + 2 ★ por cada baja tarde
```

- Sin ningún dato, el puntaje es `—`, no 0.
- Se redondea a un decimal, como hoy.

## 5. Suspensión

| Regla | Valor |
|---|---|
| Qué la dispara | Juntar **3 faltas en 90 días** |
| Primera suspensión | **7 días** |
| Reincidencia | Volver a juntar 3 faltas en 90 días **dentro de los 12 meses** posteriores a la suspensión anterior → **6 meses** |
| Reinicio | Tras 12 meses sin suspensiones, la escalera vuelve a empezar desde 7 días |
| Cuándo empieza | En el momento en que la tercera falta pasa a existir |
| Conteo | Después de una suspensión, las faltas que la dispararon no se vuelven a contar |

**Mientras dura la suspensión:**

- **No puede** pedir sumarse a partidos (incluido el swipe a la derecha) ni crear partidos. La API responde
  **403** y la app muestra "Estás suspendido hasta el dd/mm por faltas".
- **Sí puede** ver partidos, bajarse de los que ya está anotado, cancelar los que organiza y calificar.
- Los partidos en los que ya estaba anotado y sus solicitudes pendientes se mantienen. El organizador decide
  si acepta la solicitud.
- "Suspendido hasta dd/mm" se ve solo en el perfil propio.

## 6. Notificaciones

Canal actual: **solo in-app** (campanita). **Push PWA** en las últimas semanas del S2, con `web-push`
(estándar Web Push, sin FCM). **Mail: fuera por ahora.** Preferencias de notificación: fuera de alcance.

| Tipo | Cuándo | A quién |
|---|---|---|
| Solicitud recibida | Un jugador pide sumarse | Organizador |
| Solicitud aceptada | El organizador acepta | Jugador |
| Solicitud rechazada | El organizador rechaza | Jugador |
| Partido cancelado | El organizador cancela, con el motivo | Anotados **y** jugadores con solicitud pendiente |
| Un jugador se bajó | Un anotado deja el partido | Organizador |
| Partido editado | Cambia **fecha, hora o lugar** (no la descripción ni el cupo) | Anotados **y** jugadores con solicitud pendiente |
| Te marcaron falta | Una falta pasa a existir | El jugador que faltó |
| Quedaste suspendido | Una falta dispara una suspensión | El jugador suspendido |
| Te invitaron | El organizador te invita a un partido | El invitado |
| Aceptó tu invitación | El invitado acepta | Organizador |
| Rechazó tu invitación | El invitado rechaza | Organizador |
| Recordatorio | 24 h antes del partido | Anotados y organizador |

- Nadie recibe una notificación por algo que hizo él mismo.
- **La campanita:** en desktop va al lado de la foto de perfil del header. En mobile va en el header del
  Mapa, y hay un badge de no leídas sobre el tab de Perfil. El contador se refresca cada 30 s y al volver a
  la pestaña.
- Tocar una notificación la marca como leída y lleva al partido.
- El recordatorio se detalla en §13.

## 7. Mapa

- Es la **pantalla de inicio**: después de iniciar sesión, la app abre el Mapa.
- Proveedor: **Google Maps** (decisión del equipo del 25/09, por la calidad de la búsqueda de lugares de Google Places), con el logo y la atribución de Google visibles.
- Muestra los **partidos disponibles**, los mismos que Descubrir: futuros, activos, con lugar, que no
  organizo, en los que no estoy anotado y a los que no pedí sumarme.
- **Centro inicial:** la ubicación del jugador. Si no da permiso, el centroide de los partidos visibles.
- **Filtros** (solo en el Mapa):
  - **Día** (excluyentes entre sí): Hoy · Mañana · Esta noche (hoy desde las 19:00) · Fin de semana
    (el próximo sábado y domingo; si hoy es sábado o domingo, este mismo). Hora de Argentina.
  - **Nivel:** Principiante · Intermedio · Avanzado. "Casual" no existe en el modelo y se omite.
  - **Deporte.**
  - **Cerca:** a menos de 5 km del jugador. Solo se puede usar si el jugador dio su ubicación.
  - El chip "Lugares libres" del diseño se omite: el Mapa ya muestra solo partidos con lugar.
- Tocar un pin abre el detalle del partido.

## 8. Lugar del partido

- En el paso "Lugar" del wizard se escribe una dirección y se **autocompleta** con Google Places.
- Al elegir una dirección aparece un **mini mapa con el pin**, que se puede **arrastrar** para ajustar.
- Al soltar el pin se busca la dirección de ese punto. Si se movió menos de ~50 m, se conserva el nombre
  elegido (por ejemplo "Club Norte · Cancha 3"); si se movió más, el lugar pasa a ser la dirección nueva.
- El partido guarda el nombre del lugar que ve el usuario y sus coordenadas. Un partido nuevo **no se puede
  crear sin coordenadas**.
- Los partidos anteriores a este cambio no tienen coordenadas y no aparecen en el Mapa.

## 9. Descubrir y compatibilidad

- Descubrir es una **caja negra del back**: el usuario no filtra. Trae los partidos disponibles.
- El orden es por **compatibilidad**:
  1. Primero, los partidos cuyo nivel coincide con el nivel más frecuente de los partidos que jugó el
     jugador.
  2. Después, el puntaje del organizador, de mayor a menor.
  3. Después, la fecha, del más próximo al más lejano.
- Un jugador sin partidos jugados se ordena solo por (2) y (3).
- El próximo sprint se puede reemplazar por un algoritmo más interesante sin cambiar la app.

## 10. Link compartible

- `/partidos/:id` se puede abrir **sin cuenta**, en modo lectura.
- Sin cuenta se ve: deporte, fecha y hora, nombre del lugar, nivel, lugares libres, y el nombre y la foto del
  organizador. **No** se ve la lista de jugadores.
- "Sumate" lleva a iniciar sesión o crear cuenta y, después, vuelve al partido.
- Al compartir el link (por ejemplo por WhatsApp) se ve una vista previa con título e imagen.

## 11. Invitaciones

- **Solo el organizador** invita, a usuarios registrados que busca por nombre.
- No se puede invitar si el partido está lleno, ya empezó o está cancelado, ni a alguien suspendido, anotado o
  con una solicitud o invitación pendiente.
- El invitado **acepta y queda anotado sin aprobación**, porque la invitación ya viene del organizador
  (decisión 5 de la WBS: la invitación reutiliza la solicitud, con origen "invitación"). Si al aceptar el
  partido se llenó, no entra.
- La invitación **vence cuando empieza el partido**.

## 12. Moderación

- Cualquier jugador puede **reportar** a otro desde su perfil o desde el detalle de un partido.
- Motivos: Comportamiento agresivo · Lenguaje ofensivo · Perfil falso · Otro. Comentario opcional. Las faltas
  no se reportan acá: tienen su propio flujo (§2).
- Un **administrador** (rol en el usuario, asignado a mano) revisa los reportes: los marca como revisados, los
  descarta o **bloquea la cuenta** del reportado por 7 días, 30 días o de forma permanente.
- **Bloqueo ≠ suspensión.** La suspensión (§5) es automática por faltas e impide sumarse y crear partidos. El
  bloqueo lo decide un admin e **impide entrar a la app**.
- Toda acción de moderación queda en un historial por usuario.

## 13. Recordatorio

- **24 h antes** del partido, un solo aviso, para los anotados y el organizador, en la app y como push.
- Un partido creado con menos de 24 h de anticipación **no** tiene recordatorio.

## 14. Cupo

- El cupo es la cantidad de **jugadores totales del partido, incluido el organizador**. Un pádel de 4 es el
  organizador más 3 anotados.
- Un partido está **lleno** cuando los anotados más el organizador llegan al cupo. Desde ese momento no
  aparece en Descubrir ni en el Mapa, y no entra nadie más por solicitud ni por invitación.
- Cupo mínimo: **2** (el organizador más 1). Máximo: **30**.
- Al editar el partido, el cupo no puede quedar por debajo de los anotados más el organizador.

## 15. Fuera de alcance (S2)

- Mail y preferencias de notificación.
- Recordatorio para partidos creados con menos de 24 h de anticipación.
- Deshacer una falta o apelarla.
- Recordatorio antes del partido (S3, 11.1.4).
- Filtros en Descubrir.
