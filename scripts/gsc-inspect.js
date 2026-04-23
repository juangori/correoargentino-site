import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KEY_PATH = join(ROOT, 'gsc-key.json');
const SITEMAP_PATH = join(ROOT, 'sitemap.xml');
const SITE_URL = 'sc-domain:correoargentinopro.com';
const SITE_URL_FALLBACK = 'https://correoargentinopro.com/';

function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

async function getClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  return google.searchconsole({ version: 'v1', auth });
}

async function inspectUrl(sc, inspectionUrl, siteUrl) {
  const { data } = await sc.urlInspection.index.inspect({
    requestBody: { inspectionUrl, siteUrl },
  });
  return data.inspectionResult;
}

function summarize(results) {
  const byVerdict = {};
  const byCoverage = {};
  for (const r of results) {
    const idx = r.result?.indexStatusResult || {};
    const v = idx.verdict || 'UNKNOWN';
    const c = idx.coverageState || 'UNKNOWN';
    byVerdict[v] = (byVerdict[v] || 0) + 1;
    byCoverage[c] = (byCoverage[c] || 0) + 1;
  }
  return { byVerdict, byCoverage };
}

async function main() {
  const siteUrl = process.env.GSC_SITE_URL || SITE_URL;
  const xml = readFileSync(SITEMAP_PATH, 'utf8');
  const urls = parseSitemap(xml);
  console.log(`Sitemap: ${urls.length} URLs`);
  console.log(`siteUrl: ${siteUrl}\n`);

  const sc = await getClient();
  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    process.stdout.write(`[${i + 1}/${urls.length}] ${u} ... `);
    try {
      const result = await inspectUrl(sc, u, siteUrl);
      const idx = result?.indexStatusResult || {};
      console.log(`${idx.verdict || '?'} / ${idx.coverageState || '?'}`);
      results.push({ url: u, result });
    } catch (e) {
      console.log(`ERROR ${e.code || ''} ${e.message}`);
      results.push({ url: u, error: e.message, code: e.code });
      if (e.code === 403 || e.code === 401) {
        console.error('\nAuth/permission error. Verify:');
        console.error(`  1) Service account added to GSC property as user`);
        console.error(`  2) Property type matches siteUrl (sc-domain: vs https://)`);
        console.error(`     Try: GSC_SITE_URL="${SITE_URL_FALLBACK}" node scripts/gsc-inspect.js`);
        process.exit(1);
      }
    }
    await new Promise(r => setTimeout(r, 200));
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = join(ROOT, 'gsc-reports', `inspect-${stamp}.json`);
  writeFileSync(outPath, JSON.stringify(results, null, 2));

  const summary = summarize(results);
  console.log('\n=== SUMMARY ===');
  console.log('By verdict:', summary.byVerdict);
  console.log('By coverage state:', summary.byCoverage);
  console.log(`\nFull report: ${outPath}`);

  console.log('\n=== NOT INDEXED (coverageState != "Submitted and indexed") ===');
  for (const r of results) {
    const idx = r.result?.indexStatusResult;
    if (!idx) continue;
    if (idx.verdict !== 'PASS') {
      console.log(`- [${idx.coverageState}] ${r.url}`);
      if (idx.lastCrawlTime) console.log(`    lastCrawl: ${idx.lastCrawlTime}`);
      if (idx.googleCanonical && idx.googleCanonical !== r.url) {
        console.log(`    google canonical: ${idx.googleCanonical}`);
      }
      if (idx.userCanonical && idx.userCanonical !== r.url) {
        console.log(`    user canonical: ${idx.userCanonical}`);
      }
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
