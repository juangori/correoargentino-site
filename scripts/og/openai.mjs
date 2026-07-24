import { writeFileSync } from 'node:fs';

const STYLE = 'Flat modern editorial vector illustration for a shipping and e-commerce blog. '
  + 'Dark navy gradient background (deep #070b14 to #1e3a8a) with glowing cyan and electric-blue accents (#22d3ee, #38bdf8, #3b82f6). '
  + 'Clean, minimal, geometric shapes, soft glow, subtle long shadows, tech aesthetic, high contrast against the dark background. '
  + 'The main subject sits in the RIGHT HALF of the frame; the left third is calm, darker negative space with room to breathe. '
  + 'IMPORTANT: absolutely NO text, NO letters, NO numbers, NO words, NO typography, NO logos, NO watermarks, NO UI mockups. '
  + 'Cohesive, premium, consistent illustration style.';

// prompt = STYLE + subject específico del post. Reintenta en 429 (rate limit 5/min).
export async function generateArt(subject, outPath) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Falta OPENAI_API_KEY');
  const prompt = `${STYLE}\n\nSubject: ${subject}`;
  for (let attempt = 0; attempt < 10; attempt++) {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', quality: 'medium', n: 1 }),
    });
    const text = await res.text();
    if (res.status === 429) {
      const m = text.match(/try again in ([\d.]+)s/i);
      const wait = (m ? Math.ceil(parseFloat(m[1]) * 1000) : 14000) + 1200;
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${text.slice(0, 300)}`);
    const data = JSON.parse(text);
    const b64 = data.data?.[0]?.b64_json;
    if (!b64) throw new Error('Sin b64_json: ' + text.slice(0, 200));
    writeFileSync(outPath, Buffer.from(b64, 'base64'));
    return outPath;
  }
  throw new Error('429 tras 10 reintentos');
}
