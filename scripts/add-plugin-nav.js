#!/usr/bin/env node
/**
 * add-plugin-nav.js
 * Agrega el item "Plugin" (link absoluto /plugin/) al navbar de todas las
 * páginas, justo después de "Home". Idempotente: salta las que ya lo tienen
 * (home, landing, autor). Salta admin.html.
 * Uso: node scripts/add-plugin-nav.js   |   DRY=1 node scripts/add-plugin-nav.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DRY = !!process.env.DRY;

const EXCLUDE_DIRS = new Set(['node_modules', 'scripts', '.git', '.wrangler', 'assets', 'og', 'fonts']);
const EXCLUDE_FILES = new Set(['admin.html']);

const HOME_RE = /^([ \t]*)<li><a href="\/">Home<\/a><\/li>/m;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) { if (!EXCLUDE_DIRS.has(e.name)) walk(path.join(dir, e.name), out); }
    else if (e.isFile() && e.name.endsWith('.html') && !EXCLUDE_FILES.has(e.name)) out.push(path.join(dir, e.name));
  }
  return out;
}

let changed = 0, already = 0, nohome = 0;
for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, 'utf8');
  if (src.includes('>Plugin</a>')) { already++; continue; }   // ya tiene el item en el nav
  if (!HOME_RE.test(src)) { nohome++; continue; }
  const out = src.replace(HOME_RE, (m, indent) =>
    `${indent}<li><a href="/">Home</a></li>\n${indent}<li><a href="/plugin/">Plugin</a></li>`
  );
  if (!DRY) fs.writeFileSync(file, out, 'utf8');
  changed++;
}
console.log(`${DRY ? '[DRY] ' : ''}Nav "Plugin" agregado: ${changed} · ya lo tenían: ${already} · sin item Home: ${nohome}`);
