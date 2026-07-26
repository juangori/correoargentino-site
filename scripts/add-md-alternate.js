#!/usr/bin/env node
/**
 * add-md-alternate.js
 * Declara el espejo Markdown de cada página con
 *   <link rel="alternate" type="text/markdown" href="…md">
 * justo después del <link rel="canonical">. Sólo lo agrega si el .md existe
 * en disco (no promete lo que no está). Idempotente.
 *
 * Uso: node scripts/add-md-alternate.js  |  DRY=1 node scripts/add-md-alternate.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DRY = !!process.env.DRY;

const EXCLUDE_DIRS = new Set(['node_modules', 'scripts', '.git', '.wrangler', 'assets', 'og', 'fonts']);
const EXCLUDE_FILES = new Set(['admin.html', '404.html']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) { if (!EXCLUDE_DIRS.has(e.name)) walk(path.join(dir, e.name), out); }
    else if (e.isFile() && e.name.endsWith('.html') && !EXCLUDE_FILES.has(e.name)) out.push(path.join(dir, e.name));
  }
  return out;
}

const CANON_RE = /^([ \t]*)<link rel="canonical" href="[^"]*">[ \t]*$/m;

let added = 0, already = 0, nomd = 0, nocanon = 0;
for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, 'utf8');
  const mdFile = file.replace(/\.html$/, '.md');
  if (!fs.existsSync(mdFile)) { nomd++; continue; }          // no hay espejo -> no se declara
  if (src.includes('type="text/markdown"')) { already++; continue; }
  if (!CANON_RE.test(src)) { nocanon++; continue; }

  const href = path.basename(mdFile);
  const out = src.replace(CANON_RE, (m, indent) =>
    `${m}\n${indent}<link rel="alternate" type="text/markdown" href="${href}">`
  );
  if (!DRY) fs.writeFileSync(file, out, 'utf8');
  added++;
}
console.log(`${DRY ? '[DRY] ' : ''}alternate agregado: ${added} · ya lo tenían: ${already} · sin .md: ${nomd} · sin canonical: ${nocanon}`);
