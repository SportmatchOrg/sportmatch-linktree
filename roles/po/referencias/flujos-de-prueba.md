# Flujos de prueba — para el PO

Guía para probar SportMatch a mano, sin gastar horas de los devs. No reemplaza a
`sportmatch/docs/smoke-test.md`, que es el checklist post-deploy del equipo: esto es más corto y está
escrito para verificar **qué está hecho de verdad** antes de decirlo en una review.

Los flujos están agrupados por lo que verifican. Cada uno arranca desde cero y termina en algo observable.

---

## 0. Levantar la app

**En el entorno desplegado** (lo más rápido, y es lo que se demuestra):

- Front dev: https://sportmatch-git-dev-sportmatch2.vercel.app
- Back dev: https://sportmatch-dev-aqhcazaacaf7e6g0.brazilsouth-01.azurewebsites.net

La primera request puede tardar varios segundos: Neon suspende la base por inactividad. No es un error.

**En local**, desde `sportmatch/`:

```bash
nvm use
npm install
npm --prefix front ci
npm --prefix back ci
docker compose up -d db
npm --prefix back run db:migrate     # crea el schema
npm --prefix back run db:seed        # NO corre solo: hay que ejecutarlo
npm --prefix back run start:dev      # puerto 3001
npm --prefix front run dev           # puerto 3000
```

**Hacen falta dos cuentas.** El organizador no puede pedir sumarse a su propio partido, así que todo el
flujo de solicitudes necesita una segunda cuenta de Firebase. Sin eso, los flujos 3 y 4 no se pueden
probar de punta a punta. Es lo primero a resolver.

Abrir DevTools en Network y Console desde el principio: la mitad de los problemas se ven ahí antes que en
la pantalla.

---

## 1. Acceso y perfil — RF-01, RF-02

Pantallas 01, 02, 12.

1. Ventana de incógnito → la URL raíz `/`. Tiene que caer en `/login`.
   *(Hoy no hay landing pública: eso es SPO-192, todavía en el backlog.)*
2. Crear cuenta con email y contraseña. Validaciones: email inválido, contraseña corta.
3. Cerrar sesión desde el menú del perfil y volver a entrar **con Google**.
4. Ir a `/perfil`. Tiene que mostrar el nombre y la foto de la cuenta.
5. **Los tiles "Puntaje" y "Semanas" tienen que estar en `—`, no en `0`.** Son datos que no existen; un
   número ahí es relleno y está mal.
6. "Partidos jugados" muestra un número real y "Partidos recientes" hasta 5 filas, de la más reciente a la
   más vieja. Sin historial: `0` y el estado vacío.

**Qué mirar:** que un error de la API rompa solo la sección y no toda la página.

---

## 2. Crear un partido — RF-03

Pantallas 06 a 10, más la 11.

1. Tocar el `+` del tab bar. El wizard abre **a pantalla completa, sin tab bar**, en el paso 1 de 5.
2. Recorrer los cinco pasos: deporte → lugar → horario → jugadores (cupo con `−`/`+`, nivel, descripción)
   → revisión.
3. **Volver atrás en cada paso**: lo cargado tiene que seguir ahí.
4. Intentar continuar con un campo inválido: no avanza y muestra el error.
5. Intentar elegir un horario que ya pasó: no lo tiene que permitir.
6. El paso 5 muestra todo como se cargó, con tu nombre como anfitrión.
7. Publicar. Toast verde y la app cae en "Tus partidos", con el partido en **"Organizás"**.
8. **Doble toque en publicar no crea dos partidos.**

**Qué mirar:** que no haya campo "título" (el partido no tiene) ni chips de lugares frecuentes (el dato no
existe).

---

## 3. Descubrir y pedir sumarse — RF-04, RF-05

Pantallas 04 y 05. **Necesita la segunda cuenta.**

1. Con la **cuenta A**, crear un partido.
2. Con la **cuenta B**, ir a `/buscar`. El mazo de tarjetas tiene que mostrar el partido de A.
3. Verificar las exclusiones del mazo — **ninguno de estos aparece**:
   - un partido propio,
   - uno en el que ya estás,
   - uno con el cupo lleno,
   - uno cuya fecha ya pasó,
   - uno al que ya le mandaste solicitud.
4. Tocar una tarjeta → abre el detalle (pantalla 05): foto, quién organiza, horario, nivel, quién juega.
5. CTA **"Pedir sumarme"**. La pantalla queda en **"Esperando al organizador"**, con "Cancelar solicitud"
   en confirmación de dos pasos.
6. Volver a `/buscar` y **deslizar a la derecha** sobre otro partido → toast verde `Solicitud enviada ⚡`.
   Ese partido no vuelve a aparecer en el mazo.
7. "Empezar de nuevo" al final del mazo.
   *(Hoy solo reinicia el índice; que además **refresque** desde la API es SPO-190, en el backlog.)*
8. Los chips de filtro por deporte **todavía no existen**: es SPO-193, en el backlog. Si alguien dice que
   están hechos, esto lo desmiente.

---

## 4. El organizador acepta o rechaza — RF-05

Pantalla 11 y el detalle. **Necesita las dos cuentas.**

1. Con la **cuenta A**, abrir el detalle de su partido. El panel muestra las solicitudes pendientes: badge
   de pendientes, contador de confirmados, filas con los botones ✓ / ✗.
2. **Aceptar una** → esa persona entra en "Quién juega" y el contador sube.
3. **Rechazar la otra** → la fila queda atenuada y nadie entra.
4. Con la **cuenta B**: uno de los partidos dice "Estás dentro" y el otro ofrece volver a pedirlo.
5. Ir a "Tus partidos" con la cuenta A. **El panel debería estar también dentro de la card de
   "Organizás"** — es donde lo pone el diseño. Si solo está en el detalle, falta SPO-206.
6. En "Estás dentro" (cuenta B): salirse pide confirmación y saca el partido de la lista.
7. En "Organizás" (cuenta A): "Cancelar partido" pide confirmación en dos pasos y el partido desaparece.

**Fuera de alcance, no es un bug:** el organizador **no puede sacar a alguien ya aceptado**, y al jugador
no se le notifica nada — se entera al abrir la app.

---

## 5. Autorización — RF-01

Esto se prueba con Postman o `curl`, con los tokens de las dos cuentas. Es lo que nadie ve en la demo y lo
que más caro sale si está mal.

Con el token de A, contra recursos de B:

- `PATCH /users/<id de B>` → **403**
- `DELETE /users/<id de B>` → **403**
- `PATCH /users/<id de A>` mandando `firebaseUid` o `email` → **400**
- `GET /users` y `GET /users/<id>` → **sin** `email` ni `firebaseUid`
- `GET /users/me` → completo
- `PATCH /partidos/<de B>` → **403**
- `PATCH /partidos/<de A>` bajando el cupo por debajo de los anotados → **400**
- `PATCH` sobre un partido ya jugado → **400**
- `POST /partidos/<id>/participantes` → **404** (el join directo ya no existe)
- `GET /partidos/<de B>/join-requests` → **403**

---

## 6. Después del refactor de idioma — SPO-200 … SPO-205

Cuando el refactor esté mergeado, **las rutas de la API cambian y las del navegador no**. Esto es lo que
hay que verificar, y es el criterio de si el refactor salió bien:

**Las URLs del navegador siguen exactamente iguales:**
`/buscar` · `/mis-partidos` · `/perfil` · `/partidos/nuevo` · `/partidos/<id>`

**Las rutas de la API cambiaron:**

| Antes | Después |
| --- | --- |
| `GET /partidos` | `GET /matches` |
| `GET /partidos/mios` | `GET /matches/mine` |
| `GET /deportes` | `GET /sports` |
| `DELETE /partidos/:id/participantes/me` | `DELETE /matches/:id/participants/me` |
| `POST /partidos/:id/join-requests` | `POST /matches/:id/join-requests` |

Las viejas tienen que devolver **404**.

**En el JSON de un partido** ya no puede aparecer ningún campo en castellano: donde decía `anotados`,
`estoy_anotado`, `cupo`, `ubicacion`, `fecha`, `nivel` y `organizador` ahora dice `joinedCount`,
`isJoined`, `capacity`, `location`, `date`, `level` y `organizer`. Y `GET /matches/mine` devuelve
`{ organizing, playing, played }`.

**Y lo más importante: rehacer los flujos 1 a 4 completos.** Ni un texto en pantalla puede haber cambiado.
Si algo que ve el usuario se lee distinto después del refactor, es un bug del refactor — la regla es
código en inglés, producto en castellano.

---

## Cómo anotar lo que sale

Para cada flujo: qué se probó, en qué entorno, y qué falló con el detalle exacto. Si algo falla, el
`SPO-###` del ticket que lo tenía que cubrir. Eso es lo que se lleva a la review, y lo que evita discutir
si algo está hecho o no.
