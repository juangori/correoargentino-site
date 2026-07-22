/*
 * Fase 1 — corrector determinístico de tildes (solo palabras INEQUÍVOCAS).
 * Opera únicamente sobre texto visible: protege tags, atributos, URLs,
 * <script> (incl. JSON-LD), <style> y entidades HTML. Solo AGREGA diacríticos
 * a palabras que siempre los llevan y no tienen homógrafo sin tilde.
 * NO toca homógrafos ambiguos (como/esta/solo/aun/mi/tu/se/si/el/que/…): eso
 * queda para la fase con agentes.
 *
 * Uso:  node scripts/fix-accents.js [--apply]   (sin --apply = dry-run)
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');

// Diccionario: forma sin tilde (minúsculas) -> forma con tilde.
// Solo palabras SIN homógrafo válido sin tilde.
const DICT = {
  dia: 'día', dias: 'días',
  pais: 'país', paises: 'países',
  tambien: 'también',
  rapido: 'rápido', rapida: 'rápida', rapidos: 'rápidos', rapidas: 'rápidas', rapidamente: 'rápidamente', rapidez: 'rapidez',
  facil: 'fácil', faciles: 'fáciles', facilmente: 'fácilmente',
  dificil: 'difícil', dificiles: 'difíciles',
  metodo: 'método', metodos: 'métodos',
  pagina: 'página', paginas: 'páginas',
  numero: 'número', numeros: 'números',
  codigo: 'código', codigos: 'códigos',
  articulo: 'artículo', articulos: 'artículos',
  segun: 'según',
  despues: 'después',
  ademas: 'además',
  asi: 'así',
  aqui: 'aquí', alli: 'allí', alla: 'allá', aca: 'acá',
  atras: 'atrás', detras: 'detrás', demas: 'demás', traves: 'través', jamas: 'jamás',
  minimo: 'mínimo', minima: 'mínima', minimos: 'mínimos', minimas: 'mínimas',
  maximo: 'máximo', maxima: 'máxima', maximos: 'máximos', maximas: 'máximas',
  ultimo: 'último', ultima: 'última', ultimos: 'últimos', ultimas: 'últimas',
  unico: 'único', unica: 'única', unicos: 'únicos', unicas: 'únicas',
  area: 'área', areas: 'áreas',
  credito: 'crédito', creditos: 'créditos', debito: 'débito',
  telefono: 'teléfono', telefonos: 'teléfonos',
  electronico: 'electrónico', electronica: 'electrónica', electronicos: 'electrónicos', electronicas: 'electrónicas',
  economico: 'económico', economica: 'económica', economicos: 'económicos', economicas: 'económicas',
  tecnico: 'técnico', tecnica: 'técnica', tecnicos: 'técnicos', tecnicas: 'técnicas',
  automatico: 'automático', automatica: 'automática', automaticos: 'automáticos', automaticas: 'automáticas',
  logistica: 'logística', logistico: 'logístico',
  estandar: 'estándar',
  kilometro: 'kilómetro', kilometros: 'kilómetros',
  garantia: 'garantía', garantias: 'garantías',
  categoria: 'categoría', categorias: 'categorías',
  mercaderia: 'mercadería', mercaderias: 'mercaderías',
  envio: 'envío', envios: 'envíos',
  tipico: 'típico', tipica: 'típica',
  basico: 'básico', basica: 'básica', basicos: 'básicos', basicas: 'básicas',
  especifico: 'específico', especifica: 'específica', especificos: 'específicos', especificas: 'específicas',
  historico: 'histórico', historica: 'histórica',
  comun: 'común',
  proximo: 'próximo', proxima: 'próxima', proximos: 'próximos', proximas: 'próximas',
  comodo: 'cómodo', comoda: 'cómoda',
  quizas: 'quizás', menu: 'menú', menus: 'menús',
  facturacion: 'facturación',
  // ñ inequívocas
  senor: 'señor', senora: 'señora', senores: 'señores',
  espanol: 'español', espanola: 'española', espanoles: 'españoles',
  manana: 'mañana', pequeno: 'pequeño', pequena: 'pequeña', pequenos: 'pequeños', pequenas: 'pequeñas',
  diseno: 'diseño', tamano: 'tamaño', tamanos: 'tamaños',
  nino: 'niño', nina: 'niña', ninos: 'niños', ninas: 'niñas',
  dueno: 'dueño', duena: 'dueña', ano: 'año', anos: 'años',
  senal: 'señal', senales: 'señales', ensenar: 'enseñar', companias: 'compañías', compania: 'compañía',
};

// Palabras que terminan en "-ion" pero NO llevan tilde (excepciones).
const ION_BLOCK = new Set(['guion', 'muon', 'prion', 'pion', 'trion', 'anion', 'cation', 'ion', 'redirection']);

function applyCase(orig, repl) {
  const hasLetters = /[a-záéíóúñü]/i.test(orig);
  if (hasLetters && orig === orig.toUpperCase()) return repl.toUpperCase();
  if (orig[0] === orig[0].toUpperCase() && orig[0] !== orig[0].toLowerCase()) {
    return repl[0].toUpperCase() + repl.slice(1);
  }
  return repl;
}

const WORD = /[A-Za-zÁÉÍÓÚÑÜáéíóúñü]{2,}/g;

function fixText(text) {
  return text.replace(WORD, (w) => {
    const lw = w.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(DICT, lw)) return applyCase(w, DICT[lw]);
    // regla -ión: palabra >=5 letras que termina en "ion" (sin tilde) -> "ión"
    if (w.length >= 5 && /^[a-z]+ion$/.test(lw) && !ION_BLOCK.has(lw)) {
      const o = w[w.length - 2]; // la 'o' que recibe la tilde
      return w.slice(0, -2) + (o === 'O' ? 'Ó' : 'ó') + w[w.length - 1];
    }
    return w;
  });
}

// Recorre el HTML dejando intactos tags, <script>, <style> y entidades.
const PROTECT = /<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>|&[a-zA-Z#0-9]+;/g;
function fixHtml(html) {
  let out = '', last = 0, m;
  PROTECT.lastIndex = 0;
  while ((m = PROTECT.exec(html))) {
    out += fixText(html.slice(last, m.index));
    out += m[0];
    last = m.index + m[0].length;
  }
  out += fixText(html.slice(last));
  return out;
}

const deaccent = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

const files = [];
for (const f of readdirSync('.')) if (f.endsWith('.html') && f !== 'admin.html') files.push(f);
for (const f of readdirSync('blog')) if (f.endsWith('.html')) files.push('blog/' + f);

let changed = 0, totalFixes = 0, unsafe = [];
for (const f of files) {
  const before = readFileSync(f, 'utf8');
  const after = fixHtml(before);
  if (after === before) continue;
  // invariante: quitando diacríticos, tiene que ser idéntico
  if (deaccent(before) !== deaccent(after)) { unsafe.push(f); continue; }
  const fixes = [...before].reduce((n, ch, i) => n + (ch !== after[i] ? 1 : 0), 0);
  changed++; totalFixes += fixes;
  if (APPLY) writeFileSync(f, after);
  console.log(`  ${String(fixes).padStart(4)}  ${f}`);
}

console.log(`\n${APPLY ? 'APLICADO' : 'DRY-RUN'}: ${changed} archivos, ~${totalFixes} caracteres acentuados`);
if (unsafe.length) console.log('⚠ NO SEGUROS (invariante roto, saltados):', unsafe);
