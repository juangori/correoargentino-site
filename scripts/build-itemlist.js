#!/usr/bin/env node
/**
 * build-itemlist.js
 *
 * Inyecta un JSON-LD `ItemList` en el índice del blog y en los hubs de
 * categoría, listando los artículos que cada página muestra (en su orden real).
 *
 * Para qué: le da a buscadores y LLMs el índice explícito del corpus, en vez de
 * obligarlos a inferirlo del HTML. Habilita además tratamiento de lista/carrusel.
 *
 * Idempotente: reemplaza el bloque entre marcadores si ya existe.
 * Uso: node scripts/build-itemlist.js  |  DRY=1 node scripts/build-itemlist.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SITE = 'https://correoargentinopro.com';
const DRY = !!process.env.DRY;

const START = '<!-- itemlist:start — generado por scripts/build-itemlist.js (no editar a mano) -->';
const END = '<!-- itemlist:end -->';

const PAGES = [
  { file: 'blog/index.html',               name: 'Todos los artículos del blog' },
  { file: 'blog/envios/index.html',        name: 'Artículos sobre envíos con Correo Argentino' },
  { file: 'blog/guias/index.html',         name: 'Guías prácticas de Correo Argentino' },
  { file: 'blog/woocommerce/index.html',   name: 'Artículos sobre WooCommerce' },
  { file: 'blog/comparativas/index.html',  name: 'Comparativas de correos y plataformas' },
];

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&rarr;/g, '→')
  .replace(/&middot;/g, '·').replace(/&iquest;/g, '¿').replace(/&oacute;/g, 'ó')
  .replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&iacute;/g, 'í')
  .replace(/&uacute;/g, 'ú').replace(/&ntilde;/g, 'ñ').replace(/&nbsp;/g, ' ');

/** Extrae los artículos listados (título + url) en el orden en que aparecen. */
function extractPosts(html, pageDir) {
  const posts = [];
  const seen = new Set();
  // cada card: <h2><a href="…">Título</a></h2> dentro de .blog-card
  const re = /<article class="blog-card"[^>]*>[\s\S]*?<h2><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/h2>/g;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1].trim();
    const title = decode(m[2].replace(/<[^>]+>/g, '')).trim();
    // resolver relativo respecto del directorio de la página
    let url;
    if (/^https?:/i.test(href)) url = href;
    else if (href.startsWith('/')) url = SITE + href;
    else url = new URL(href, `${SITE}/${pageDir}/`).toString();
    if (seen.has(url)) continue;
    seen.add(url);
    posts.push({ url, title });
  }
  return posts;
}

function buildSchema(name, pageUrl, posts) {
  const node = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: pageUrl,
    numberOfItems: posts.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: p.url,
      name: p.title,
    })),
  };
  const json = JSON.stringify(node, null, 4).split('\n').map(l => '    ' + l).join('\n');
  return `    <script type="application/ld+json">\n${json}\n    </script>`;
}

let done = 0;
for (const { file, name } of PAGES) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) { console.log(`  falta ${file}`); continue; }
  let src = fs.readFileSync(abs, 'utf8');

  const pageDir = path.dirname(file);                       // blog | blog/envios | …
  const canonical = (src.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || `${SITE}/${pageDir}/`;
  const posts = extractPosts(src, pageDir);
  if (!posts.length) { console.log(`  ${file}: no se encontraron artículos`); continue; }

  const schema = buildSchema(name, canonical, posts);

  if (src.includes(START)) {
    const s = src.indexOf(START), e = src.indexOf(END);
    src = src.slice(0, s + START.length) + '\n' + schema + '\n    ' + src.slice(e);
  } else {
    // insertar antes del cierre de </head>
    src = src.replace(/(\n?)<\/head>/, `\n    ${START}\n${schema}\n    ${END}\n</head>`);
  }

  if (DRY) { console.log(`  [DRY] ${file} — ${posts.length} artículos`); continue; }
  fs.writeFileSync(abs, src, 'utf8');
  console.log(`  ${file} — ItemList con ${posts.length} artículos`);
  done++;
}
console.log(`${DRY ? '[DRY] ' : ''}Páginas con ItemList: ${done}`);
