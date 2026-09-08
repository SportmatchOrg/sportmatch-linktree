import { neon } from '@neondatabase/serverless';

const MAX_NAME = 120;
const MAX_URL = 2048;
const MAX_CATEGORY = 80;
const MAX_SUBCATEGORY = 100;
const MAX_DESCRIPTION = 600;
const MAX_TAGS = 8;
const MAX_TAG = 40;

let databaseClient;

class HttpError extends Error {
  constructor(status, code, message, headers = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.headers = headers;
  }
}

class ConfigurationError extends Error {}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new ConfigurationError(`Missing ${name}`);
  return value;
}

function database() {
  if (!databaseClient) databaseClient = neon(requiredEnv('DATABASE_URL'));
  return databaseClient;
}

function json(response, status, payload, headers = {}) {
  response.status(status);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  for (const [name, value] of Object.entries(headers)) response.setHeader(name, value);
  return response.json(payload);
}

function parseBody(request) {
  if (!request.body) return {};
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body);
    } catch {
      throw new HttpError(400, 'INVALID_JSON', 'The request body must be valid JSON.');
    }
  }
  if (typeof request.body !== 'object' || Array.isArray(request.body)) {
    throw new HttpError(400, 'INVALID_JSON', 'The request body must be a JSON object.');
  }
  return request.body;
}

function cleanText(value, field, maxLength, { optional = false } = {}) {
  if (optional && (value === undefined || value === null || value === '')) return null;
  if (typeof value !== 'string') throw new HttpError(400, 'VALIDATION_ERROR', `${field} is required.`);
  const cleaned = value.trim();
  if (!cleaned) {
    if (optional) return null;
    throw new HttpError(400, 'VALIDATION_ERROR', `${field} is required.`);
  }
  if (cleaned.length > maxLength) {
    throw new HttpError(400, 'VALIDATION_ERROR', `${field} must be ${maxLength} characters or fewer.`);
  }
  return cleaned;
}

function cleanUrl(value) {
  const raw = cleanText(value, 'URL', MAX_URL);
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Enter a valid URL.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'The URL must use HTTP or HTTPS.');
  }
  parsed.hash = '';
  return { url: parsed.toString(), domain: parsed.hostname.toLowerCase() };
}

function cleanTags(value) {
  const source = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  const tags = [...new Set(source.map(tag => cleanText(tag, 'Each tag', MAX_TAG, { optional: true })).filter(Boolean))];
  if (tags.length > MAX_TAGS) {
    throw new HttpError(400, 'VALIDATION_ERROR', `Use no more than ${MAX_TAGS} tags.`);
  }
  return tags;
}

function cleanResource(body) {
  const address = cleanUrl(body.url);
  return {
    name: cleanText(body.name, 'Name', MAX_NAME),
    ...address,
    category: cleanText(body.category, 'Category', MAX_CATEGORY),
    subcategory: cleanText(body.subcategory, 'Subcategory', MAX_SUBCATEGORY, { optional: true }),
    description: cleanText(body.description, 'Description', MAX_DESCRIPTION),
    tags: cleanTags(body.tags),
  };
}

async function readResources(response) {
  const sql = database();
  const resources = await sql`
    select id, name, url, domain, category, subcategory, description, tags, created_at
    from public.dev_resources
    order by sort_order asc nulls last, created_at asc, name asc
  `;
  return json(response, 200, { resources });
}

async function createResource(response, body) {
  const resource = cleanResource(body);
  const sql = database();
  try {
    const inserted = await sql`
      insert into public.dev_resources
        (name, url, domain, category, subcategory, description, tags)
      values
        (${resource.name}, ${resource.url}, ${resource.domain}, ${resource.category},
         ${resource.subcategory}, ${resource.description}, ${resource.tags})
      returning id, name, url, domain, category, subcategory, description, tags, created_at
    `;
    return json(response, 201, { resource: inserted[0] });
  } catch (error) {
    if (error?.code === '23505') {
      throw new HttpError(409, 'DUPLICATE_RESOURCE', 'A resource with this URL already exists.');
    }
    throw error;
  }
}

async function handleRequest(request, response) {
  if (request.method === 'GET') return readResources(response);
  if (request.method === 'POST') return createResource(response, parseBody(request));
  throw new HttpError(405, 'METHOD_NOT_ALLOWED', 'This operation is not supported.', { Allow: 'GET, POST' });
}

export default async function handler(request, response) {
  try {
    return await handleRequest(request, response);
  } catch (error) {
    if (error instanceof HttpError) {
      return json(response, error.status, { error: { code: error.code, message: error.message } }, error.headers);
    }
    if (error instanceof ConfigurationError) {
      console.error(error.message);
      return json(response, 503, { error: { code: 'SERVICE_NOT_CONFIGURED', message: 'The resource directory is not configured yet.' } });
    }
    console.error('Unexpected resources API error', error);
    return json(response, 500, { error: { code: 'INTERNAL_ERROR', message: 'The resource directory could not complete the request.' } });
  }
}

export const testing = {
  cleanResource,
  cleanTags,
  cleanUrl,
  MAX_DESCRIPTION,
  MAX_NAME,
  MAX_TAG,
  MAX_TAGS,
};
