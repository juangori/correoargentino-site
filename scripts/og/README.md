# Motor de OG images + hero art

Genera una imagen por post y la usa dos veces:

- **`og/<slug>.jpg`** (1200×630) — fondo de IA + título por código (Outfit). Para OG / redes / WhatsApp.
- **`og/hero/<slug>.webp`** — el arte limpio (sin texto). Para la ilustración del hero del post.

Enfoque **híbrido**: el arte lo genera `gpt-image-1` (sin texto, que los modelos no renderizan bien), y el título lo compone el código con canvas → siempre legible.

## Cómo funciona

1. `subjects.json` — un subject (descripción de la ilustración) por slug de post.
2. `generate.mjs` — por cada post: genera el arte (cacheado en `cache/art/`, gitignoreado), compone el OG jpg y exporta el hero webp a `og/`.
3. `rewire-html.mjs` — actualiza `og:image`/`twitter:image` (+ width/height) y reemplaza el SVG del hero por el `<img>` en cada post.

`generate.mjs` **saltea los posts cuyas imágenes ya existen** (no re-gasta). Para regenerar todo: `--force`.

## Uso (agregar imágenes a posts nuevos)

```bash
cd scripts/og
npm install                      # instala @napi-rs/canvas (una vez)

# 1) agregá el/los subject(s) nuevos en subjects.json (key = archivo .html del post)
# 2) asegurate de que posts-data.js esté actualizado:
node ../build-blog-data.js

# 3) generá (necesita la API key de OpenAI en el entorno):
OPENAI_API_KEY="sk-..." node generate.mjs

# 4) reconectá el HTML:
node rewire-html.mjs
```

En Windows/PowerShell la key: `$env:OPENAI_API_KEY="sk-..."; node generate.mjs`

## Notas

- **Costo**: ~US$0.063 por imagen (gpt-image-1, 1536×1024, quality medium).
- **Rate limit**: gpt-image-1 permite ~5 imágenes/min; el motor corre secuencial con retry en 429.
- **La key nunca se commitea** — se lee de `OPENAI_API_KEY`.
- El estilo visual (paleta, composición) vive en `openai.mjs` (constante `STYLE`); el layout del OG en `lib.mjs`.
- `cache/` y `node_modules/` están gitignoreados. El arte crudo PNG (~1.7MB c/u) queda solo en cache local; si cambiás el layout del OG y querés recomponer sin re-llamar a la API, mantené `cache/art/`.
