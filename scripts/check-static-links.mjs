#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set(['.git', '.vercel', 'node_modules']);
const ignoredFiles = new Set([
  'docs/references/bookmarks.html',
  'generated/figma/standalone.html',
]);

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) continue;
    const absolute = join(directory, entry);
    const repoPath = relative(repoRoot, absolute);
    if (ignoredFiles.has(repoPath)) continue;
    if (statSync(absolute).isDirectory()) files.push(...walk(absolute));
    else if (entry.endsWith('.html')) files.push(absolute);
  }
  return files;
}

function localTarget(page, rawUrl) {
  if (!rawUrl || /^(?:[a-z]+:|#|data:|javascript:|\/\/)/i.test(rawUrl)) return null;
  if (rawUrl.includes('${')) return null;

  const cleanUrl = rawUrl.split(/[?#]/, 1)[0];
  if (!cleanUrl) return null;

  let decoded;
  try {
    decoded = decodeURIComponent(cleanUrl);
  } catch {
    decoded = cleanUrl;
  }

  return decoded.startsWith('/')
    ? join(repoRoot, decoded.slice(1))
    : resolve(dirname(page), decoded);
}

function targetExists(target) {
  if (!target || !existsSync(target)) return false;
  return !statSync(target).isDirectory() || existsSync(join(target, 'index.html'));
}

const missing = [];
const attributePattern = /\b(?:src|href|data-src)=["']([^"']+)["']/g;
const manifestPathPattern = /["']path["']\s*:\s*["']([^"']+)["']/g;

for (const page of walk(repoRoot)) {
  const source = readFileSync(page, 'utf8');
  const patterns = [attributePattern, manifestPathPattern];

  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    for (const match of source.matchAll(pattern)) {
      const target = localTarget(page, match[1]);
      if (target && !targetExists(target)) {
        missing.push(`${relative(repoRoot, page)} -> ${match[1]}`);
      }
    }
  }
}

const vercelConfig = JSON.parse(readFileSync(join(repoRoot, 'vercel.json'), 'utf8'));
for (const route of vercelConfig.routes || []) {
  if (!route.dest || route.dest.includes('$')) continue;
  const target = localTarget(join(repoRoot, 'vercel.json'), route.dest);
  if (target && !targetExists(target)) {
    missing.push(`vercel.json -> ${route.dest}`);
  }
}

if (missing.length) {
  console.error('Missing local resources:');
  for (const item of [...new Set(missing)].sort()) console.error(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log('All static HTML links resolve to local files.');
}
