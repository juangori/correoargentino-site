import { google } from 'googleapis';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = join(__dirname, '..', 'gsc-key.json');
const PROPERTY = 'properties/527463234';
const TO_MARK = ['cta_click', 'cotizar_envio'];

function emsg(e) { return e?.errors?.[0]?.message || e?.response?.data?.error?.message || e?.message || String(e); }

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/analytics.edit',
    ],
  });
  const admin = google.analyticsadmin({ version: 'v1beta', auth });
  const data = google.analyticsdata({ version: 'v1beta', auth });

  // 1) Confirm recent event flow (last 3 days) — is cta_click firing after GTM publish?
  console.log('=== EVENTOS RECIENTES (últimos 3 días) ===');
  try {
    const { data: rep } = await data.properties.runReport({
      property: PROPERTY,
      requestBody: {
        dateRanges: [{ startDate: '3daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 40,
      },
    });
    for (const r of rep.rows || []) {
      const name = r.dimensionValues[0].value;
      const flag = TO_MARK.includes(name) ? '  ⭐' : '';
      console.log(`${String(r.metricValues[0].value).padStart(7)}  ${name}${flag}`);
    }
  } catch (e) { console.log('  ⚠️ runReport:', emsg(e)); }

  // 2) List existing key events
  let existing = [];
  try {
    const { data: ke } = await admin.properties.keyEvents.list({ parent: PROPERTY });
    existing = (ke.keyEvents || []).map(k => k.eventName);
    console.log('\n=== KEY EVENTS actuales:', existing.join(', ') || '(ninguno)');
  } catch (e) { console.log('\n⚠️ keyEvents.list:', emsg(e)); }

  // 3) Create missing key events
  console.log('\n=== MARCAR CONVERSIONES ===');
  for (const name of TO_MARK) {
    if (existing.includes(name)) { console.log(`  = ${name} ya es key event`); continue; }
    try {
      await admin.properties.keyEvents.create({ parent: PROPERTY, requestBody: { eventName: name } });
      console.log(`  ✅ ${name} marcado como conversión`);
    } catch (e) {
      console.log(`  ❌ ${name}: ${emsg(e)}`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });
