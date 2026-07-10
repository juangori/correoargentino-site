import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KEY_PATH = join(ROOT, 'gsc-key.json');
const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:correoargentinopro.com';

function daysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

async function getClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  return google.searchconsole({ version: 'v1', auth });
}

async function query(sc, { startDate, endDate, dimensions, rowLimit = 1000, filters }) {
  const requestBody = { startDate, endDate, dimensions, rowLimit, dataState: 'all' };
  if (filters) requestBody.dimensionFilterGroups = [{ filters }];
  const { data } = await sc.searchanalytics.query({ siteUrl: SITE_URL, requestBody });
  return data.rows || [];
}

async function main() {
  const sc = await getClient();
  const endDate = daysAgo(2); // GSC data lags ~2 days
  const start90 = daysAgo(92);
  const start28 = daysAgo(30);
  const prev28Start = daysAgo(58);
  const prev28End = daysAgo(31);

  console.log(`siteUrl: ${SITE_URL}`);
  console.log(`window 90d: ${start90} .. ${endDate}`);
  console.log(`window 28d: ${start28} .. ${endDate}\n`);

  const out = { generated: new Date().toISOString(), siteUrl: SITE_URL, windows: { start90, start28, endDate } };

  // 1. Totals 90d
  const totalsRows = await query(sc, { startDate: start90, endDate, dimensions: [] });
  out.totals90 = totalsRows[0] || {};

  // 2. Top queries 90d
  out.queries90 = await query(sc, { startDate: start90, endDate, dimensions: ['query'], rowLimit: 1000 });

  // 3. Top pages 90d
  out.pages90 = await query(sc, { startDate: start90, endDate, dimensions: ['page'], rowLimit: 1000 });

  // 4. Query x page 90d (for mapping intent)
  out.queryPage90 = await query(sc, { startDate: start90, endDate, dimensions: ['query', 'page'], rowLimit: 5000 });

  // 5. Country
  out.country90 = await query(sc, { startDate: start90, endDate, dimensions: ['country'], rowLimit: 20 });

  // 6. Device
  out.device90 = await query(sc, { startDate: start90, endDate, dimensions: ['device'], rowLimit: 10 });

  // 7. Recent 28 vs previous 28 (trend) — by query
  out.queries28 = await query(sc, { startDate: start28, endDate, dimensions: ['query'], rowLimit: 1000 });
  out.queriesPrev28 = await query(sc, { startDate: prev28Start, endDate: prev28End, dimensions: ['query'], rowLimit: 1000 });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = join(ROOT, 'gsc-reports', `analytics-${stamp}.json`);
  writeFileSync(outPath, JSON.stringify(out, null, 2));

  // ---- Console summaries ----
  const t = out.totals90;
  console.log('=== TOTALS (90d) ===');
  console.log(`clicks=${t.clicks} impressions=${t.impressions} ctr=${(t.ctr*100).toFixed(2)}% pos=${t.position?.toFixed(1)}\n`);

  console.log('=== TOP 25 QUERIES BY CLICKS (90d) ===');
  for (const r of out.queries90.slice(0, 25)) {
    console.log(`${String(r.clicks).padStart(4)}c ${String(r.impressions).padStart(6)}i ${(r.ctr*100).toFixed(1).padStart(5)}% p${r.position.toFixed(1).padStart(5)}  ${r.keys[0]}`);
  }

  console.log('\n=== STRIKING DISTANCE (pos 4-15, impressions>=50, sorted by impressions) ===');
  const striking = out.queries90
    .filter(r => r.position >= 4 && r.position <= 15 && r.impressions >= 50)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);
  for (const r of striking) {
    console.log(`${String(r.impressions).padStart(6)}i ${String(r.clicks).padStart(4)}c ${(r.ctr*100).toFixed(1).padStart(5)}% p${r.position.toFixed(1).padStart(5)}  ${r.keys[0]}`);
  }

  console.log('\n=== HIGH IMPRESSIONS, LOW CTR (pos<=10, impressions>=100, ctr<3%) — metadata opportunity ===');
  const lowCtr = out.queries90
    .filter(r => r.position <= 10.5 && r.impressions >= 100 && r.ctr < 0.03)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 30);
  for (const r of lowCtr) {
    console.log(`${String(r.impressions).padStart(6)}i ${String(r.clicks).padStart(4)}c ${(r.ctr*100).toFixed(1).padStart(5)}% p${r.position.toFixed(1).padStart(5)}  ${r.keys[0]}`);
  }

  console.log('\n=== TOP 20 PAGES BY CLICKS (90d) ===');
  for (const r of out.pages90.slice(0, 20)) {
    console.log(`${String(r.clicks).padStart(4)}c ${String(r.impressions).padStart(6)}i ${(r.ctr*100).toFixed(1).padStart(5)}% p${r.position.toFixed(1).padStart(5)}  ${r.keys[0].replace('https://correoargentinopro.com','')}`);
  }

  console.log('\n=== COUNTRY (90d) ===');
  for (const r of out.country90.slice(0, 8)) {
    console.log(`${String(r.clicks).padStart(5)}c ${String(r.impressions).padStart(7)}i  ${r.keys[0]}`);
  }
  console.log('\n=== DEVICE (90d) ===');
  for (const r of out.device90) {
    console.log(`${String(r.clicks).padStart(5)}c ${String(r.impressions).padStart(7)}i  ${r.keys[0]}`);
  }

  console.log(`\nFull report: ${outPath}`);
}

main().catch(e => { console.error(e.message); if (e.errors) console.error(e.errors); process.exit(1); });
