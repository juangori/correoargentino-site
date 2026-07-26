#!/usr/bin/env node
/**
 * build-tarifas.js
 *
 * Genera tablas de tarifas de referencia de Correo Argentino consultando la
 * API pública de cotización del sitio (la misma que usa el cotizador), y las
 * publica como HTML estático en el post de tarifas + su espejo Markdown.
 *
 * Por qué: la página de tarifas explicaba cómo se calcula el precio pero no
 * publicaba un solo número. Los buscadores y los LLMs citan datos concretos;
 * sin cifras no hay nada que citar. Estas tablas son dato propio y verificable.
 *
 * - Respeta el rate limit de la API (30 consultas/min): 2,5 s entre requests.
 * - Guarda la matriz cruda en data/tarifas-correo-argentino.json (con fecha),
 *   así se puede re-renderizar sin volver a consultar.
 *
 * Uso:
 *   node scripts/build-tarifas.js            consulta la API y publica
 *   OFFLINE=1 node scripts/build-tarifas.js  re-renderiza desde el JSON guardado
 *   DRY=1 node scripts/build-tarifas.js      no escribe, sólo muestra
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const API = 'https://api.correoargentinopro.com/cotizar';
const DRY = !!process.env.DRY;
const OFFLINE = !!process.env.OFFLINE;

const DATA_FILE = path.join(ROOT, 'data', 'tarifas-correo-argentino.json');
const HTML_FILE = path.join(ROOT, 'blog', 'tarifas-correo-argentino-2026.html');
const MD_FILE = path.join(ROOT, 'blog', 'tarifas-correo-argentino-2026.md');

const ORIGIN = { cp: '1425', name: 'CABA' };

const DESTINATIONS = [
  { cp: '2000', name: 'Rosario (Santa Fe)' },
  { cp: '5000', name: 'Córdoba capital' },
  { cp: '7600', name: 'Mar del Plata' },
  { cp: '5500', name: 'Mendoza capital' },
  { cp: '4000', name: 'San Miguel de Tucumán' },
  { cp: '4400', name: 'Salta capital' },
  { cp: '8300', name: 'Neuquén capital' },
  { cp: '9410', name: 'Ushuaia (Tierra del Fuego)' },
];

// Cajas elegidas para que gobierne el peso real y no el volumétrico,
// así la tabla habla de peso y no de volumen. Se aclara en la nota al pie.
const WEIGHTS = [
  { kg: 1, box: { largo: 25, ancho: 20, alto: 10 } },
  { kg: 5, box: { largo: 40, ancho: 30, alto: 20 } },
  { kg: 10, box: { largo: 50, ancho: 40, alto: 30 } },
];

const THROTTLE_MS = 2500;   // 24 requests -> ~60 s, dentro de 30/min
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const fmt = (n) => '$' + Number(n).toLocaleString('es-AR', { maximumFractionDigits: 0 });

/** Toma un rate del array por servicio + modalidad. */
function pick(rates, servicio, tipo) {
  const r = (rates || []).find(x =>
    (x.nombre || '').toLowerCase().includes(servicio) &&
    (x.tipo || '').toLowerCase() === tipo
  );
  return r || null;
}

async function quote(dest, w) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': 'https://correoargentinopro.com' },
    body: JSON.stringify({ cpOrigen: ORIGIN.cp, cpDestino: dest.cp, peso: w.kg, ...w.box }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} para ${dest.cp}/${w.kg}kg`);
  const json = await res.json();
  if (!json.rates?.length) throw new Error(`sin tarifas para ${dest.cp}/${w.kg}kg`);
  return json.rates;
}

async function fetchMatrix() {
  const rows = [];
  let i = 0;
  const total = DESTINATIONS.length * WEIGHTS.length;
  for (const dest of DESTINATIONS) {
    for (const w of WEIGHTS) {
      if (i++) await sleep(THROTTLE_MS);
      process.stdout.write(`  [${i}/${total}] ${dest.name} · ${w.kg} kg … `);
      try {
        const rates = await quote(dest, w);
        rows.push({ dest: dest.name, cp: dest.cp, kg: w.kg, box: w.box, rates });
        console.log('ok');
      } catch (e) {
        console.log('FALLO: ' + e.message);
      }
    }
  }
  return rows;
}

function buildTables(data) {
  const { generatedAt, rows } = data;
  const fecha = new Date(generatedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

  // --- Agrupar destinos por tramo tarifario ---
  // Correo Argentino tarifa por zona, no por distancia exacta: varios destinos
  // comparten precio idéntico. Agrupamos para que la tabla muestre esa
  // estructura en lugar de repetir filas iguales.
  const oneKg = rows.filter(r => r.kg === 1);
  const sig = (r) => {
    const cs = pick(r.rates, 'clasico', 'sucursal');
    const cd = pick(r.rates, 'clasico', 'domicilio');
    const ed = pick(r.rates, 'expreso', 'domicilio');
    return [cs?.precio, cd?.precio, ed?.precio].join('|');
  };
  const tierMap = new Map();
  for (const r of oneKg) {
    const k = sig(r);
    if (!tierMap.has(k)) tierMap.set(k, { rates: r.rates, dests: [], key: k });
    tierMap.get(k).dests.push(r.dest);
  }
  const tiers = [...tierMap.values()].sort((a, b) =>
    (pick(a.rates, 'clasico', 'domicilio')?.precio || 0) - (pick(b.rates, 'clasico', 'domicilio')?.precio || 0)
  );

  const savings = [];
  const rowsA = tiers.map(t => {
    const cs = pick(t.rates, 'clasico', 'sucursal');
    const cd = pick(t.rates, 'clasico', 'domicilio');
    const ed = pick(t.rates, 'expreso', 'domicilio');
    if (cs && cd) savings.push(1 - cs.precio / cd.precio);
    return `                    <tr>
                        <td>${t.dests.join(', ')}</td>
                        <td>${cs ? fmt(cs.precio) : '—'}</td>
                        <td>${cd ? fmt(cd.precio) : '—'}</td>
                        <td>${ed ? fmt(ed.precio) : '—'}</td>
                    </tr>`;
  }).join('\n');

  const avgSaving = savings.length
    ? Math.round(savings.reduce((a, b) => a + b, 0) / savings.length * 100)
    : null;

  // --- Tabla B: cómo escala con el peso, un destino por tramo ---
  const repDests = tiers.map(t => t.dests[0]);
  const rowsB = WEIGHTS.map(w => {
    const cells = repDests.map(d => {
      const row = rows.find(r => r.dest === d && r.kg === w.kg);
      const cd = row ? pick(row.rates, 'clasico', 'domicilio') : null;
      return `<td>${cd ? fmt(cd.precio) : '—'}</td>`;
    }).join('');
    return `                    <tr><td><strong>${w.kg} kg</strong></td>${cells}</tr>`;
  }).join('\n');

  const destsB = repDests;
  const headB = repDests.map(d => `<th>${d.split(' (')[0]}</th>`).join('');

  const plazoClasico = pick(oneKg[0]?.rates || [], 'clasico', 'domicilio')?.plazo || '2-5 dias habiles';
  const plazoExpreso = pick(oneKg[0]?.rates || [], 'expreso', 'domicilio')?.plazo || '1-3 dias habiles';

  const html = `            <h2 id="tarifas-referencia">Tarifas de referencia de Correo Argentino</h2>

            <p>Estas son tarifas reales obtenidas de la API de cotización de Correo Argentino (MiCorreo), tomando <strong>CABA (CP ${ORIGIN.cp}) como origen</strong>. Sirven como referencia para estimar tus costos; el precio exacto de tu envío depende de tu código postal y de las medidas del paquete, y lo podés calcular en el <a href="cotizar-envio-correo-argentino.html">cotizador en vivo</a>.</p>

            <p><strong>Última actualización: ${fecha}.</strong></p>

            <h3>Cuánto cuesta enviar 1 kg desde CABA</h3>

            <p>Un detalle que conviene entender: <strong>Correo Argentino tarifa por zona, no por distancia exacta</strong>. Por eso varios destinos muy distintos comparten el mismo precio, y los agrupamos así:</p>

            <table>
                <thead>
                    <tr>
                        <th>Destinos (misma zona tarifaria)</th>
                        <th>Clásico a sucursal</th>
                        <th>Clásico a domicilio</th>
                        <th>Expreso a domicilio</th>
                    </tr>
                </thead>
                <tbody>
${rowsA}
                </tbody>
            </table>

            <p>Plazos orientativos: <strong>Clásico ${plazoClasico}</strong>, <strong>Expreso ${plazoExpreso}</strong>.${avgSaving ? ` En estas rutas, enviar a sucursal en lugar de a domicilio cuesta en promedio <strong>${avgSaving}% menos</strong>: es la palanca más directa para bajar la tarifa sin cambiar el paquete.` : ''} Para ver el mapa completo de zonas, leé la guía de <a href="zonas-envio-correo-argentino.html">zonas de envío de Correo Argentino</a>.</p>

            <h3>Cómo escala la tarifa con el peso</h3>

            <p>Mismo origen y servicio (Clásico a domicilio), variando el peso del paquete. Se toma un destino representativo de cada zona:</p>

            <table>
                <thead>
                    <tr><th>Peso</th>${headB}</tr>
                </thead>
                <tbody>
${rowsB}
                </tbody>
            </table>

            <p class="post-note"><small>Metodología: consultas a la API de MiCorreo con origen CP ${ORIGIN.cp} y cajas de ${WEIGHTS.map(w => `${w.kg} kg → ${w.box.largo}×${w.box.ancho}×${w.box.alto} cm`).join(', ')}, elegidas para que gobierne el peso real y no el <a href="peso-volumetrico-correo-argentino.html">peso volumétrico</a>. Son tarifas de lista de MiCorreo: si tenés acuerdo <strong>Paq.Ar</strong>, tus precios son más bajos. Correo Argentino actualiza sus tarifas periódicamente, por eso publicamos la fecha de la consulta.</small></p>`;

  // --- versión Markdown para el espejo ---
  const mdRowsA = tiers.map(t => {
    const cs = pick(t.rates, 'clasico', 'sucursal');
    const cd = pick(t.rates, 'clasico', 'domicilio');
    const ed = pick(t.rates, 'expreso', 'domicilio');
    return `| ${t.dests.join(', ')} | ${cs ? fmt(cs.precio) : '—'} | ${cd ? fmt(cd.precio) : '—'} | ${ed ? fmt(ed.precio) : '—'} |`;
  }).join('\n');

  const mdRowsB = WEIGHTS.map(w => {
    const cells = destsB.map(d => {
      const row = rows.find(r => r.dest === d && r.kg === w.kg);
      const cd = row ? pick(row.rates, 'clasico', 'domicilio') : null;
      return cd ? fmt(cd.precio) : '—';
    }).join(' | ');
    return `| ${w.kg} kg | ${cells} |`;
  }).join('\n');

  const md = `## Tarifas de referencia de Correo Argentino

Tarifas reales obtenidas de la API de cotización de Correo Argentino (MiCorreo), con **CABA (CP ${ORIGIN.cp}) como origen**. **Última actualización: ${fecha}.**

### Cuánto cuesta enviar 1 kg desde CABA

Correo Argentino **tarifa por zona, no por distancia exacta**: varios destinos muy distintos comparten el mismo precio. Agrupados por zona tarifaria:

| Destinos (misma zona tarifaria) | Clásico a sucursal | Clásico a domicilio | Expreso a domicilio |
| --- | --- | --- | --- |
${mdRowsA}

Plazos orientativos: Clásico ${plazoClasico}, Expreso ${plazoExpreso}.${avgSaving ? ` En estas rutas, enviar a sucursal en lugar de a domicilio cuesta en promedio **${avgSaving}% menos**: es la palanca más directa para bajar la tarifa sin cambiar el paquete.` : ''}

### Cómo escala la tarifa con el peso

Mismo origen y servicio (Clásico a domicilio), variando el peso. Un destino representativo por zona:

| Peso | ${destsB.map(d => d.split(' (')[0]).join(' | ')} |
| --- | ${destsB.map(() => '---').join(' | ')} |
${mdRowsB}

Metodología: consultas a la API de MiCorreo con origen CP ${ORIGIN.cp} y cajas de ${WEIGHTS.map(w => `${w.kg} kg → ${w.box.largo}×${w.box.ancho}×${w.box.alto} cm`).join(', ')}, elegidas para que gobierne el peso real y no el peso volumétrico. Son tarifas de lista de MiCorreo: con acuerdo Paq.Ar los precios son más bajos.`;

  return { html, md, avgSaving, fecha };
}

function injectBetween(src, start, end, payload, indent) {
  const s = src.indexOf(start), e = src.indexOf(end);
  if (s === -1 || e === -1) return null;
  return src.slice(0, s + start.length) + '\n' + payload + '\n' + indent + src.slice(e);
}

// ---- main ----
let data;
if (OFFLINE) {
  if (!fs.existsSync(DATA_FILE)) { console.error('No hay JSON guardado; corré sin OFFLINE primero.'); process.exit(1); }
  data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  console.log(`Usando matriz guardada (${data.rows.length} filas, ${data.generatedAt}).`);
} else {
  const expected = DESTINATIONS.length * WEIGHTS.length;
  console.log(`Consultando la API (${expected} consultas, ~${Math.round(expected * THROTTLE_MS / 1000)}s por el rate limit)…`);
  const rows = await fetchMatrix();
  // Umbral: si falló más del 20% de las consultas no publicamos nada, para no
  // reemplazar tablas buenas por tablas con huecos.
  const MIN_OK = Math.ceil(expected * 0.8);
  if (rows.length < MIN_OK) {
    console.error(`Sólo ${rows.length}/${expected} consultas OK (mínimo ${MIN_OK}). No se modifica nada.`);
    process.exit(1);
  }
  if (rows.length < expected) console.log(`Aviso: ${expected - rows.length} consulta(s) fallaron; se publica con los datos obtenidos.`);
  data = { generatedAt: new Date().toISOString(), origin: ORIGIN, rows };
  if (!DRY) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Matriz guardada en ${path.relative(ROOT, DATA_FILE)}`);
  }
}

const { html, md, avgSaving, fecha } = buildTables(data);
console.log(`Tablas armadas · fecha: ${fecha} · ahorro promedio sucursal vs domicilio: ${avgSaving}%`);

// HTML
let h = fs.readFileSync(HTML_FILE, 'utf8');
const H_START = '<!-- tarifas:start — generado por scripts/build-tarifas.js (no editar a mano) -->';
const H_END = '<!-- tarifas:end -->';
if (!h.includes(H_START)) {
  // primera vez: insertar la sección antes de "MiCorreo vs Paq.Ar"
  h = h.replace(/(\n\s*)<h2>MiCorreo vs Paq\.Ar/, `$1${H_START}\n$1${H_END}$1<h2>MiCorreo vs Paq.Ar`);
}
const h2 = injectBetween(h, H_START, H_END, html, '            ');
if (!h2) { console.error('No se pudieron ubicar los marcadores en el HTML.'); process.exit(1); }

// Markdown
let m = fs.readFileSync(MD_FILE, 'utf8');
const M_START = '<!-- tarifas:start -->';
const M_END = '<!-- tarifas:end -->';
if (!m.includes(M_START)) {
  m = m.replace(/\n## MiCorreo vs Paq\.Ar/, `\n${M_START}\n${M_END}\n\n## MiCorreo vs Paq.Ar`);
}
const m2 = injectBetween(m, M_START, M_END, md, '');

if (DRY) { console.log('[DRY] no se escribió nada.'); process.exit(0); }
fs.writeFileSync(HTML_FILE, h2, 'utf8');
console.log(`  ${path.relative(ROOT, HTML_FILE)} — actualizado`);
if (m2) { fs.writeFileSync(MD_FILE, m2, 'utf8'); console.log(`  ${path.relative(ROOT, MD_FILE)} — actualizado`); }
else console.log('  aviso: no se pudo actualizar el espejo .md (marcadores)');
