/*
 * Reconecta cada post a su OG/hero propios (correr después de generate.mjs):
 *  - og:image + twitter:image (si existe) -> /og/<slug>.jpg
 *  - agrega og:image:width/height (1200x630)
 *  - reemplaza el SVG del hero (.post-hero__art) por <img> del hero webp
 * Idempotente y con guarda: solo toca posts cuyas 2 imágenes existen.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = join(__dirname, '../..');
const raw = readFileSync(join(SITE, 'blog/posts-data.js'), 'utf8');
const posts = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1));

let done = 0; const skipped = [], warns = [];

for (const p of posts) {
  const base = p.u.replace(/\.html$/, '');
  if (!existsSync(join(SITE, 'og', base + '.jpg')) || !existsSync(join(SITE, 'og', 'hero', base + '.webp'))) {
    skipped.push(base + ' (falta imagen)'); continue;
  }
  const file = join(SITE, 'blog', p.u);
  let html = readFileSync(file, 'utf8');
  const before = html;
  const ogUrl = `https://correoargentinopro.com/og/${base}.jpg`;

  if (/<meta property="og:image" content="[^"]*">/.test(html))
    html = html.replace(/(<meta property="og:image" content=")[^"]*(">)/, `$1${ogUrl}$2`);
  else warns.push(base + ': sin og:image');

  if (!/og:image:width/.test(html))
    html = html.replace(/(<meta property="og:image" content="[^"]*">)/,
      `$1\n    <meta property="og:image:width" content="1200">\n    <meta property="og:image:height" content="630">`);

  if (/<meta name="twitter:image" content="[^"]*">/.test(html))
    html = html.replace(/(<meta name="twitter:image" content=")[^"]*(">)/, `$1${ogUrl}$2`);

  if (/<div class="post-hero__art"[^>]*>[\s\S]*?<\/div>/.test(html))
    html = html.replace(/(<div class="post-hero__art"[^>]*>)[\s\S]*?<\/div>/,
      `$1\n            <img src="/og/hero/${base}.webp" width="1200" height="800" alt="" decoding="async">\n        </div>`);
  else warns.push(base + ': sin post-hero__art');

  if (html !== before) { writeFileSync(file, html); done++; }
}

console.log(`Reconectados: ${done}`);
if (skipped.length) { console.log(`\nSalteados (${skipped.length}):`); skipped.forEach(s => console.log('  - ' + s)); }
if (warns.length) { console.log(`\nAvisos (${warns.length}):`); warns.forEach(w => console.log('  - ' + w)); }
