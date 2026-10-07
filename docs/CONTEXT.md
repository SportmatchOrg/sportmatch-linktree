# SportMatch

App web para organizar partidos amateur entre desconocidos: un organizador publica un partido, otros jugadores piden sumarse, y después del partido se califican entre sí.

## Language

### Partidos

**Partido jugado**:
Un partido no cancelado cuya hora de inicio ya pasó. No hay duración: al pasar la hora de inicio, ya cuenta como jugado.
_Avoid_: partido finalizado, partido terminado

**Ventana de cierre**:
Las 48 h posteriores a la hora de inicio de un partido jugado. Durante esa ventana se puede calificar y marcar faltas; cuando termina, el resultado queda firme.
_Avoid_: plazo de calificación

### Reputación

**Puntaje**:
El promedio de las calificaciones que recibió un jugador. Cada falta entra al promedio como una calificación de 1 ★.
_Avoid_: rating (en la UI), reputación

**Falta**:
Un jugador anotado, o el organizador, que no se presentó a un partido jugado. Existe desde el momento en que la marcan el organizador o al menos dos jugadores del partido dentro de la ventana de cierre. Mientras dura, reemplaza cualquier calificación que ese jugador haya dado o recibido en el partido.
_Avoid_: ausencia; "no-show" solo en código

**Baja tarde**:
Un jugador que deja un partido, o un organizador que lo cancela, a menos de 2 h de su hora de inicio. Entra al puntaje como una calificación de 2 ★, pero no es una falta ni cuenta para la suspensión.
_Avoid_: cancelación tardía

**Suspensión**:
Período durante el cual un jugador no puede pedir sumarse a partidos ni crearlos, por haber acumulado 3 faltas en 90 días. La primera dura 7 días. Si vuelve a juntar 3 faltas en 90 días dentro de los 12 meses siguientes a una suspensión, dura 6 meses. Tras 12 meses sin suspensiones, la escalera vuelve a empezar.
_Avoid_: bloqueo, ban

**Bloqueo**:
Una sanción que decide un administrador a partir de un reporte: el jugador no puede entrar a la app por 7 días, 30 días o para siempre. No tiene relación con las faltas.
_Avoid_: suspensión, ban

**Reporte**:
Una denuncia de un jugador sobre otro por su comportamiento (agresivo, lenguaje ofensivo, perfil falso u otro). La revisa un administrador.
_Avoid_: denuncia, queja

**Administrador**:
Un usuario con permiso para revisar reportes y bloquear cuentas. Se asigna a mano.
_Avoid_: admin (en la UI), moderador

### Descubrimiento

**Descubrir**:
El mazo de tarjetas con partidos sugeridos. Qué partidos trae y en qué orden lo decide el back, sin filtros del usuario.
_Avoid_: buscar, swipe (en la UI)

**Partido disponible**:
Para un jugador, un partido futuro, activo y con lugar, que no organiza, en el que no está anotado y al que no pidió sumarse. Es lo que ven Descubrir y el Mapa.

**Mapa**:
La pantalla de inicio: muestra en un mapa los partidos disponibles, y el usuario los filtra por deporte, día, nivel y cercanía.
_Avoid_: home

**Compatibilidad**:
Cuánto se ajusta un partido a un jugador. Pesa primero que el nivel del partido coincida con el nivel más frecuente de los partidos que jugó el jugador, y después el puntaje del organizador.

### Invitaciones

**Invitación**:
Un pedido del organizador para que un jugador registrado se sume a su partido. Si el jugador la acepta, queda anotado sin otra aprobación. Vence cuando empieza el partido.
_Avoid_: invite

**Link compartible**:
La dirección pública de un partido, que se puede abrir sin cuenta y muestra sus datos básicos sin la lista de jugadores.
_Avoid_: link de invitación

### Notificaciones

**Notificación**:
Un aviso para un jugador sobre algo que cambió en uno de sus partidos o solicitudes. Se muestra en la app y, más adelante, como push en el dispositivo.
_Avoid_: alerta, mensaje
