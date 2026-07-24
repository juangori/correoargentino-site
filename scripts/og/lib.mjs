import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
GlobalFonts.registerFromPath(join(__dirname, 'Outfit.ttf'), 'Outfit');

const W = 1200, H = 630, PAD = 72;

export const CATS = {
  envios:       { label: 'Envíos',       accent: '#22d3ee', accent2: '#0ea5e9' },
  guias:        { label: 'Guías',         accent: '#60a5fa', accent2: '#3b82f6' },
  woocommerce:  { label: 'WooCommerce',   accent: '#a78bfa', accent2: '#8b5cf6' },
  comparativas: { label: 'Comparativas',  accent: '#5eead4', accent2: '#14b8a6' },
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx, text, maxW) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

// opts: { title, category, artPath?, out }
export async function renderOG(opts) {
  const cat = CATS[opts.category] || CATS.guias;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // --- Fondo: arte de IA (cover-fit) o gradiente de marca ---
  if (opts.artPath && existsSync(opts.artPath)) {
    const img = await loadImage(opts.artPath);
    const scale = Math.max(W / img.width, H / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  } else {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#070b14'); g.addColorStop(0.45, '#0f172a'); g.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  // --- Scrim para legibilidad (oscuro a la izquierda, transparente a la derecha) ---
  const s = ctx.createLinearGradient(0, 0, W, 0);
  s.addColorStop(0, 'rgba(6,10,20,0.94)'); s.addColorStop(0.55, 'rgba(6,10,20,0.72)'); s.addColorStop(1, 'rgba(6,10,20,0.30)');
  ctx.fillStyle = s; ctx.fillRect(0, 0, W, H);
  const v = ctx.createLinearGradient(0, 0, 0, H);
  v.addColorStop(0, 'rgba(6,10,20,0.25)'); v.addColorStop(1, 'rgba(6,10,20,0.55)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);

  // --- Barra de acento a la izquierda ---
  const bar = ctx.createLinearGradient(0, 0, 0, H);
  bar.addColorStop(0, cat.accent); bar.addColorStop(1, cat.accent2);
  ctx.fillStyle = bar; ctx.fillRect(0, 0, 10, H);

  // --- Ceja de categoría (pill) ---
  ctx.font = '700 24px Outfit';
  const label = cat.label.toUpperCase();
  const lw = ctx.measureText(label).width;
  const dot = 12, gap = 12, padX = 22, pillH = 48;
  const pillW = padX * 2 + dot + gap + lw;
  const px = PAD, py = 74;
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 1.5;
  roundRect(ctx, px, py, pillW, pillH, pillH / 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = cat.accent;
  ctx.beginPath(); ctx.arc(px + padX + dot / 2, py + pillH / 2, dot / 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e6edf6'; ctx.textBaseline = 'middle';
  ctx.fillText(label, px + padX + dot + gap, py + pillH / 2 + 1);

  // --- Título (Outfit 800, wrap, autosize) ---
  const maxW = 740;
  let size = 68;
  let lines;
  for (; size >= 44; size -= 3) {
    ctx.font = `800 ${size}px Outfit`;
    lines = wrap(ctx, opts.title, maxW);
    const lh = size * 1.12;
    if (lines.length * lh <= 300 && lines.length <= 4) break;
  }
  ctx.font = `800 ${size}px Outfit`;
  const lh = size * 1.12;
  const blockH = lines.length * lh;
  let ty = 205 + (300 - blockH) / 2;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  for (const ln of lines) { ctx.fillText(ln, PAD, ty + size * 0.82); ty += lh; }

  // subrayado de acento bajo el título
  ctx.fillStyle = cat.accent;
  roundRect(ctx, PAD, ty + 4, 84, 7, 3.5); ctx.fill();

  // --- Marca abajo a la izquierda ---
  const by = H - PAD - 8;
  // logo: cuadradito con gradiente + "CA"
  const lg = ctx.createLinearGradient(PAD, by - 34, PAD + 44, by + 10);
  lg.addColorStop(0, '#3b82f6'); lg.addColorStop(1, '#06b6d4');
  ctx.fillStyle = lg; roundRect(ctx, PAD, by - 34, 44, 44, 12); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '800 20px Outfit'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.fillText('CA', PAD + 22, by - 34 + 23);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff'; ctx.font = '700 26px Outfit'; ctx.textBaseline = 'middle';
  ctx.fillText('Correo Argentino Pro', PAD + 60, by - 20);
  ctx.fillStyle = cat.accent; ctx.font = '500 20px Outfit';
  ctx.fillText('correoargentinopro.com', PAD + 60, by + 8);

  const ext = opts.out.toLowerCase();
  const buf = ext.endsWith('.jpg') || ext.endsWith('.jpeg')
    ? canvas.toBuffer('image/jpeg', 88)
    : ext.endsWith('.webp') ? canvas.toBuffer('image/webp', 82) : canvas.toBuffer('image/png');
  writeFileSync(opts.out, buf);
  return opts.out;
}

// Deriva el hero: reescala el arte crudo a maxW y exporta WebP comprimido.
export async function exportHero(artPath, out, maxW = 1200, quality = 82) {
  const img = await loadImage(artPath);
  const scale = Math.min(1, maxW / img.width);
  const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  writeFileSync(out, canvas.toBuffer('image/webp', quality));
  return out;
}
