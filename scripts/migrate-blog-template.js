/*
 * Migración one-off: aplica el template nuevo del blog (hero ilustrado por
 * categoría + layout con sidebar/TOC/CTA + bloque de destacados + scripts +
 * fecha "Actualizado" debajo del subtítulo) a todos los posts.
 *
 * Uso:
 *   node scripts/migrate-blog-template.js          # dry-run (reporta, no escribe)
 *   node scripts/migrate-blog-template.js --apply   # aplica y escribe
 *
 * Idempotente: saltea posts ya migrados. Solo escribe un archivo si el
 * resultado pasa todos los checks (divs/svgs balanceados + markers presentes).
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BLOG = 'blog';
const APPLY = process.argv.includes('--apply');

const manifest = JSON.parse(readFileSync(join(BLOG, 'posts-data.js'), 'utf8').match(/=\s*(\[[\s\S]*\]);/)[1]);
const catBySlug = {};
manifest.forEach(p => { catBySlug[p.u] = p.c; });

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
function fmtDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  if (!m) return null;
  return `${+m[3]} de ${MONTHS[+m[2] - 1]}, ${m[1]}`;
}

const ICON = {
  guias: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  envios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h11v12"/><path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-2"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/></svg>',
  woocommerce: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  comparativas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
};

const ART = {
  guias: `<svg viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
                <defs>
                    <linearGradient id="phGuA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
                    <linearGradient id="phGuB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#2563eb"/></linearGradient>
                </defs>
                <ellipse cx="180" cy="152" rx="152" ry="120" fill="url(#phGuA)" opacity="0.12"/>
                <rect x="64" y="56" width="172" height="200" rx="16" fill="#111f3a" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
                <rect x="86" y="80" width="96" height="12" rx="6" fill="url(#phGuA)"/>
                <g stroke-linecap="round" stroke-linejoin="round">
                    <rect x="86" y="114" width="22" height="22" rx="7" fill="rgba(59,130,246,0.18)" stroke="#60a5fa" stroke-width="1.5"/>
                    <path d="M91 125 l4 4 l7 -8" stroke="#60a5fa" stroke-width="2" fill="none"/>
                    <rect x="118" y="119" width="96" height="10" rx="5" fill="rgba(255,255,255,0.16)"/>
                    <rect x="86" y="148" width="22" height="22" rx="7" fill="rgba(59,130,246,0.18)" stroke="#60a5fa" stroke-width="1.5"/>
                    <path d="M91 159 l4 4 l7 -8" stroke="#60a5fa" stroke-width="2" fill="none"/>
                    <rect x="118" y="153" width="80" height="10" rx="5" fill="rgba(255,255,255,0.16)"/>
                    <rect x="86" y="182" width="22" height="22" rx="7" fill="rgba(34,211,238,0.16)" stroke="#22d3ee" stroke-width="1.5"/>
                    <path d="M91 193 l4 4 l7 -8" stroke="#22d3ee" stroke-width="2" fill="none"/>
                    <rect x="118" y="187" width="90" height="10" rx="5" fill="rgba(255,255,255,0.16)"/>
                    <rect x="86" y="216" width="22" height="22" rx="7" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
                    <rect x="118" y="221" width="68" height="10" rx="5" fill="rgba(255,255,255,0.1)"/>
                </g>
                <g transform="translate(212 40)">
                    <rect x="0" y="14" width="86" height="70" rx="10" fill="url(#phGuB)"/>
                    <path d="M0 34 h86" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
                    <path d="M43 14 v70" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                    <circle cx="70" cy="18" r="16" fill="#0b1120"/>
                    <circle cx="70" cy="18" r="16" fill="url(#phGuA)" opacity="0.25"/>
                    <path d="M62 18 l5 5 l10 -11" stroke="#22d3ee" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
            </svg>`,
  envios: `<svg viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
                <defs>
                    <linearGradient id="phEnA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient>
                    <linearGradient id="phEnB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#0369a1"/></linearGradient>
                </defs>
                <ellipse cx="180" cy="160" rx="152" ry="118" fill="url(#phEnA)" opacity="0.12"/>
                <path d="M40 210 h280" stroke="rgba(255,255,255,0.12)" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round"/>
                <rect x="70" y="120" width="120" height="80" rx="10" fill="#132542" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
                <rect x="86" y="140" width="60" height="10" rx="5" fill="rgba(255,255,255,0.16)"/>
                <rect x="86" y="160" width="40" height="10" rx="5" fill="rgba(255,255,255,0.12)"/>
                <path d="M190 150 h40 l24 26 v24 h-64 z" fill="url(#phEnB)"/>
                <rect x="198" y="156" width="26" height="20" rx="4" fill="#0b1120" opacity="0.5"/>
                <circle cx="108" cy="204" r="16" fill="#0b1120" stroke="url(#phEnA)" stroke-width="3"/>
                <circle cx="220" cy="204" r="16" fill="#0b1120" stroke="url(#phEnA)" stroke-width="3"/>
                <circle cx="108" cy="204" r="4" fill="url(#phEnA)"/>
                <circle cx="220" cy="204" r="4" fill="url(#phEnA)"/>
                <path d="M40 138 h26 M32 160 h34 M44 182 h22" stroke="url(#phEnA)" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
                <g transform="translate(250 52)">
                    <circle cx="20" cy="20" r="20" fill="#0b1120"/>
                    <circle cx="20" cy="20" r="20" fill="url(#phEnA)" opacity="0.22"/>
                    <path d="M20 10 a8 8 0 0 1 8 8 c0 6 -8 14 -8 14 c0 0 -8 -8 -8 -14 a8 8 0 0 1 8 -8z" fill="none" stroke="#22d3ee" stroke-width="2"/>
                    <circle cx="20" cy="18" r="3" fill="#22d3ee"/>
                </g>
            </svg>`,
  woocommerce: `<svg viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
                <defs>
                    <linearGradient id="phWcA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a855f7"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient>
                    <linearGradient id="phWcB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#6d28d9"/></linearGradient>
                </defs>
                <ellipse cx="180" cy="158" rx="150" ry="116" fill="url(#phWcA)" opacity="0.12"/>
                <path d="M64 88 h22 l8 20" fill="none" stroke="url(#phWcA)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M94 108 h150 l-16 74 h-118 z" fill="#1a1636" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
                <rect x="120" y="118" width="60" height="50" rx="8" fill="url(#phWcB)"/>
                <path d="M120 138 h60" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <path d="M150 118 v50" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <circle cx="120" cy="206" r="13" fill="#0b1120" stroke="url(#phWcA)" stroke-width="3"/>
                <circle cx="212" cy="206" r="13" fill="#0b1120" stroke="url(#phWcA)" stroke-width="3"/>
                <g transform="translate(228 58)">
                    <path d="M4 4 h30 a6 6 0 0 1 6 6 v20 a6 6 0 0 1 -1.8 4.2 l-18 18 a6 6 0 0 1 -8.4 0 l-20 -20 a6 6 0 0 1 0 -8.4 l16 -16 A6 6 0 0 1 4 4z" fill="url(#phWcA)" opacity="0.9"/>
                    <circle cx="16" cy="16" r="5" fill="#0b1120"/>
                </g>
            </svg>`,
  comparativas: `<svg viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
                <defs>
                    <linearGradient id="phCpA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2dd4bf"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
                </defs>
                <ellipse cx="180" cy="158" rx="150" ry="116" fill="url(#phCpA)" opacity="0.12"/>
                <rect x="52" y="80" width="104" height="150" rx="14" fill="#0f2230" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
                <rect x="70" y="100" width="50" height="10" rx="5" fill="rgba(255,255,255,0.18)"/>
                <rect x="70" y="150" width="68" height="12" rx="6" fill="url(#phCpA)"/>
                <rect x="70" y="172" width="52" height="8" rx="4" fill="rgba(255,255,255,0.12)"/>
                <rect x="70" y="188" width="60" height="8" rx="4" fill="rgba(255,255,255,0.12)"/>
                <rect x="204" y="80" width="104" height="150" rx="14" fill="#0f2230" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
                <rect x="222" y="100" width="50" height="10" rx="5" fill="rgba(255,255,255,0.18)"/>
                <rect x="222" y="150" width="48" height="12" rx="6" fill="rgba(255,255,255,0.22)"/>
                <rect x="222" y="172" width="60" height="8" rx="4" fill="rgba(255,255,255,0.12)"/>
                <rect x="222" y="188" width="44" height="8" rx="4" fill="rgba(255,255,255,0.12)"/>
                <circle cx="180" cy="155" r="26" fill="#0b1120" stroke="url(#phCpA)" stroke-width="2.5"/>
                <text x="180" y="162" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="18" font-weight="800" fill="#2dd4bf">VS</text>
            </svg>`,
};

const SIDEBAR_CTA = `            <div class="blog-cta-card">
                <p class="blog-cta-card__eyebrow">Correo Argentino Pro</p>
                <h3>Automatizá tus envíos en WooCommerce</h3>
                <p>Cotización en el checkout, etiquetas y seguimiento automáticos. Dejá de cargar cada envío a mano en MiCorreo.</p>
                <a href="/#precio" class="blog-cta-card__btn">Probar gratis 15 días &rarr;</a>
                <span class="blog-cta-card__note">Desde $62.990/año</span>
            </div>`;

const RELATED = `<section class="blog-related">
    <div class="container">
        <div class="blog-related__head">
            <h2 class="blog-related__title">Seguí leyendo</h2>
            <p class="blog-related__sub">Más artículos para dominar tus envíos con Correo Argentino.</p>
        </div>
        <div class="blog-grid" id="cap-related"></div>
    </div>
</section>

`;

const SCRIPTS = `<script src="posts-data.js" defer></script>
<script src="blog-related.js" defer></script>

`;

function balanced(s, open, close) {
  return (s.match(open) || []).length === (s.match(close) || []).length;
}

function migrate(file) {
  let s = readFileSync(join(BLOG, file), 'utf8');
  if (/post-hero--|blog-layout/.test(s)) return { file, status: 'skip (ya migrado)' };
  const cat = catBySlug[file];
  if (!cat || !ART[cat]) return { file, status: `skip (categoría desconocida: ${cat})` };

  const mod = (s.match(/article:modified_time"\s+content="([^"]+)"/) || [])[1];
  const pub = (s.match(/article:published_time"\s+content="([^"]+)"/) || [])[1];
  const dateStr = fmtDate(mod || pub);

  const before = s;

  // 1. quitar TOC inline (si el pass SEO lo agregó)
  s = s.replace(/\s*<nav class="blog-toc"[\s\S]*?<\/nav>/g, '');

  // 2. clase del header
  s = s.replace('<header class="page-header">', `<header class="page-header post-hero post-hero--${cat}">`);

  // 3. reestructurar el hero
  s = s.replace(/<div class="page-header__body">([\s\S]*?)<\/div>/, (m, inner) => {
    const bc = (inner.match(/<p class="page-header__breadcrumb">[\s\S]*?<\/p>/) || [''])[0];
    const h1 = (inner.match(/<h1>[\s\S]*?<\/h1>/) || [''])[0];
    const ps = inner.match(/<p(?![^>]*breadcrumb)[^>]*>[\s\S]*?<\/p>/g) || [];
    let subText = ps.length ? ps[ps.length - 1].replace(/^<p[^>]*>/, '').replace(/<\/p>$/, '') : '';
    subText = subText.replace(/\s*&middot;\s*(Actualizado\s+)?\d{1,2}\s+de\s+[a-záéíóúñ]+,?\s+\d{4}/gi, '').trim();
    const badge = `<span class="post-hero__badge">${ICON[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>`;
    const label = { guias: 'Guías', envios: 'Envíos', woocommerce: 'WooCommerce', comparativas: 'Comparativas' }[cat];
    const badge2 = `<span class="post-hero__badge">${ICON[cat]} ${label}</span>`;
    const metaP = subText ? `<p class="post-hero__meta">${subText}</p>` : '';
    const dateP = dateStr ? `<p class="post-hero__date">Actualizado ${dateStr}</p>` : '';
    return `<div class="page-header__body post-hero__body">
        <div class="post-hero__text">
            ${bc}
            ${badge2}
            ${h1}
            ${metaP}
            ${dateP}
        </div>
        <div class="post-hero__art" aria-hidden="true">
            ${ART[cat]}
        </div>
    </div>`;
  });

  // 4. clases del layout
  s = s.replace(/<div class="container">(\s*)<div class="legal__content">/, '<div class="container blog-layout">$1<div class="blog-main legal__content">');

  // 5. sidebar antes del cierre del container
  s = s.replace(/<\/div>(\s*)<\/div>(\s*)<\/article>/, `</div>

        <aside class="blog-sidebar">
            <nav class="blog-toc" aria-label="Contenido del artículo"></nav>
${SIDEBAR_CTA}
        </aside>
    </div>
</article>`);

  // 6. destacados antes del footer
  s = s.replace('<footer class="footer">', RELATED + '<footer class="footer">');

  // 7. scripts antes de </body>
  s = s.replace('</body>', SCRIPTS + '</body>');

  // checks de seguridad
  const checks = {
    heroClass: s.includes(`post-hero--${cat}`),
    heroBody: s.includes('post-hero__body'),
    art: s.includes('post-hero__art'),
    main: s.includes('blog-main legal__content'),
    layout: s.includes('container blog-layout'),
    sidebar: s.includes('blog-sidebar'),
    related: s.includes('id="cap-related"'),
    scripts: s.includes('posts-data.js') && s.includes('blog-related.js'),
    changed: s !== before,
    divBalance: balanced(s, /<div\b/g, /<\/div>/g),
    svgBalance: balanced(s, /<svg\b/g, /<\/svg>/g),
    navBalance: balanced(s, /<nav\b/g, /<\/nav>/g),
  };
  const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
  if (failed.length) return { file, status: 'ERROR', failed };

  if (APPLY) writeFileSync(join(BLOG, file), s);
  return { file, status: APPLY ? 'migrado' : 'ok (dry-run)', cat, date: dateStr };
}

const skip = new Set(['index.html']);
const files = readdirSync(BLOG).filter(f => f.endsWith('.html') && !skip.has(f));

const results = files.map(migrate);
const byStatus = {};
results.forEach(r => { const k = r.status.split(' ')[0]; byStatus[k] = (byStatus[k] || 0) + 1; });

console.log(APPLY ? '=== APPLY ===' : '=== DRY-RUN (usar --apply para escribir) ===');
console.log('resumen:', byStatus, '\n');
const errors = results.filter(r => r.status === 'ERROR');
if (errors.length) {
  console.log('ERRORES (' + errors.length + '):');
  errors.forEach(r => console.log('  ✗', r.file, '->', r.failed.join(',')));
}
const migrated = results.filter(r => r.status.startsWith('ok') || r.status === 'migrado');
console.log('\na migrar (' + migrated.length + '):');
migrated.forEach(r => console.log('  ·', r.cat.padEnd(12), r.date || '—', r.file));
