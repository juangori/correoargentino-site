/*
 * Motor de imágenes OG + hero por post (híbrido: arte IA + título por código).
 * Por cada post genera arte (gpt-image-1, cacheado) y exporta:
 *   og/<slug>.jpg        (1200x630, con título)  -> para redes/OG
 *   og/hero/<slug>.webp  (arte limpio, sin texto) -> para el hero del post
 * Resumible: si el arte ya está en cache/art, no vuelve a llamar a la API.
 *
 * Uso:
 *   cd scripts/og && npm install
 *   OPENAI_API_KEY=... node generate.mjs
 *   node ../build-blog-data.js   # si agregaste posts nuevos (regenera posts-data.js)
 *   node rewire-html.mjs         # reconecta el HTML a las imágenes nuevas
 */
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generateArt } from './openai.mjs';
import { renderOG, exportHero } from './lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = join(__dirname, '../..');
const OG = join(SITE, 'og');
const HERO = join(OG, 'hero');
const CACHE = join(__dirname, 'cache/art');
[OG, HERO, CACHE].forEach(d => mkdirSync(d, { recursive: true }));

const raw = readFileSync(join(SITE, 'blog/posts-data.js'), 'utf8');
const posts = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1));
const subjects = JSON.parse(readFileSync(join(__dirname, 'subjects.json'), 'utf8'));

const FORCE = process.argv.includes('--force');
const CONCURRENCY = 1; // gpt-image-1: límite ~5 imágenes/min. Con retry en 429.
let generated = 0, cached = 0, composed = 0, skippedExisting = 0;
const failures = [];

async function processPost(p) {
  const base = p.u.replace(/\.html$/, '');
  const subject = subjects[p.u];
  if (!subject) { failures.push(`${p.u}: sin subject en subjects.json`); return; }
  const ogOut = join(OG, base + '.jpg'), heroOut = join(HERO, base + '.webp');
  // No re-gastar: si ambas salidas ya existen, saltear (salvo --force).
  if (!FORCE && existsSync(ogOut) && existsSync(heroOut)) { skippedExisting++; return; }
  const artPath = join(CACHE, base + '.png');
  try {
    if (existsSync(artPath)) cached++;
    else { await generateArt(subject, artPath); generated++; }
    await renderOG({ title: p.t, category: p.c, artPath, out: ogOut });
    await exportHero(artPath, heroOut);
    composed++;
    console.log(`  [${composed + failures.length}/${posts.length}] ${base}`);
  } catch (e) {
    failures.push(`${p.u}: ${e.message}`);
    console.log(`  ✗ ${base}: ${e.message}`);
  }
}

let idx = 0;
async function worker() { while (idx < posts.length) await processPost(posts[idx++]); }
console.log(`Procesando ${posts.length} posts...`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`\n== Listo ==`);
console.log(`Arte generado (API): ${generated} | desde cache: ${cached} | OG+hero: ${composed} | ya existían: ${skippedExisting}`);
console.log(`Costo estimado API: ~US$${(generated * 0.063).toFixed(2)}`);
if (failures.length) { console.log(`\nFALLAS (${failures.length}):`); failures.forEach(f => console.log('  - ' + f)); }
