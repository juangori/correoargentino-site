#!/usr/bin/env node
/**
 * build-md-mirrors.js
 *
 * Genera el espejo Markdown (.md) de los posts del blog que no lo tengan.
 * llms.txt promete que cada página tiene su espejo agregando `.md` a la URL;
 * este script cierra esa promesa para los posts que faltaban.
 *
 * - NO sobreescribe los .md existentes (varios están escritos a mano).
 *   Usá FORCE=1 para regenerarlos igual.
 * - Convierte el cuerpo del artículo (`.blog-main.legal__content`) a Markdown:
 *   h2/h3, párrafos, listas, tablas, links (absolutizados), strong/em, code.
 * - Descarta los CTA inline (`div.blog-cta`) y el sidebar.
 *
 * Uso: node scripts/build-md-mirrors.js       (genera los faltantes)
 *      DRY=1 node scripts/build-md-mirrors.js  (sólo reporta)
 *      FORCE=1 node scripts/build-md-mirrors.js (regenera todos)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');
const SITE = 'https://correoargentinopro.com';
const DRY = !!process.env.DRY;
const FORCE = !!process.env.FORCE;

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#39;': "'", '&apos;': "'", '&rarr;': '→', '&larr;': '←', '&middot;': '·',
  '&mdash;': '—', '&ndash;': '–', '&hellip;': '…', '&copy;': '©', '&reg;': '®',
  '&deg;': '°', '&times;': '×', '&plusmn;': '±', '&euro;': '€', '&laquo;': '«',
  '&raquo;': '»', '&ldquo;': '“', '&rdquo;': '”', '&lsquo;': '‘', '&rsquo;': '’',
  '&aacute;': 'á', '&eacute;': 'é', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú',
  '&ntilde;': 'ñ', '&uuml;': 'ü', '&Aacute;': 'Á', '&Eacute;': 'É', '&Iacute;': 'Í',
  '&Oacute;': 'Ó', '&Uacute;': 'Ú', '&Ntilde;': 'Ñ', '&iquest;': '¿', '&iexcl;': '¡',
  '&check;': '✓', '&cross;': '✕', '&bull;': '•', '&dagger;': '†', '&sup2;': '²', '&sup3;': '³',
};

function decode(s) {
  let out = s;
  for (const [k, v] of Object.entries(ENTITIES)) out = out.split(k).join(v);
  // numéricas: &#8594; / &#x2192;
  out = out.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
  out = out.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
  return out;
}

/** Resuelve un href relativo (desde /blog/) a URL absoluta del sitio. */
function absolutize(href) {
  const h = href.trim();
  if (/^(https?:|mailto:|tel:)/i.test(h)) return h;
  if (h.startsWith('#')) return h;                       // ancla interna: se deja
  if (h.startsWith('/')) return SITE + h;                // root-absoluta
  if (h.startsWith('../')) return SITE + '/' + h.replace(/^\.\.\//, '');
  if (h === './' || h === '') return `${SITE}/blog/`;
  return `${SITE}/blog/${h.replace(/^\.\//, '')}`;       // relativa dentro de /blog/
}

/** Convierte HTML inline (strong, em, a, code, br, span) a Markdown. */
function inline(html) {
  let s = html;
  s = s.replace(/<br\s*\/?>/gi, ' ');
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, t) => '`' + strip(t).trim() + '`');
  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => {
    const inner = inline(t).trim();
    return inner ? `**${inner}**` : '';
  });
  s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => {
    const inner = inline(t).trim();
    return inner ? `*${inner}*` : '';
  });
  s = s.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, t) => {
    const text = inline(t).trim();
    if (!text) return '';
    return `[${text}](${absolutize(href)})`;
  });
  s = s.replace(/<\/?span[^>]*>/gi, '');
  s = s.replace(/<img\s+[^>]*>/gi, '');                  // imágenes decorativas: fuera
  return collapse(decode(strip(s)));
}

function strip(html) { return html.replace(/<[^>]+>/g, ''); }
function collapse(s) { return s.replace(/[ \t ]+/g, ' ').replace(/ +([.,;:!?])/g, '$1').trim(); }

/** Convierte una <table> a tabla Markdown. */
function tableToMd(tableHtml) {
  const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m => {
    const cells = [...m[1].matchAll(/<(th|td)[^>]*>([\s\S]*?)<\/\1>/gi)]
      .map(c => inline(c[2]).replace(/\|/g, '\\|'));
    return cells;
  }).filter(r => r.length);
  if (!rows.length) return '';
  const width = Math.max(...rows.map(r => r.length));
  const pad = (r) => { const c = r.slice(); while (c.length < width) c.push(''); return c; };
  const isHeader = /<th[^>]*>/i.test(tableHtml);
  const head = isHeader ? pad(rows[0]) : Array(width).fill('');
  const body = isHeader ? rows.slice(1) : rows;
  const lines = [
    '| ' + head.join(' | ') + ' |',
    '| ' + Array(width).fill('---').join(' | ') + ' |',
    ...body.map(r => '| ' + pad(r).join(' | ') + ' |'),
  ];
  return lines.join('\n');
}

/** Convierte una lista (ul/ol) a Markdown. */
function listToMd(listHtml, ordered) {
  // sólo los <li> de primer nivel
  const items = [];
  let depth = 0, buf = '', i = 0;
  const re = /<(\/?)(li|ul|ol)[^>]*>/gi;
  let m, last = 0;
  while ((m = re.exec(listHtml))) {
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    if (tag === 'li') {
      if (!closing) { if (depth === 0) { last = m.index + m[0].length; } depth++; }
      else { depth--; if (depth === 0) items.push(listHtml.slice(last, m.index)); }
    }
  }
  return items.map((raw, idx) => {
    // sub-listas anidadas: se aplanan con indentación
    let sub = '';
    const subMatch = raw.match(/<(ul|ol)[^>]*>[\s\S]*<\/\1>/i);
    let main = raw;
    if (subMatch) {
      main = raw.replace(subMatch[0], '');
      sub = '\n' + listToMd(subMatch[0], /^<ol/i.test(subMatch[0]))
        .split('\n').map(l => '  ' + l).join('\n');
    }
    const text = inline(main);
    const bullet = ordered ? `${idx + 1}.` : '-';
    return text ? `${bullet} ${text}${sub}` : '';
  }).filter(Boolean).join('\n');
}

/** Convierte el cuerpo del artículo a Markdown recorriendo los bloques top-level. */
function bodyToMd(html) {
  let s = html;
  // fuera CTAs inline y cualquier bloque no editorial
  s = s.replace(/<div class="blog-cta"[\s\S]*?<\/div>\s*<\/div>|<div class="blog-cta"[\s\S]*?<\/div>/gi, '');
  s = s.replace(/<!--[\s\S]*?-->/g, '');

  const out = [];
  const blockRe = /<(h2|h3|p|ul|ol|table)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = blockRe.exec(s))) {
    const tag = m[1].toLowerCase();
    const inner = m[2];
    const whole = m[0];
    if (tag === 'h2') { const t = inline(inner); if (t) out.push(`## ${t}`); }
    else if (tag === 'h3') { const t = inline(inner); if (t) out.push(`### ${t}`); }
    else if (tag === 'p') { const t = inline(inner); if (t) out.push(t); }
    else if (tag === 'ul') { const t = listToMd(whole, false); if (t) out.push(t); }
    else if (tag === 'ol') { const t = listToMd(whole, true); if (t) out.push(t); }
    else if (tag === 'table') { const t = tableToMd(whole); if (t) out.push(t); }
  }
  return out.join('\n\n');
}

function convert(file) {
  const html = fs.readFileSync(file, 'utf8');
  const slug = path.basename(file, '.html');

  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = h1 ? inline(h1[1]) : slug;

  const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1]
    || `${SITE}/blog/${slug}.html`;

  const desc = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1];

  // cuerpo: desde .blog-main hasta el <aside> del sidebar
  const start = html.search(/<div class="blog-main legal__content">/i);
  if (start === -1) return null;
  const asideAt = html.search(/<aside class="blog-sidebar">/i);
  const bodyHtml = html.slice(start, asideAt === -1 ? undefined : asideAt);

  const body = bodyToMd(bodyHtml);
  if (!body || body.length < 200) return null;

  const parts = [`> Fuente: ${canonical}`, '', `# ${title}`];
  if (desc) parts.push('', `> ${decode(desc)}`);
  parts.push('', body, '');
  return parts.join('\n');
}

const posts = fs.readdirSync(BLOG)
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => path.join(BLOG, f));

let written = 0, skipped = 0, failed = [];
for (const file of posts) {
  const mdPath = file.replace(/\.html$/, '.md');
  if (fs.existsSync(mdPath) && !FORCE) { skipped++; continue; }
  const md = convert(file);
  if (!md) { failed.push(path.basename(file)); continue; }
  if (!DRY) fs.writeFileSync(mdPath, md, 'utf8');
  written++;
}

console.log(`${DRY ? '[DRY] ' : ''}Espejos .md generados: ${written} · ya existían (intactos): ${skipped} · fallidos: ${failed.length}`);
if (failed.length) failed.forEach(f => console.log('  FALLO ' + f));
