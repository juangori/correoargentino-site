import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KEY_PATH = join(ROOT, 'gsc-key.json');
const GTM_PUBLIC_ID = process.env.GTM_ID || 'GTM-5PL6T2RH';

async function getAuth() {
  return new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: [
      'https://www.googleapis.com/auth/tagmanager.readonly',
      'https://www.googleapis.com/auth/analytics.readonly',
    ],
  });
}

const out = { generated: new Date().toISOString(), gtm: {}, ga4: {}, errors: [] };
function err(where, e) {
  const msg = e?.errors?.[0]?.message || e?.message || String(e);
  out.errors.push({ where, msg });
  console.log(`  ⚠️  [${where}] ${msg}`);
}

async function auditGTM(auth) {
  console.log('\n===== GTM =====');
  const tm = google.tagmanager({ version: 'v2', auth });
  let container;
  try {
    const { data: accts } = await tm.accounts.list();
    for (const acc of accts.account || []) {
      const { data: conts } = await tm.accounts.containers.list({ parent: acc.path });
      for (const c of conts.container || []) {
        console.log(`  account "${acc.name}" → container "${c.name}" (${c.publicId})`);
        if (c.publicId === GTM_PUBLIC_ID) container = c;
      }
    }
  } catch (e) { err('gtm.list', e); return; }
  if (!container) { err('gtm.find', new Error(`No encontré ${GTM_PUBLIC_ID}`)); return; }

  out.gtm.container = { name: container.name, publicId: container.publicId, path: container.path };
  let version;
  try {
    const { data } = await tm.accounts.containers.versions.live({ parent: container.path });
    version = data;
  } catch (e) {
    err('gtm.live', e);
    // fallback: default workspace
    try {
      const { data: ws } = await tm.accounts.containers.workspaces.list({ parent: container.path });
      const w = (ws.workspace || [])[0];
      if (w) {
        const [tags, trigs, vars] = await Promise.all([
          tm.accounts.containers.workspaces.tags.list({ parent: w.path }),
          tm.accounts.containers.workspaces.triggers.list({ parent: w.path }),
          tm.accounts.containers.workspaces.variables.list({ parent: w.path }),
        ]);
        version = { tag: tags.data.tag, trigger: trigs.data.trigger, variable: vars.data.variable, _fromWorkspace: w.name };
      }
    } catch (e2) { err('gtm.workspace', e2); return; }
  }
  if (!version) return;

  const tags = version.tag || [], triggers = version.trigger || [], vars = version.variable || [];
  out.gtm.version = { versionId: version.containerVersionId, fromWorkspace: version._fromWorkspace, tags, triggers, variables: vars, builtIn: version.builtInVariable };
  const trigById = Object.fromEntries(triggers.map(t => [t.triggerId, t]));

  console.log(`  LIVE version: ${version.containerVersionId || version._fromWorkspace || '?'}`);
  console.log(`  Tags: ${tags.length} | Triggers: ${triggers.length} | Variables: ${vars.length}`);

  console.log('\n  --- TAGS ---');
  for (const t of tags) {
    const firing = (t.firingTriggerId || []).map(id => trigById[id]?.name || id).join(', ');
    console.log(`   • [${t.type}] ${t.name}  ⟵ ${firing || '(sin trigger)'}${t.paused ? '  [PAUSED]' : ''}`);
  }
  console.log('\n  --- TRIGGERS ---');
  for (const t of triggers) {
    const filt = [...(t.filter || []), ...(t.customEventFilter || [])]
      .map(f => (f.parameter || []).map(p => p.value).join(' ')).join(' | ');
    console.log(`   • [${t.type}] ${t.name}${filt ? '  {' + filt + '}' : ''}`);
  }
  console.log('\n  --- USER-DEFINED VARIABLES ---');
  for (const v of vars) console.log(`   • [${v.type}] ${v.name}`);
}

async function auditGA4(auth) {
  console.log('\n===== GA4 =====');
  const admin = google.analyticsadmin({ version: 'v1beta', auth });
  const adminA = google.analyticsadmin({ version: 'v1alpha', auth });
  const data = google.analyticsdata({ version: 'v1beta', auth });

  let properties = [];
  try {
    const { data: accts } = await admin.accounts.list();
    for (const acc of accts.accounts || []) {
      const { data: props } = await admin.properties.list({ filter: `parent:${acc.name}` });
      for (const p of props.properties || []) {
        console.log(`  account "${acc.displayName}" → property "${p.displayName}" (${p.name})`);
        properties.push(p);
      }
    }
  } catch (e) { err('ga4.accounts', e); }

  out.ga4.properties = [];
  for (const p of properties) {
    const rec = { name: p.name, displayName: p.displayName, streams: [], keyEvents: [], topEvents: [] };
    const pid = p.name.split('/')[1];
    try {
      const { data: streams } = await admin.properties.dataStreams.list({ parent: p.name });
      for (const s of streams.dataStreams || []) {
        const stream = { displayName: s.displayName, type: s.type, measurementId: s.webStreamData?.measurementId, defaultUri: s.webStreamData?.defaultUri };
        try {
          const { data: em } = await adminA.properties.dataStreams.getEnhancedMeasurementSettings({ name: `${s.name}/enhancedMeasurementSettings` });
          stream.enhancedMeasurement = em;
        } catch (e) { err('ga4.enhancedMeasurement', e); }
        rec.streams.push(stream);
      }
    } catch (e) { err('ga4.streams', e); }
    try {
      const { data: ke } = await admin.properties.keyEvents.list({ parent: p.name });
      rec.keyEvents = (ke.keyEvents || []).map(k => k.eventName);
    } catch (e) { err('ga4.keyEvents', e); }
    // Top events last 28d
    try {
      const { data: rep } = await data.properties.runReport({
        property: p.name,
        requestBody: {
          dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
          limit: 40,
        },
      });
      rec.topEvents = (rep.rows || []).map(r => ({ event: r.dimensionValues[0].value, count: Number(r.metricValues[0].value) }));
    } catch (e) { err('ga4.runReport', e); }
    out.ga4.properties.push(rec);

    console.log(`\n  PROPERTY ${p.displayName} (${pid})`);
    for (const s of rec.streams) {
      console.log(`   stream: ${s.displayName} — ${s.measurementId} — ${s.defaultUri}`);
      if (s.enhancedMeasurement) {
        const em = s.enhancedMeasurement;
        const on = Object.entries(em).filter(([k, v]) => v === true && k.endsWith('Enabled')).map(([k]) => k.replace('Enabled', ''));
        console.log(`     enhanced measurement: ${em.streamEnabled ? 'ON' : 'off'} → [${on.join(', ')}]`);
      }
    }
    console.log(`   key events (conversions): ${rec.keyEvents.join(', ') || '(ninguno)'}`);
    console.log(`   TOP EVENTS (28d):`);
    for (const e of rec.topEvents) console.log(`     ${String(e.count).padStart(7)}  ${e.event}`);
  }
}

async function main() {
  const auth = await getAuth();
  await auditGTM(auth);
  await auditGA4(auth);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = join(ROOT, 'gsc-reports', `ga-gtm-audit-${stamp}.json`);
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\nFull report: ${outPath}`);
  if (out.errors.length) console.log(`\n⚠️  ${out.errors.length} errores — ver arriba.`);
}
main().catch(e => { console.error(e); process.exit(1); });
