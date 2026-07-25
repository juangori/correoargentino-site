#!/usr/bin/env node
/**
 * replace-footer.js
 * Reemplaza el <footer class="footer">…</footer> simple por el nuevo footer
 * multi-columna <footer class="site-footer">…</footer> en todas las páginas.
 * Links absolutos -> el bloque es idéntico en cualquier profundidad.
 * Idempotente (sólo matchea class="footer"). Salta admin.html.
 * Uso: node scripts/replace-footer.js   |   DRY=1 node scripts/replace-footer.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DRY = !!process.env.DRY;

const EXCLUDE_DIRS = new Set(['node_modules', 'scripts', '.git', '.wrangler', 'assets', 'og', 'fonts']);
const EXCLUDE_FILES = new Set(['admin.html']);

const NEW_FOOTER = `<footer class="site-footer">
    <div class="container">
        <div class="site-footer__grid">
            <div class="site-footer__brand">
                <a href="/" class="site-footer__logo">
                    <svg width="34" height="34" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="fEnv" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>
                            <linearGradient id="fPro" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient>
                        </defs>
                        <rect x="6" y="18" width="56" height="40" rx="8" fill="white" opacity="0.95"/>
                        <path d="M6 24 L34 44 L62 24" stroke="url(#fEnv)" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="40" y="44" width="36" height="20" rx="7" fill="url(#fPro)"/>
                        <text x="58" y="58.5" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="12.5" font-weight="800" fill="white" letter-spacing="2.5">PRO</text>
                    </svg>
                    <span>Correo Argentino <strong>Pro</strong></span>
                </a>
                <p class="site-footer__tagline">Integrá Correo Argentino con WooCommerce: cotización en tiempo real, sucursales con mapa, etiquetas y tracking automático.</p>
                <p class="site-footer__dev">Desarrollado por <a href="https://adwebs.com.ar">AD Webs</a></p>
            </div>
            <nav class="site-footer__col" aria-label="Producto">
                <p class="site-footer__heading">Producto</p>
                <ul>
                    <li><a href="/plugin/">El plugin</a></li>
                    <li><a href="/plugin/#precio">Precios y licencia</a></li>
                    <li><a href="/#cotizador">Cotizador de envíos</a></li>
                    <li><a href="/log-de-actualizaciones-plugin.html">Novedades del plugin</a></li>
                </ul>
            </nav>
            <nav class="site-footer__col" aria-label="Recursos">
                <p class="site-footer__heading">Recursos</p>
                <ul>
                    <li><a href="/blog/">Blog</a></li>
                    <li><a href="/ayuda.html">Centro de ayuda</a></li>
                    <li><a href="/faqs.html">Preguntas frecuentes</a></li>
                    <li><a href="/contacto.html">Contacto</a></li>
                </ul>
            </nav>
            <nav class="site-footer__col" aria-label="Empresa">
                <p class="site-footer__heading">Empresa</p>
                <ul>
                    <li><a href="/blog/autor/ad-webs.html">Sobre nosotros</a></li>
                    <li><a href="/terminos.html">Términos y condiciones</a></li>
                    <li><a href="/privacidad.html">Política de privacidad</a></li>
                </ul>
            </nav>
        </div>
        <div class="site-footer__bottom">
            <div class="site-footer__pay">
                <span class="site-footer__pay-label">Pago seguro con</span>
                <span class="pay-badge pay-badge--mp">Mercado Pago</span>
                <span class="pay-badge pay-badge--visa">VISA</span>
                <span class="pay-badge pay-badge--mc" aria-label="Mastercard"><svg width="26" height="16" viewBox="0 0 26 16" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="8" r="6" fill="#eb001b"/><circle cx="16" cy="8" r="6" fill="#f79e1b" fill-opacity="0.9"/></svg></span>
                <span class="pay-badge pay-badge--amex">AMEX</span>
            </div>
            <p class="site-footer__copy">&copy; 2026 Correo Argentino Pro &middot; No estamos afiliados a Correo Argentino S.A.</p>
        </div>
    </div>
</footer>`;

const FOOTER_RE = /<footer class="footer">[\s\S]*?<\/footer>/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) { if (!EXCLUDE_DIRS.has(e.name)) walk(path.join(dir, e.name), out); }
    else if (e.isFile() && e.name.endsWith('.html') && !EXCLUDE_FILES.has(e.name)) out.push(path.join(dir, e.name));
  }
  return out;
}

let changed = 0, already = 0, nofooter = 0;
for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, 'utf8');
  if (src.includes('class="site-footer"')) { already++; continue; }
  if (!FOOTER_RE.test(src)) { nofooter++; continue; }
  const out = src.replace(FOOTER_RE, NEW_FOOTER);
  if (!DRY) fs.writeFileSync(file, out, 'utf8');
  changed++;
}
console.log(`${DRY ? '[DRY] ' : ''}Footer reemplazado: ${changed} · ya nuevo: ${already} · sin footer: ${nofooter}`);
