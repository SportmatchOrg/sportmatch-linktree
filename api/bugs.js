import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { neon } from '@neondatabase/serverless';

const MAX_TITLE = 120;
const MAX_DESCRIPTION = 5000;
const MAX_ATTACHMENTS = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const REPORTS_PER_HOUR = 10;
const UPLOAD_TOKEN_SECONDS = 15 * 60;
const SIGNED_UPLOAD_SECONDS = 5 * 60;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const FILE_TYPES = Object.freeze({
  'image/png': { extensions: ['.png'], outputExtension: '.png' },
  'image/jpeg': { extensions: ['.jpg', '.jpeg'], outputExtension: '.jpg' },
  'image/webp': { extensions: ['.webp'], outputExtension: '.webp' },
  'text/markdown': { extensions: ['.md', '.markdown'], outputExtension: '.md' },
  'application/pdf': { extensions: ['.pdf'], outputExtension: '.pdf' },
});

let databaseClient;
let storageClient;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new ConfigurationError(`Missing ${name}`);
  return value;
}

function database() {
  if (!databaseClient) databaseClient = neon(requiredEnv('DATABASE_URL'));
  return databaseClient;
}

function storageEndpoint() {
  return process.env.BUG_STORAGE_ENDPOINT || requiredEnv('AWS_ENDPOINT_URL_S3');
}

function storageRegion() {
  return process.env.BUG_STORAGE_REGION || process.env.AWS_REGION || 'us-east-2';
}

function storageBucket() {
  return process.env.BUG_STORAGE_BUCKET || 'bug-attachments';
}

function storage() {
  if (!storageClient) {
    storageClient = new S3Client({
      endpoint: storageEndpoint(),
      region: storageRegion(),
      forcePathStyle: process.env.BUG_STORAGE_FORCE_PATH_STYLE !== 'false',
      credentials: {
        accessKeyId: requiredEnv('AWS_ACCESS_KEY_ID'),
        secretAccessKey: requiredEnv('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }
  return storageClient;
}

class HttpError extends Error {
  constructor(status, code, message, headers = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.headers = headers;
  }
}

class ConfigurationError extends Error {}

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

function queryValue(request, key) {
  const value = request.query?.[key];
  return Array.isArray(value) ? value[0] : value;
}

function cleanText(value, field, maxLength) {
  if (typeof value !== 'string') throw new HttpError(400, 'VALIDATION_ERROR', `${field} is required.`);
  const cleaned = value.trim();
  if (!cleaned) throw new HttpError(400, 'VALIDATION_ERROR', `${field} is required.`);
  if (cleaned.length > maxLength) {
    throw new HttpError(400, 'VALIDATION_ERROR', `${field} must be ${maxLength} characters or fewer.`);
  }
  return cleaned;
}

function requestIp(request) {
  const forwarded = request.headers['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return String(first || request.headers['x-real-ip'] || request.socket?.remoteAddress || 'unknown').trim();
}

function sourceHash(request) {
  return createHmac('sha256', requiredEnv('SUBMISSION_PEPPER')).update(requestIp(request)).digest('hex');
}

function encodeToken(payload, secret = requiredEnv('SUBMISSION_TOKEN_SECRET')) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function decodeToken(token, secret = requiredEnv('SUBMISSION_TOKEN_SECRET'), now = Date.now()) {
  if (typeof token !== 'string') throw new HttpError(403, 'INVALID_UPLOAD_TOKEN', 'The upload token is missing or invalid.');
  const [encoded, suppliedSignature, extra] = token.split('.');
  if (!encoded || !suppliedSignature || extra) {
    throw new HttpError(403, 'INVALID_UPLOAD_TOKEN', 'The upload token is missing or invalid.');
  }

  const expectedSignature = createHmac('sha256', secret).update(encoded).digest();
  let supplied;
  try {
    supplied = Buffer.from(suppliedSignature, 'base64url');
  } catch {
    throw new HttpError(403, 'INVALID_UPLOAD_TOKEN', 'The upload token is missing or invalid.');
  }
  const canonicalSignature = supplied.toString('base64url');
  if (
    canonicalSignature !== suppliedSignature
    || supplied.length !== expectedSignature.length
    || !timingSafeEqual(supplied, expectedSignature)
  ) {
    throw new HttpError(403, 'INVALID_UPLOAD_TOKEN', 'The upload token is missing or invalid.');
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    throw new HttpError(403, 'INVALID_UPLOAD_TOKEN', 'The upload token is missing or invalid.');
  }
  if (!UUID_PATTERN.test(payload.bug_id || '') || !Number.isFinite(payload.exp) || payload.exp * 1000 <= now) {
    throw new HttpError(403, 'EXPIRED_UPLOAD_TOKEN', 'The upload session has expired. Post the report again to upload files.');
  }
  return payload;
}

function fileDetails(filename, mimeType, size) {
  const name = cleanText(filename, 'Filename', 255);
  const normalizedMime = typeof mimeType === 'string' ? mimeType.toLowerCase().trim() : '';
  const rule = FILE_TYPES[normalizedMime];
  const lowerName = name.toLowerCase();
  const matchesExtension = rule?.extensions.some((extension) => lowerName.endsWith(extension));
  if (!rule || !matchesExtension) {
    throw new HttpError(400, 'INVALID_FILE_TYPE', 'Only PNG, JPEG, WebP, Markdown, and PDF files are allowed.');
  }
  if (!Number.isInteger(size) || size < 1 || size > MAX_FILE_SIZE) {
    throw new HttpError(400, 'INVALID_FILE_SIZE', 'Each attachment must be between 1 byte and 10 MB.');
  }
  return { name, mimeType: normalizedMime, size, outputExtension: rule.outputExtension };
}

function objectUrl(key) {
  const configuredBase = process.env.BUG_STORAGE_PUBLIC_BASE_URL;
  const base = (configuredBase || `${storageEndpoint().replace(/\/+$/, '')}/${storageBucket()}`).replace(/\/+$/, '');
  const encodedPath = key.split('/').map(encodeURIComponent).join('/');
  return `${base}/${encodedPath}`;
}

async function readReports(request, response) {
  const sql = database();
  const id = queryValue(request, 'id');
  if (id) {
    if (!UUID_PATTERN.test(id)) throw new HttpError(400, 'INVALID_ID', 'The bug ID is invalid.');
    const reports = await sql`
      select id, issue_number, title, description, created_at
      from public.bug_reports
      where id = ${id}
      limit 1
    `;
    if (!reports.length) throw new HttpError(404, 'NOT_FOUND', 'Bug not found.');
    const attachments = await sql`
      select id, original_name, mime_type, size_bytes, public_url, created_at
      from public.bug_attachments
      where bug_id = ${id} and upload_state = 'ready'
      order by created_at asc
    `;
    return json(response, 200, { bug: { ...reports[0], attachments } });
  }

  const reports = await sql`
    select
      r.id,
      r.issue_number,
      r.title,
      r.description,
      r.created_at,
      count(a.id)::int as attachment_count
    from public.bug_reports r
    left join public.bug_attachments a
      on a.bug_id = r.id and a.upload_state = 'ready'
    group by r.id
    order by r.created_at desc
  `;
  return json(response, 200, { bugs: reports });
}

async function readExport(response) {
  const sql = database();
  const reports = await sql`
    select id, issue_number, title, description, created_at
    from public.bug_reports
    order by issue_number asc
  `;
  const attachments = await sql`
    select id, bug_id, original_name, mime_type, size_bytes, public_url, created_at
    from public.bug_attachments
    where upload_state = 'ready'
    order by bug_id asc, created_at asc, id asc
  `;
  const byBug = new Map(reports.map(report => [report.id, []]));
  for (const attachment of attachments) byBug.get(attachment.bug_id)?.push(attachment);
  return json(response, 200, {
    exported_at: new Date().toISOString(),
    bugs: reports.map(report => ({ ...report, attachments: byBug.get(report.id) || [] })),
  });
}

async function createReport(request, response, body) {
  const title = cleanText(body.title, 'Title', MAX_TITLE);
  const description = cleanText(body.description, 'Description', MAX_DESCRIPTION);
  const hash = sourceHash(request);
  const sql = database();
  const recent = await sql`
    select count(*)::int as count
    from public.bug_reports
    where source_hash = ${hash} and created_at > now() - interval '1 hour'
  `;
  if (Number(recent[0]?.count || 0) >= REPORTS_PER_HOUR) {
    throw new HttpError(429, 'RATE_LIMITED', 'Too many reports were posted from this connection. Try again in an hour.', {
      'Retry-After': '3600',
    });
  }

  const inserted = await sql`
    insert into public.bug_reports (title, description, source_hash)
    values (${title}, ${description}, ${hash})
    returning id, issue_number, title, description, created_at
  `;
  const bug = inserted[0];
  const uploadToken = encodeToken({
    bug_id: bug.id,
    exp: Math.floor(Date.now() / 1000) + UPLOAD_TOKEN_SECONDS,
  });
  return json(response, 201, { bug, upload_token: uploadToken });
}

async function signUpload(response, body) {
  const token = decodeToken(body.upload_token);
  const details = fileDetails(body.filename, body.mime_type, body.size_bytes);
  const sql = database();
  const reports = await sql`select id from public.bug_reports where id = ${token.bug_id} limit 1`;
  if (!reports.length) throw new HttpError(404, 'NOT_FOUND', 'Bug not found.');
  const counts = await sql`select count(*)::int as count from public.bug_attachments where bug_id = ${token.bug_id}`;
  if (Number(counts[0]?.count || 0) >= MAX_ATTACHMENTS) {
    throw new HttpError(400, 'ATTACHMENT_LIMIT', `A bug can have at most ${MAX_ATTACHMENTS} attachments.`);
  }

  const attachmentId = randomUUID();
  const key = `bugs/${token.bug_id}/${attachmentId}${details.outputExtension}`;
  const publicUrl = objectUrl(key);
  const bucket = storageBucket();
  const contentDisposition = details.mimeType === 'text/markdown'
    ? `attachment; filename*=UTF-8''${encodeURIComponent(details.name)}`
    : undefined;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: details.mimeType,
    ContentLength: details.size,
    ContentDisposition: contentDisposition,
    Metadata: { bug_id: token.bug_id, attachment_id: attachmentId },
  });
  const uploadUrl = await getSignedUrl(storage(), command, { expiresIn: SIGNED_UPLOAD_SECONDS });

  await sql`
    insert into public.bug_attachments
      (id, bug_id, storage_key, public_url, original_name, mime_type, size_bytes, upload_state)
    values
      (${attachmentId}, ${token.bug_id}, ${key}, ${publicUrl}, ${details.name}, ${details.mimeType}, ${details.size}, 'pending')
  `;

  return json(response, 201, {
    attachment: {
      id: attachmentId,
      original_name: details.name,
      mime_type: details.mimeType,
      size_bytes: details.size,
      public_url: publicUrl,
    },
    upload: {
      method: 'PUT',
      url: uploadUrl,
      headers: {
        'Content-Type': details.mimeType,
        ...(contentDisposition ? { 'Content-Disposition': contentDisposition } : {}),
      },
      expires_in: SIGNED_UPLOAD_SECONDS,
    },
  });
}

async function completeUpload(response, body) {
  const token = decodeToken(body.upload_token);
  const attachmentId = body.attachment_id;
  if (!UUID_PATTERN.test(attachmentId || '')) throw new HttpError(400, 'INVALID_ID', 'The attachment ID is invalid.');
  const sql = database();
  const rows = await sql`
    select id, storage_key, mime_type, size_bytes
    from public.bug_attachments
    where id = ${attachmentId} and bug_id = ${token.bug_id} and upload_state = 'pending'
    limit 1
  `;
  if (!rows.length) throw new HttpError(404, 'NOT_FOUND', 'Pending attachment not found.');
  const attachment = rows[0];
  const head = await storage().send(new HeadObjectCommand({
    Bucket: storageBucket(),
    Key: attachment.storage_key,
  }));
  if (Number(head.ContentLength) !== Number(attachment.size_bytes) || head.ContentType !== attachment.mime_type) {
    throw new HttpError(400, 'UPLOAD_MISMATCH', 'The stored file does not match the attachment metadata.');
  }
  await sql`
    update public.bug_attachments
    set upload_state = 'ready'
    where id = ${attachmentId} and bug_id = ${token.bug_id}
  `;
  return json(response, 200, { attachment: { id: attachmentId, upload_state: 'ready' } });
}

async function cancelUpload(response, body) {
  const token = decodeToken(body.upload_token);
  const attachmentId = body.attachment_id;
  if (!UUID_PATTERN.test(attachmentId || '')) throw new HttpError(400, 'INVALID_ID', 'The attachment ID is invalid.');
  const sql = database();
  const rows = await sql`
    select id, storage_key
    from public.bug_attachments
    where id = ${attachmentId} and bug_id = ${token.bug_id} and upload_state = 'pending'
    limit 1
  `;
  if (!rows.length) return json(response, 200, { removed: true });
  await storage().send(new DeleteObjectCommand({
    Bucket: storageBucket(),
    Key: rows[0].storage_key,
  }));
  await sql`
    delete from public.bug_attachments
    where id = ${attachmentId} and bug_id = ${token.bug_id} and upload_state = 'pending'
  `;
  return json(response, 200, { removed: true });
}

async function handleRequest(request, response) {
  const action = queryValue(request, 'action');
  if (request.method === 'GET' && action === 'export') return readExport(response);
  if (request.method === 'GET') return readReports(request, response);

  const body = parseBody(request);
  if (request.method === 'POST' && action === 'create') return createReport(request, response, body);
  if (request.method === 'POST' && action === 'sign-upload') return signUpload(response, body);
  if (request.method === 'POST' && action === 'complete-upload') return completeUpload(response, body);
  if (request.method === 'DELETE' && action === 'cancel-upload') return cancelUpload(response, body);

  throw new HttpError(405, 'METHOD_NOT_ALLOWED', 'This operation is not supported.', { Allow: 'GET, POST, DELETE' });
}

export default async function handler(request, response) {
  try {
    return await handleRequest(request, response);
  } catch (error) {
    if (error instanceof HttpError) return json(response, error.status, { error: { code: error.code, message: error.message } }, error.headers);
    if (error instanceof ConfigurationError) {
      console.error(error.message);
      return json(response, 503, { error: { code: 'SERVICE_NOT_CONFIGURED', message: 'The bug service is not configured yet.' } });
    }
    console.error('Unexpected bugs API error', error);
    return json(response, 500, { error: { code: 'INTERNAL_ERROR', message: 'The bug service could not complete the request.' } });
  }
}

export const testing = {
  cleanText,
  decodeToken,
  encodeToken,
  fileDetails,
  MAX_ATTACHMENTS,
  MAX_DESCRIPTION,
  MAX_FILE_SIZE,
  MAX_TITLE,
};
