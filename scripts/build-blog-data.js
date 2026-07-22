/*
 * Genera blog/posts-data.js a partir de las cards de los hubs de categoría
 * (blog/<cat>/index.html) + la fecha de publicación de cada post.
 *
 * Salida: window.CAP_POSTS = [{ u, t, d, c, dt }] ordenado por fecha desc.
 *   u  = slug (archivo .html, relativo a /blog/)
 *   t  = título
 *   d  = bajada/blurb
 *   c  = categoría (envios | guias | woocommerce | comparativas)
 *   dt = fecha de publicación (YYYY-MM-DD)
 *
 * Se ejecuta en el deploy (ver .github/workflows/deploy.yml), igual que el sitemap.
 * NO editar blog/posts-data.js a mano.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG = join(ROOT, 'blog');

// Orden = prioridad si un slug apareciera en más de un hub (hoy no ocurre).
const CATEGORIES = [
  { slug: 'envios', label: 'Envíos' },
  { slug: 'guias', label: 'Guías' },
  { slug: 'woocommerce', label: 'WooCommerce' },
  { slug: 'comparativas', label: 'Comparativas' },
];

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&middot;/g, '·')
    .replace(/&rarr;/g, '→').replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í').replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ');
}

function stripTags(s) {
  return decodeEntities((s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')).trim();
}

function publishedDate(slug) {
  try {
    const html = readFileSync(join(BLOG, slug), 'utf8');
    const m = html.match(/article:published_time["']\s+content=["']([^"']+)["']/i)
           || html.match(/"datePublished"\s*:\s*"([^"]+)"/i);
    if (m) return m[1].slice(0, 10);
  } catch { /* archivo faltante */ }
  // Fallback: fecha del primer commit que agregó el archivo.
  try {
    const out = execFileSync(
      'git', ['log', '--diff-filter=A', '--follow', '-1', '--format=%cI', '--', `blog/${slug}`],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    if (out) return out.slice(0, 10);
  } catch { /* sin git */ }
  return '2026-01-01';
}

const posts = [];
const seen = new Set();

for (const cat of CATEGORIES) {
  let html;
  try {
    html = readFileSync(join(BLOG, cat.slug, 'index.html'), 'utf8');
  } catch {
    console.warn(`hub faltante: blog/${cat.slug}/index.html`);
    continue;
  }
  const cardRe = /<article class="blog-card">([\s\S]*?)<\/article>/g;
  let m;
  while ((m = cardRe.exec(html))) {
    const block = m[1];
    const slug = block.match(/href="\.\.\/([a-z0-9-]+\.html)"/i)?.[1];
    if (!slug || seen.has(slug)) continue;
    const title = stripTags(block.match(/<h2>\s*<a[^>]*>([\s\S]*?)<\/a>\s*<\/h2>/i)?.[1]);
    const blurb = stripTags(block.match(/<div class="blog-card__body">[\s\S]*?<p>([\s\S]*?)<\/p>/i)?.[1]);
    if (!title) continue;
    seen.add(slug);
    posts.push({ u: slug, t: title, d: blurb, c: cat.slug, dt: publishedDate(slug) });
  }
}

posts.sort((a, b) => b.dt.localeCompare(a.dt) || a.u.localeCompare(b.u));

const out = `/* AUTO-GENERADO por scripts/build-blog-data.js — no editar a mano. */\n`
  + `window.CAP_POSTS = ${JSON.stringify(posts)};\n`;
writeFileSync(join(BLOG, 'posts-data.js'), out);

const byCat = posts.reduce((acc, p) => (acc[p.c] = (acc[p.c] || 0) + 1, acc), {});
console.log(`Wrote blog/posts-data.js with ${posts.length} posts`, byCat);
