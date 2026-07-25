#!/usr/bin/env node
/**
 * add-author-block.js
 *
 * Aplica a cada post del blog (blog/*.html, excepto index.html):
 *   1. Inyecta el bloque de autor (.blog-author-card) al final del sidebar,
 *      justo antes de </aside>.
 *   2. Actualiza el JSON-LD del autor: url -> página de autor on-site,
 *      y agrega sameAs -> adwebs.com.ar (E-E-A-T "lo mejor de ambos mundos").
 *   3. Repunta el CTA del sidebar (/#precio -> /plugin) hacia la landing optimizada.
 *
 * Idempotente: salta los archivos que ya tienen .blog-author-card.
 * Uso:  node scripts/add-author-block.js        (aplica)
 *       DRY=1 node scripts/add-author-block.js   (sólo reporta, no escribe)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = !!process.env.DRY;
const BLOG_DIR = path.join(__dirname, '..', 'blog');

const AUTHOR_CARD = [
  '            <div class="blog-author-card">',
  '                <p class="blog-author-card__eyebrow">Escrito por</p>',
  '                <div class="blog-author-card__head">',
  '                    <span class="blog-author-card__avatar" aria-hidden="true">AD</span>',
  '                    <div>',
  '                        <p class="blog-author-card__name">AD Webs</p>',
  '                        <p class="blog-author-card__role">Creadores de Correo Argentino Pro</p>',
  '                    </div>',
  '                </div>',
  '                <p class="blog-author-card__bio">Estudio de desarrollo especializado en e-commerce y logística para WooCommerce. Escribimos con la experiencia de integrar envíos de Correo Argentino en tiendas reales.</p>',
  '                <a href="autor/ad-webs.html" class="blog-author-card__link">Sobre el autor &rarr;</a>',
  '            </div>',
].join('\n');

// El string de la propiedad `url` del autor es idéntico en ambos formatos
// (multilínea y minificado en una sola línea), y sólo aparece en el bloque
// author. Reemplazo plano -> url on-site + sameAs a adwebs.
const AUTHOR_URL_FROM = '"url": "https://adwebs.com.ar"';
const AUTHOR_URL_TO = '"url": "https://correoargentinopro.com/blog/autor/ad-webs.html", "sameAs": ["https://adwebs.com.ar"]';
const CTA_FROM = 'href="/#precio" class="blog-cta-card__btn"';
const CTA_TO = 'href="/plugin" class="blog-cta-card__btn"';
const ASIDE_RE = /^([ \t]*)<\/aside>/m;

const files = fs.readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.html') && f !== 'index.html')
  .map((f) => path.join(BLOG_DIR, f));

let changed = 0, skipped = 0;
const warnings = [];

for (const file of files) {
  const rel = path.relative(path.join(__dirname, '..'), file);
  let src = fs.readFileSync(file, 'utf8');

  if (src.includes('blog-author-card')) { skipped++; continue; }

  const checks = {
    authorUrl: src.includes(AUTHOR_URL_FROM),
    cta: src.includes(CTA_FROM),
    aside: ASIDE_RE.test(src),
  };
  if (!checks.authorUrl || !checks.cta || !checks.aside) {
    warnings.push(`SKIP ${rel} — faltan anclajes: ${JSON.stringify(checks)}`);
    continue;
  }

  let out = src;

  // 1. JSON-LD author: url on-site + sameAs
  out = out.replace(AUTHOR_URL_FROM, AUTHOR_URL_TO);

  // 2. Repuntar CTA del sidebar a /plugin
  out = out.replace(CTA_FROM, CTA_TO);

  // 3. Inyectar author card antes de </aside>
  out = out.replace(ASIDE_RE, (m, indent) => `${AUTHOR_CARD}\n${indent}</aside>`);

  if (out === src) { warnings.push(`NOOP ${rel}`); continue; }

  if (!DRY) fs.writeFileSync(file, out, 'utf8');
  changed++;
}

console.log(`${DRY ? '[DRY] ' : ''}Posts modificados: ${changed} · saltados (ya tenían card): ${skipped} · total: ${files.length}`);
if (warnings.length) { console.log('Avisos:'); warnings.forEach((w) => console.log('  ' + w)); }
