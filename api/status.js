// Comprueba, desde el server, que cada pieza de SportMatch responde lo que
// esperamos. Se hace acá y no en el browser porque CORS impide leer la
// respuesta de esos dominios desde la página.

const TIMEOUT_MS = 10_000;

// `expect` es el status HTTP sano de cada target, y no siempre es 200.
// `GET /health` del backend hace un `select 1`: 200 `{ok:true}` con la base
// arriba, 503 `{ok:false}` si no. Prueba toda la cadena hasta Postgres.
//
// Prod todavía no tiene `/health` desplegado (devuelve 404), así que sigue
// mirando `/users`, que contesta 401 "Missing bearer token" sin tocar la base:
// prueba que Nest booteó, no que la base esté arriba. Cuando `/health` llegue a
// prod, se cambian `url`, `expect` y `detail` igual que en dev.
const TARGETS = Object.freeze([
  {
    id: 'prod',
    name: 'Backend · Prod',
    url: 'https://sportmatch-prod-akbwbvf4fbewf3ax.brazilsouth-01.azurewebsites.net/users',
    expect: 401,
    detail: 'API NestJS en Azure (Brazil South).',
  },
  {
    id: 'dev',
    name: 'Backend · Dev',
    url: 'https://sportmatch-dev-aqhcazaacaf7e6g0.brazilsouth-01.azurewebsites.net/health',
    expect: 200,
    detail: 'API de desarrollo y su base de datos.',
  },
  {
    id: 'web',
    name: 'Frontend · CDN',
    url: 'https://sportmatch-nine.vercel.app/',
    expect: 200,
    // Deliberadamente no se llama "SportMatch": esta URL se sirve desde la
    // caché de borde de Vercel y sigue en 200 aunque el backend esté caído.
    detail: 'HTML servido desde el borde de Vercel. No refleja el estado del backend.',
  },
]);

function json(response, status, payload) {
  response.status(status);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  return response.json(payload);
}

function failureReason(error) {
  if (error?.name === 'TimeoutError') return 'timeout';
  return 'network';
}

async function probe(target) {
  const startedAt = Date.now();
  try {
    const result = await fetch(target.url, {
      method: 'GET',
      // `manual` mide el target y no adonde redirija: si mañana /users pasa a
      // redirigir al login, queremos verlo como cambio, no seguirlo hasta un 200.
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'sportmatch-linktree-status' },
    });
    return {
      id: target.id,
      name: target.name,
      detail: target.detail,
      expect: target.expect,
      // El semáforo compara contra el status esperado, NO usa `result.ok`:
      // con `result.ok` un 401 sano quedaría marcado como caído.
      ok: result.status === target.expect,
      status: result.status,
      ms: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      id: target.id,
      name: target.name,
      detail: target.detail,
      expect: target.expect,
      ok: false,
      status: 0,
      ms: Date.now() - startedAt,
      error: failureReason(error),
    };
  }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return json(response, 405, {
      error: { code: 'METHOD_NOT_ALLOWED', message: 'This operation is not supported.' },
    });
  }

  try {
    const targets = await Promise.all(TARGETS.map(probe));
    return json(response, 200, { checkedAt: new Date().toISOString(), targets });
  } catch (error) {
    console.error('Unexpected status API error', error);
    return json(response, 500, {
      error: { code: 'INTERNAL_ERROR', message: 'The status check could not complete.' },
    });
  }
}

export const testing = { failureReason, probe, TARGETS, TIMEOUT_MS };
