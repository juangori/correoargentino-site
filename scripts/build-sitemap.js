import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, posix } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE_URL = 'https://correoargentinopro.com';

const EXCLUDE_FILES = new Set(['404.html', 'admin.html']);
const EXCLUDE_DIRS = new Set(['node_modules', 'scripts', 'gsc-reports', '.git', '.wrangler', 'assets']);

const PRIORITY_RULES = [
  { match: u => u === `${SITE_URL}/`, priority: 1.0, changefreq: 'weekly' },
  { match: u => u === `${SITE_URL}/blog/`, priority: 0.8, changefreq: 'weekly' },
  { match: u => /\/blog\/[^/]+\/$/.test(u), priority: 0.8, changefreq: 'weekly' },
  { match: u => /\/(terminos|privacidad)\.html$/.test(u), priority: 0.3, changefreq: 'yearly' },
  { match: u => /\/contacto\.html$/.test(u), priority: 0.6, changefreq: 'monthly' },
  { match: u => /\/log-de-actualizaciones-plugin\.html$/.test(u), priority: 0.7, changefreq: 'weekly' },
  { match: u => /\/blog\/.+\.html$/.test(u), priority: 0.7, changefreq: 'monthly' },
  { match: u => true, priority: 0.8, changefreq: 'monthly' },
];

function walkHtml(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      walkHtml(join(dir, entry.name), out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (EXCLUDE_FILES.has(entry.name)) continue;
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

function pathToUrl(absPath) {
  const rel = posix.normalize(relative(ROOT, absPath).split(/[\\/]/).join('/'));
  if (rel === 'index.html') return `${SITE_URL}/`;
  if (rel.endsWith('/index.html')) return `${SITE_URL}/${rel.slice(0, -'index.html'.length)}`;
  return `${SITE_URL}/${rel}`;
}

function extractMeta(html) {
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
                 || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
  const robotsTag = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';
  const noindex = /noindex/i.test(robotsTag);
  return { canonical: canonical?.trim(), noindex };
}

function gitLastModified(absPath) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', absPath], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (out) return out.slice(0, 10);
  } catch {}
  return null;
}

function lastModFor(absPath) {
  return gitLastModified(absPath) || statSync(absPath).mtime.toISOString().slice(0, 10);
}

function pickPriority(url) {
  for (const rule of PRIORITY_RULES) if (rule.match(url)) return rule;
  return PRIORITY_RULES.at(-1);
}

async function verifyLive(url, signal) {
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'manual', signal });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: 'GET', redirect: 'manual', signal });
    }
    return { ok: res.status === 200, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  }
}

async function verifyAll(urls, concurrency = 8) {
  const results = new Map();
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < urls.length) {
      const url = urls[i++];
      results.set(url, await verifyLive(url));
    }
  });
  await Promise.all(workers);
  return results;
}

function buildXml(entries) {
  const body = entries.map(e => `    <url>
        <loc>${e.url}</loc>
        <lastmod>${e.lastmod}</lastmod>
        <changefreq>${e.changefreq}</changefreq>
        <priority>${e.priority.toFixed(1)}</priority>
    </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

async function main() {
  const verify = process.argv.includes('--verify');
  const files = walkHtml(ROOT);

  const candidates = [];
  const skipped = [];
  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    const url = pathToUrl(file);
    const { canonical, noindex } = extractMeta(html);

    if (noindex) { skipped.push({ url, reason: 'noindex' }); continue; }
    if (canonical && canonical !== url) {
      skipped.push({ url, reason: `canonical points to ${canonical}` });
      continue;
    }
    const lastmod = lastModFor(file);
    const rule = pickPriority(url);
    candidates.push({ url, lastmod, priority: rule.priority, changefreq: rule.changefreq });
  }

  let entries = candidates;

  if (verify) {
    console.log(`Verifying ${candidates.length} URLs against live site...`);
    const results = await verifyAll(candidates.map(c => c.url));
    entries = [];
    for (const c of candidates) {
      const r = results.get(c.url);
      if (r.ok) entries.push(c);
      else skipped.push({ url: c.url, reason: `live status ${r.status}${r.error ? ' ' + r.error : ''}` });
    }
  }

  entries.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.url.localeCompare(b.url);
  });

  const xml = buildXml(entries);
  const outPath = join(ROOT, 'sitemap.xml');
  writeFileSync(outPath, xml);

  console.log(`\nWrote ${entries.length} URLs to ${outPath}`);
  if (skipped.length) {
    console.log(`\nSkipped ${skipped.length}:`);
    for (const s of skipped) console.log(`  - [${s.reason}] ${s.url}`);
  }
  if (!verify) console.log('\nTip: run with --verify to also check each URL returns 200 from live site.');
}

main().catch(e => { console.error(e); process.exit(1); });
