#!/usr/bin/env node
/**
 * build-reviews.js
 *
 * Baja las reseñas aprobadas de la API y las escribe como HTML estático +
 * JSON-LD (AggregateRating + Review[]) en la home y en /plugin/.
 *
 * Por qué: las reseñas se cargaban sólo por fetch client-side, así que los
 * crawlers de IA y buscadores (que no ejecutan JS) no veían ni una palabra de
 * la prueba social. Ahora el HTML lleva las reseñas y el fetch queda como
 * progressive enhancement.
 *
 * Volvé a correrlo cuando aprobés reseñas nuevas:
 *   node scripts/build-reviews.js
 *   DRY=1 node scripts/build-reviews.js   (muestra el resultado, no escribe)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const API = 'https://api.correoargentinopro.com/reviews';
const DRY = !!process.env.DRY;

const TARGETS = [
  { file: path.join(ROOT, 'index.html'), id: 'https://correoargentinopro.com/#software' },
  { file: path.join(ROOT, 'plugin', 'index.html'), id: 'https://correoargentinopro.com/plugin/#software' },
];

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const stars = (n) => '&#9733;'.repeat(n) + '&#9734;'.repeat(Math.max(0, 5 - n));

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function buildHtml(data) {
  const plural = data.count !== 1 ? 's' : '';
  const items = data.reviews.map(r => `            <div class="review-item">
                <div class="review-item__stars" aria-label="${r.rating} de 5 estrellas">${stars(r.rating)}</div>
                <div class="review-item__comment">${esc(r.comment)}</div>
                <div class="review-item__author">
                    <div class="review-item__avatar" aria-hidden="true">${esc(initials(r.name))}</div>
                    <div>
                        <div class="review-item__name">${esc(r.name)}</div>${r.website ? `
                        <div class="review-item__site">${esc(r.website)}</div>` : ''}
                    </div>
                </div>
            </div>`).join('\n');

  return `        <div class="reviews__summary" id="reviews-summary">
            <div class="reviews__stars" id="reviews-stars">${stars(Math.floor(data.average))}</div>
            <div class="reviews__avg" id="reviews-avg">${String(data.average).replace('.', ',')} de 5 &middot; ${data.count} reseña${plural}</div>
        </div>
        <div class="reviews__grid" id="reviews-grid">
${items}
        </div>`;
}

function buildSchema(data, id) {
  const node = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': id,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(data.average),
      bestRating: '5',
      worstRating: '1',
      ratingCount: String(data.count),
      reviewCount: String(data.reviews.length),
    },
    review: data.reviews.map(r => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5', worstRating: '1' },
      author: { '@type': 'Person', name: r.name },
      datePublished: String(r.created_at).slice(0, 10),
      reviewBody: r.comment,
    })),
  };
  const json = JSON.stringify(node, null, 4).split('\n').map(l => '    ' + l).join('\n');
  return `    <script type="application/ld+json">\n${json}\n    </script>`;
}

function replaceBetween(src, startMark, endMark, payload) {
  const s = src.indexOf(startMark);
  const e = src.indexOf(endMark);
  if (s === -1 || e === -1) return null;
  return src.slice(0, s + startMark.length) + '\n' + payload + '\n        ' + src.slice(e);
}

const res = await fetch(API);
if (!res.ok) { console.error(`API respondió ${res.status}`); process.exit(1); }
const data = await res.json();
if (!data.reviews?.length) { console.error('La API no devolvió reseñas.'); process.exit(1); }

console.log(`Reseñas obtenidas: ${data.reviews.length} · promedio ${data.average} · count ${data.count}`);

const html = buildHtml(data);
for (const { file, id } of TARGETS) {
  let src = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);

  let out = replaceBetween(src, '<!-- reviews:start — bloque generado por scripts/build-reviews.js (no editar a mano) -->', '<!-- reviews:end -->', html);
  if (!out) { console.error(`  ${rel}: faltan los marcadores reviews:start/end`); continue; }

  const schema = buildSchema(data, id);
  out = replaceBetween(out, '<!-- reviews-schema:start — generado por scripts/build-reviews.js (no editar a mano) -->', '<!-- reviews-schema:end -->', schema)
     || out;

  // el marcador de schema vive con indentación de 4, no de 8
  out = out.replace(/\n {8}<!-- reviews-schema:end -->/, '\n    <!-- reviews-schema:end -->');

  if (DRY) { console.log(`  [DRY] ${rel} — se actualizaría`); continue; }
  fs.writeFileSync(file, out, 'utf8');
  console.log(`  ${rel} — actualizado`);
}
