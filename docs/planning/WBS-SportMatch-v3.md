# WBS SportMatch — v3

Documento interno del equipo. Mantiene el detalle necesario para derivar el backlog y los tickets.
Para presentación a docentes se utiliza una versión resumida de alto nivel.

**Qué cambia respecto de la v2.** Esta versión incorpora los cuatro paquetes propuestos en la
extensión (Notificaciones, Invitación a partido, Moderación y Reportes, y Cancelación con motivo)
y agrega los paquetes de diseño y de QA que esos módulos arrastran y que la propuesta original no
contemplaba. La v2 no se pisa: queda como línea base para comparar.

| | v2 | v3 | Δ |
|---|---:|---:|---:|
| Paquetes de trabajo | 79 | **103** | +24 |
| Esfuerzo total estimado | 433,17 h | **395,77 h** | −37,40 h |
| Esfuerzo de desarrollo (Lab 4) | 224,67 h | **170,42 h** | −54,25 h |

**Convención.** Cada paquete lleva número, descripción, dependencias y estimación en horas.
La estimación usa el método PERT sobre tres puntos: DO optimista, DM más probable, DP pesimista,
con `Estimación = (DO + 4·DM + DP) / 6`. Los paquetes de desarrollo fueron **recalibrados con un
factor 0,75** contra la velocidad real medida en las cuatro primeras semanas del proyecto, de modo
que el plan refleje cómo entrega efectivamente este equipo de tres personas. Los paquetes marcados 🆕 son nuevos en la v3.
La fuente de verdad de las estimaciones es `docs/planning/estimaciones-wbs.csv`.

---

## Decisiones de producto tomadas

La propuesta de extensión dejaba seis puntos abiertos. Quedaron resueltos así:

| # | Decisión | Resolución | Impacto |
|---|---|---|---|
| 1 | Proveedor de push y de email (11.1.2) | **FCM** para push, aprovechando que Firebase ya está integrado por autenticación, y un proveedor transaccional para email | Costo cero en push; queda verificar los límites del plan gratuito de email |
| 2 | Ventana del recordatorio pre-partido (11.1.4) | **24 horas antes**, un único envío, sin configuración por usuario | Simplifica el job: no hay ventanas múltiples ni reintentos programados |
| 3 | Preferencias de notificación (11.2.3) | **Incluidas en el alcance.** El usuario puede activar y desactivar push y email por separado | +2,17 h |
| 4 | Esquema de deep-linking (6.5.1) | **URL pública simple** `/partidos/:id` en modo lectura. No hay app nativa, así que no se requieren app links | Evita el trabajo de universal links; queda definir qué datos se exponen sin sesión |
| 5 | Invitación directa y aprobación (6.5.3) | La invitación **reutiliza el modelo de solicitud** (6.3.1) con origen `invitacion`. El invitado acepta y queda anotado sin aprobación adicional del organizador, porque fue él quien invitó | Evita un modelo paralelo. Si la decisión se revierte, 6.5.3 pasa de 4 h a unas 8 h |
| 6 | Panel de moderación (12.2) | **Panel completo con acciones**: listado con filtros, suspensión de usuario e historial de moderación | +17,83 h. Convierte a Moderación en un módulo real y **obliga a introducir un rol de administrador**, que hoy no existe en el modelo de usuario |

---

## Paquetes que la extensión no contemplaba y que se agregaron

La propuesta original describía backend y frontend de los módulos nuevos, pero no el diseño ni la
validación que arrastran. Sin estos cuatro paquetes el WBS quedaría incompleto:

- **2.2.7** Pantallas de notificaciones y **2.2.8** Pantallas de moderación — los módulos nuevos
  suman pantallas que hoy no existen en el Figma.
- **8.1.8**, **8.1.9** y **8.1.10** — pruebas manuales de notificaciones, invitaciones y moderación,
  en línea con las que ya existen para el resto de los módulos.

Además, dos paquetes existentes amplían su contenido sin cambiar de número: **2.3.1** (el DER suma
las entidades de notificación, reporte e historial de moderación) y **10.2.2** (la documentación de
APIs cubre los endpoints nuevos).

---

## Secuencia recomendada

El módulo de Notificaciones es prerrequisito de dos paquetes de otros módulos: la invitación
directa (6.5.2) y el aviso de cancelación (6.2.6). Conviene cerrar **11.1.1 → 11.1.2 → 11.1.3**
antes de arrancar cualquiera de los dos.

El panel de moderación (12.2.1) introduce el **rol de administrador**, que no existe hoy en el
modelo de usuario ni en el guard de autenticación. Es la dependencia oculta más cara de la v3 y
conviene resolverla al inicio del módulo, no al final.

---

# Paquetes de trabajo

## 1.0 Gestión del Proyecto

### 1.1 Planificación y documentación inicial

**1.1.1** — Project Charter: documento con objetivo, alcance, supuestos, restricciones, stakeholders, entregables principales y requerimientos.
<br>*Dependencias:* — · *Estimación:* 7 h (DO 4 / DM 7 / DP 10)

**1.1.2** — WBS: descomposición del trabajo del proyecto en paquetes ejecutables orientados a entregables.
<br>*Dependencias:* 1.1.1 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

**1.1.3** — Cronograma y PERT: cronograma del proyecto, secuencia, duración estimada y camino crítico identificado.
<br>*Dependencias:* 1.1.2 · *Estimación:* 8 h (DO 4 / DM 8 / DP 12)

### 1.2 Gestión ágil y seguimiento

**1.2.1** — Backlog priorizado: épicas, historias de usuario y tareas priorizadas para el MVP.
<br>*Dependencias:* 1.1.1 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

**1.2.2** — Plan de sprints: distribución de funcionalidades en 3 sprints de un mes priorizando los flujos centrales.
<br>*Dependencias:* 1.2.1 · *Estimación:* 4.5 h (DO 3 / DM 4 / DP 8)

**1.2.3** — Reportes de avance y control de desvíos: monitoreo recurrente de avance, bloqueos, riesgos y cronograma.
<br>*Dependencias:* 1.2.2 · *Estimación:* 14.67 h (DO 8 / DM 14 / DP 24)

**1.2.4** — Registro de riesgos: identificación, evaluación y actualización periódica de riesgos técnicos, funcionales y de gestión.
<br>*Dependencias:* 1.1.1 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

### 1.3 Reuniones de seguimiento

**1.3.1** — Acta de kick-off: alineamiento de objetivos, roles, alcance, expectativas y forma de trabajo.
<br>*Dependencias:* 1.1.1 · *Estimación:* 3 h (DO 2 / DM 3 / DP 4)

**1.3.2** — Minutas quincenales de seguimiento: registro de revisión de avance y próximos pasos.
<br>*Dependencias:* 1.3.1 · *Estimación:* 8.17 h (DO 5 / DM 8 / DP 12)

**1.3.3** — Sprint reviews: demostración de los incrementos funcionales desarrollados al cierre de cada sprint.
<br>*Dependencias:* 1.2.2 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

### 1.4 Cierre del proyecto

**1.4.1** — Informe final del proyecto: resultados, desvíos, aprendizajes, cumplimiento de objetivos y estado final del MVP.
<br>*Dependencias:* 8.2.4, 9.1.3 · *Estimación:* 7.5 h (DO 5 / DM 7 / DP 12)

**1.4.2** — Presentación final: presentación ejecutiva con explicación del proyecto, alcance desarrollado y demo funcional.
<br>*Dependencias:* 9.1.2, 9.1.3, 10.1.1 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)


## 2.0 Diseño del Producto

### 2.1 Investigación y definición UX

**2.1.1** — Perfiles de usuario principales: jugador y organizador, formalizados y validados.
<br>*Dependencias:* 1.1.1 · *Estimación:* 4 h (DO 2 / DM 4 / DP 6)

**2.1.2** — Sistema visual base: paleta, tipografías y estilos base del MVP.
<br>*Dependencias:* 1.1.1, 2.1.1 · *Estimación:* 4.33 h (DO 3 / DM 4 / DP 7)

### 2.2 Diseño de pantallas

**2.2.1** — Pantallas de autenticación: registro/login y estados de error.
<br>*Dependencias:* 2.1.2 · *Estimación:* 4.17 h (DO 3 / DM 4 / DP 6)

**2.2.2** — Pantallas de perfil: visualización y edición de perfil, historial y rating.
<br>*Dependencias:* 2.1.2 · *Estimación:* 5.33 h (DO 3 / DM 5 / DP 9)

**2.2.3** — Pantallas de creación y edición de partido: flujo paso a paso.
<br>*Dependencias:* 2.1.2 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

**2.2.4** — Pantalla de solicitudes: vista para aceptar/rechazar y ver estado de solicitud.
<br>*Dependencias:* 2.1.2 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

**2.2.5** — Vista swipe: experiencia de descubrimiento mediante tarjetas navegables.
<br>*Dependencias:* 2.1.2 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

**2.2.6** — Vista mapa interactivo: visualización de partidos disponibles en mapa.
<br>*Dependencias:* 2.1.2 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

**2.2.7** 🆕 — Pantallas de notificaciones: centro de notificaciones con indicador de no leídas y estados vacíos.
<br>*Dependencias:* 2.1.2 · *Estimación:* 3.17 h (DO 2 / DM 3 / DP 5)

**2.2.8** 🆕 — Pantallas de moderación: formulario de reporte y panel de revisión con acciones.
<br>*Dependencias:* 2.1.2 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

### 2.3 Modelo funcional y de datos

**2.3.1** — Diagrama Entidad-Relación: usuarios, perfiles, partidos, solicitudes, ratings e historial.
<br>*Dependencias:* 1.1.1 · *Estimación:* 5.33 h (DO 3 / DM 5 / DP 9)

**2.3.2** — Reglas de negocio: cupos, solicitudes, rating, no-show, edición de partidos y visibilidad.
<br>*Dependencias:* 2.3.1 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)


## 3.0 Capacitación y Setup

### 3.1 Capacitación del equipo

**3.1.1** — Stack tecnológico definido: tecnologías para frontend, backend, base de datos, hosting y herramientas.
<br>*Dependencias:* 1.1.1 · *Estimación:* 4 h (DO 2 / DM 4 / DP 6)

**3.1.2** — Equipo capacitado en stack: nivelación de conocimientos en framework FE/BE y base de datos.
<br>*Dependencias:* 3.1.1 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)

**3.1.3** — Equipo capacitado en buenas prácticas: uso de issue tracker, Git, PRs, branches y convenciones.
<br>*Dependencias:* 3.1.1 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

### 3.2 Setup técnico

**3.2.1** — Repositorios y entornos: repos creados, frontend/backend inicializados, dependencias y entornos dev/main.
<br>*Dependencias:* 3.1.1 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**3.2.2** — Base de datos inicial con seed mínima: BD creada con migraciones iniciales y dataset semilla mínimo para arrancar el sistema.
<br>*Dependencias:* 2.3.1, 3.2.1 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

**3.2.3** — Pipeline de CI: workflow con build, lint y typecheck automáticos.
<br>*Dependencias:* 3.2.1 · *Estimación:* 2.23 h (DO 0.8 / DM 2.2 / DP 3.8)


## 4.0 Autenticación

### 4.1 Backend de autenticación

**4.1.1** — Modelo de usuario: entidad con campos mínimos del MVP y CRUD.
<br>*Dependencias:* 3.2.2 · *Estimación:* 2.88 h (DO 1.5 / DM 3 / DP 3.8)

**4.1.2** — Servicio de registro, login y logout: endpoints para registrar un nuevo usuario, iniciar sesión generando sesión válida y cerrar sesión.
<br>*Dependencias:* 4.1.1 · *Estimación:* 2.22 h (DO 1.5 / DM 2.2 / DP 3)

**4.1.3** — Middleware de rutas privadas: restricción de acceso a funcionalidades autenticadas.
<br>*Dependencias:* 4.1.2 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

### 4.2 Frontend de autenticación

**4.2.1** — Pantalla de registro e inicio de sesión: formularios conectados al backend con feedback de errores.
<br>*Dependencias:* 2.2.1, 4.1.2 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)


## 5.0 Perfil de Usuario

### 5.1 Modelo y backend de perfil

**5.1.1** — Modelo de perfil: datos personales, deportes, nivel y ubicación.
<br>*Dependencias:* 4.1.1, 2.3.1 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

**5.1.2** — API de visualización y edición de perfil: endpoints para obtener y editar el perfil del usuario autenticado.
<br>*Dependencias:* 5.1.1, 4.1.3 · *Estimación:* 2.22 h (DO 1.5 / DM 2.2 / DP 3)

**5.1.3** — API de historial de partidos: partidos creados, solicitados o jugados por el usuario.
<br>*Dependencias:* 6.1.1, 6.3.1 · *Estimación:* 2.22 h (DO 1.5 / DM 2.2 / DP 3)

**5.1.4** — Servicio de cálculo de rating: rating visible a partir de calificaciones y penalizaciones por no-show.
<br>*Dependencias:* 6.4.1, 6.4.2, 6.4.3 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)

### 5.2 Frontend de perfil

**5.2.1** — Vista de perfil: datos del usuario, deportes, nivel, ubicación y rating.
<br>*Dependencias:* 2.2.2, 5.1.2 · *Estimación:* 2.23 h (DO 0.8 / DM 2.2 / DP 3.8)

**5.2.2** — Edición de perfil: formulario para modificar información básica del perfil.
<br>*Dependencias:* 2.2.2, 5.1.2 · *Estimación:* 2.22 h (DO 1.5 / DM 2.2 / DP 3)

**5.2.3** — Vista de historial: historial de partidos y estados relevantes.
<br>*Dependencias:* 5.1.3 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

**5.2.4** — Visualización de rating: promedio, cantidad de calificaciones y estado reputacional.
<br>*Dependencias:* 5.1.4 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)


## 6.0 Gestión de Partidos

### 6.1 Modelo y backend de partidos

**6.1.1** — Modelo de partido: deporte, fecha, ubicación, cupo, nivel, descripción y organizador.
<br>*Dependencias:* 2.3.1, 2.3.2 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

**6.1.2** — CRUD de partidos: endpoints para crear, editar y eliminar partidos.
<br>*Dependencias:* 6.1.1 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)

**6.1.3** — Endpoint de listado de partidos disponibles: consulta de partidos activos para descubrimiento.
<br>*Dependencias:* 6.1.1 · *Estimación:* 2.35 h (DO 0.8 / DM 2.2 / DP 4.5)

**6.1.4** 🆕 — Cancelación de partido con motivo: estado cancelado y campo motivo en el modelo; endpoint que exige motivo obligatorio.
<br>*Dependencias:* 6.1.1, 6.1.2 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

### 6.2 Frontend de gestión de partidos

**6.2.1** — Formulario de creación de partido: flujo paso a paso desde la interfaz.
<br>*Dependencias:* 2.2.3, 6.1.2 · *Estimación:* 3.9 h (DO 2.2 / DM 3.8 / DP 6)

**6.2.2** — Formulario de edición de partido: edición de partidos existentes desde la interfaz.
<br>*Dependencias:* 2.2.3, 6.1.2 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)

**6.2.3** — Detalle de partido: información completa antes de solicitar unirse.
<br>*Dependencias:* 6.1.2, 6.1.3 · *Estimación:* 2.1 h (DO 0.8 / DM 2.2 / DP 3)

**6.2.5** 🆕 — Interfaz de cancelación: modal de confirmación que solicita el motivo antes de cancelar.
<br>*Dependencias:* 6.1.4, 6.2.3 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**6.2.6** 🆕 — Notificación de cancelación a participantes: aviso a todos los anotados con el motivo ingresado.
<br>*Dependencias:* 6.1.4, 11.1.3 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

### 6.3 Sistema de solicitudes

**6.3.1** — Modelo de solicitud: solicitud con estados pendiente, aceptada o rechazada.
<br>*Dependencias:* 4.1.1, 6.1.1 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

**6.3.2** — Envío de solicitud para unirse a partido: solicitud con control de cupo disponible.
<br>*Dependencias:* 6.3.1, 6.2.3 · *Estimación:* 3.9 h (DO 2.2 / DM 3.8 / DP 6)

**6.3.3** — Gestión de solicitudes por el organizador: aceptación o rechazo de solicitudes recibidas.
<br>*Dependencias:* 6.3.2 · *Estimación:* 2.22 h (DO 1.5 / DM 2.2 / DP 3)

**6.3.4** — Visualización de estado de solicitud: pendiente, aceptada o rechazada para el jugador.
<br>*Dependencias:* 6.3.2, 6.3.3 · *Estimación:* 2.47 h (DO 1.5 / DM 2.2 / DP 4.5)

### 6.4 Rating post-partido

**6.4.1** — Modelo de calificación: calificación 1 a 5 estrellas relacionada con usuarios y partidos.
<br>*Dependencias:* 4.1.1, 6.1.1 · *Estimación:* 2.23 h (DO 0.8 / DM 2.2 / DP 3.8)

**6.4.2** — Interfaz de calificación: pantalla para calificar participantes luego del partido.
<br>*Dependencias:* 2.2.2, 6.4.1 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**6.4.3** — Regla de penalización por no-show: definición e implementación de una regla simple para penalizar el rating de usuarios que no se presentan.
<br>*Dependencias:* 6.4.1 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

### 6.5 Invitación a partido — **NUEVO**

**6.5.1** 🆕 — Link compartible de partido: URL pública única que abre el detalle en modo lectura sin login previo.
<br>*Dependencias:* 6.1.1, 6.2.3 · *Estimación:* 2.47 h (DO 1.5 / DM 2.2 / DP 4.5)

**6.5.2** 🆕 — Invitación directa a un usuario: búsqueda de usuario registrado e invitación desde el partido, con notificación al invitado.
<br>*Dependencias:* 6.1.1, 4.1.1, 11.1.3 · *Estimación:* 3.9 h (DO 2.2 / DM 3.8 / DP 6)

**6.5.3** 🆕 — Aceptación de invitación: flujo para aceptar o rechazar; reutiliza el modelo de solicitud con origen invitación.
<br>*Dependencias:* 6.5.2, 6.3.1 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)


## 7.0 Sistema de Matchmaking

### 7.1 Descubrimiento de partidos

**7.1.1** — Búsqueda de partidos: consulta por deporte, ubicación, fecha, nivel y cupo.
<br>*Dependencias:* 6.1.3 · *Estimación:* 4.62 h (DO 2.2 / DM 4.5 / DP 7.5)

**7.1.2** — Filtros (deporte, nivel, fecha): aplicación de filtros del usuario sobre los resultados de búsqueda; expuestos en swipe y mapa.
<br>*Dependencias:* 7.1.1 · *Estimación:* 3.12 h (DO 1.5 / DM 3 / DP 5.2)

**7.1.3** — Ordenamiento por rating y compatibilidad: ordena partidos sugeridos según rating del organizador y compatibilidad de nivel con el usuario.
<br>*Dependencias:* 7.1.1, 5.1.4 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

### 7.2 Vista Swipe

**7.2.1** — Tarjeta de partido: información resumida y mensaje cuando no hay partidos compatibles.
<br>*Dependencias:* 2.2.5, 7.1.1 · *Estimación:* 3.12 h (DO 2.2 / DM 3 / DP 4.5)

**7.2.2** — Navegación tipo swipe: solicitar, descartar o abrir detalle desde la vista swipe.
<br>*Dependencias:* 7.2.1, 6.3.2 · *Estimación:* 4.62 h (DO 2.2 / DM 4.5 / DP 7.5)

### 7.3 Vista Mapa Interactivo

**7.3.1** — Integración con proveedor de mapa: configuración del mapa interactivo y credenciales.
<br>*Dependencias:* 3.2.1, 3.2.3 · *Estimación:* 4.28 h (DO 3 / DM 3.8 / DP 7.5)

**7.3.2** — Visualización de partidos en mapa: marcadores de partidos disponibles según ubicación.
<br>*Dependencias:* 7.3.1, 7.1.1 · *Estimación:* 2.47 h (DO 1.5 / DM 2.2 / DP 4.5)

**7.3.3** — Detalle de partido desde mapa: información resumida o completa desde un marcador.
<br>*Dependencias:* 7.3.2, 6.2.3 · *Estimación:* 3.9 h (DO 2.2 / DM 3.8 / DP 6)


## 8.0 QA Manual y Validación

### 8.1 Planificación de pruebas manuales

**8.1.1** — Dataset de demo: usuarios, perfiles y partidos representativos para validar flujos principales y para la demo final.
<br>*Dependencias:* 3.2.2, 4.1.1, 5.1.1, 6.1.2 · *Estimación:* 2.47 h (DO 1.5 / DM 2.2 / DP 4.5)

**8.1.2** — Prueba manual de autenticación: registro, login, logout, errores y rutas protegidas.
<br>*Dependencias:* 4.2.1, 4.1.3 · *Estimación:* 4 h (DO 2 / DM 4 / DP 6)

**8.1.3** — Prueba manual de perfil: visualización, edición, historial y rating.
<br>*Dependencias:* 5.2.1, 5.2.2, 5.2.3, 5.2.4 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

**8.1.4** — Prueba manual de creación y edición de partidos: creación, edición, permisos y detalle.
<br>*Dependencias:* 6.2.1, 6.2.2, 6.2.3 · *Estimación:* 6.17 h (DO 3 / DM 6 / DP 10)

**8.1.5** — Prueba manual de solicitudes: solicitud, aceptación, rechazo, estado y control de cupos.
<br>*Dependencias:* 6.3.2, 6.3.3, 6.3.4 · *Estimación:* 6.17 h (DO 3 / DM 6 / DP 10)

**8.1.6** — Prueba manual de matchmaking: swipe, mapa, filtros y resultados.
<br>*Dependencias:* 7.2.2, 7.3.3 · *Estimación:* 6.5 h (DO 4 / DM 6 / DP 11)

**8.1.7** — Prueba manual de rating post-partido: calificación y actualización del rating en perfil.
<br>*Dependencias:* 6.4.2, 6.4.3, 5.1.4, 5.2.4 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

**8.1.8** 🆕 — Prueba manual de notificaciones: recepción de push y email, centro de notificaciones y recordatorio pre-partido.
<br>*Dependencias:* 11.1.3, 11.1.4, 11.2.1, 11.2.2 · *Estimación:* 3.17 h (DO 2 / DM 3 / DP 5)

**8.1.9** 🆕 — Prueba manual de invitaciones: link compartible, invitación directa y aceptación.
<br>*Dependencias:* 6.5.1, 6.5.2, 6.5.3 · *Estimación:* 2.17 h (DO 1 / DM 2 / DP 4)

**8.1.10** 🆕 — Prueba manual de moderación: creación de reporte, panel de revisión, suspensión e historial.
<br>*Dependencias:* 12.1.3, 12.2.1, 12.2.2, 12.2.3 · *Estimación:* 3.17 h (DO 2 / DM 3 / DP 5)

### 8.2 Validación con usuarios

**8.2.1** — Guion de prueba: tareas que los usuarios deberán completar durante la validación.
<br>*Dependencias:* 8.1.2, 8.1.3, 8.1.4, 8.1.5, 8.1.6, 8.1.7, 8.1.8, 8.1.9, 8.1.10 · *Estimación:* 4.17 h (DO 3 / DM 4 / DP 6)

**8.2.2** — Ejecución de pruebas con usuarios: registro, búsqueda, solicitud, creación y rating.
<br>*Dependencias:* 8.2.1 · *Estimación:* 11.5 h (DO 7 / DM 11 / DP 18)

**8.2.3** — Registro de feedback: problemas, fricciones, dudas y oportunidades de mejora.
<br>*Dependencias:* 8.2.2 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

**8.2.4** — Backlog de ajustes finales priorizado: ajustes según impacto, esfuerzo y tiempo disponible.
<br>*Dependencias:* 8.2.3 · *Estimación:* 4.33 h (DO 3 / DM 4 / DP 7)


## 9.0 Deployment

### 9.1 Deploy

**9.1.1** — Ambiente productivo configurado: hosting, base de datos y variables productivas.
<br>*Dependencias:* 3.2.1, 3.2.2, 3.2.3 · *Estimación:* 4.75 h (DO 3 / DM 4.5 / DP 7.5)

**9.1.2** — Deploy final del MVP: publicación accesible mediante URL.
<br>*Dependencias:* 9.1.1 · *Estimación:* 3.37 h (DO 2.2 / DM 3 / DP 6)

**9.1.3** — Smoke test manual post-deploy: validación manual de flujos críticos luego del deploy.
<br>*Dependencias:* 9.1.2 · *Estimación:* 3.23 h (DO 2.2 / DM 3 / DP 5.2)


## 10.0 Documentación Final

### 10.1 Documentación funcional

**10.1.1** — Manual de uso y descripción de funcionalidades: funcionalidades incluidas, fuera de alcance y flujos principales.
<br>*Dependencias:* 9.1.2, 9.1.3 · *Estimación:* 6 h (DO 3 / DM 6 / DP 9)

**10.1.2** — Entrega final de diseño UX/UI: archivo Figma consolidado con todos los flujos y pantallas finales del MVP.
<br>*Dependencias:* 2.2.1, 2.2.2, 2.2.3, 2.2.4, 2.2.5, 2.2.6, 2.2.7, 2.2.8 · *Estimación:* 3.17 h (DO 2 / DM 3 / DP 5)

### 10.2 Documentación técnica

**10.2.1** — README del proyecto: instalación, configuración y ejecución local.
<br>*Dependencias:* 3.2.3 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

**10.2.2** — Documentación de APIs: endpoints principales, parámetros, respuestas y errores. Documentación del modelo de datos: entidades, relaciones y reglas principales. Documentación de deployment: despliegue, variables y validación básica.
<br>*Dependencias:* 4.1.3, 5.1.4, 6.1.3, 6.3.4, 7.1.3, 11.1.3, 12.1.2 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)


## 11.0 Notificaciones — **NUEVO**

### 11.1 Backend de notificaciones

**11.1.1** 🆕 — Modelo de notificación: tipo, destinatario, estado leída/no leída, canal y payload asociado.
<br>*Dependencias:* 4.1.1 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

**11.1.2** 🆕 — Selección de proveedor de push y email: FCM para push y proveedor transaccional para email, con verificación de límites del plan gratuito.
<br>*Dependencias:* 4.1.1 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**11.1.3** 🆕 — Servicio de envío de notificaciones: disparo ante solicitud creada, aceptada o rechazada y ante cancelación de partido.
<br>*Dependencias:* 11.1.1, 11.1.2, 6.3.2, 6.3.3 · *Estimación:* 4.75 h (DO 3 / DM 4.5 / DP 7.5)

**11.1.4** 🆕 — Job de recordatorio pre-partido: proceso programado que avisa a los participantes 24 h antes del partido.
<br>*Dependencias:* 11.1.3, 6.1.1 · *Estimación:* 3.12 h (DO 1.5 / DM 3 / DP 5.2)

### 11.2 Frontend de notificaciones

**11.2.1** 🆕 — Centro de notificaciones: pantalla con el listado de notificaciones e indicador de no leídas.
<br>*Dependencias:* 11.1.1, 2.2.7 · *Estimación:* 3.9 h (DO 2.2 / DM 3.8 / DP 6)

**11.2.2** 🆕 — Recepción de push en cliente: registro del token de dispositivo y manejo de la recepción.
<br>*Dependencias:* 11.1.2 · *Estimación:* 4.03 h (DO 2.2 / DM 3.8 / DP 6.8)

**11.2.3** 🆕 — Preferencias de notificación: activación y desactivación de push y email por parte del usuario.
<br>*Dependencias:* 11.2.1 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)


## 12.0 Moderación y Reportes — **NUEVO**

### 12.1 Reportar usuario

**12.1.1** 🆕 — Modelo de reporte: reportante, reportado, motivo, comentario opcional, partido asociado y estado.
<br>*Dependencias:* 4.1.1 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

**12.1.2** 🆕 — Endpoint de creación de reporte: registro de un reporte de un usuario sobre otro.
<br>*Dependencias:* 12.1.1 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**12.1.3** 🆕 — Interfaz de reporte: acción Reportar desde el perfil de otro usuario y desde el detalle de partido, con selección de motivo.
<br>*Dependencias:* 12.1.2, 2.2.8, 5.2.1, 6.2.3 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)

### 12.2 Panel de moderación

**12.2.1** 🆕 — Panel de revisión de reportes: listado con filtro por estado y acción de marcar como revisado, restringido a rol administrador.
<br>*Dependencias:* 12.1.2, 2.2.8 · *Estimación:* 6.27 h (DO 3.8 / DM 6 / DP 9.8)

**12.2.2** 🆕 — Suspensión de usuario: acción de suspender una cuenta desde el panel, con bloqueo de acceso a rutas privadas.
<br>*Dependencias:* 12.2.1, 4.1.3 · *Estimación:* 4.03 h (DO 2.2 / DM 3.8 / DP 6.8)

**12.2.3** 🆕 — Historial de moderación: registro de las acciones tomadas sobre cada reporte y sobre cada usuario.
<br>*Dependencias:* 12.2.1 · *Estimación:* 3.12 h (DO 1.5 / DM 3 / DP 5.2)
