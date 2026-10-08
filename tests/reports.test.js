// The six reports, produced from the original stylesheets. Reference text comes from libxslt
// (scripts/make_report_refs.py). Each report is checked with the browser's own XSLT and with the
// bundled replacement that takes over where browsers have removed XSLT.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT, openPage } = require('./harness.js');

const REF = path.join(ROOT, 'tests', 'fixtures', 'reports');
const REPORTS = ['recs', 'detailed', 'rules', 'dvs', 'action', 'gem-cogs'];
let t, page;
test.before(async () => { t = await openPage(); page = t.page; });
test.after(async () => { await t.close(); });
test.afterEach(() => assert.deepEqual(t.errors.splice(0), [], 'error in the page'));

const reportText = (key, forcePolyfill) => page.evaluate(async ([k, force]) => {
  const G = window.CutGL;
  const xsl = G.reportXsl(k).replace(/select="'[^'"]*, \d{4}'"/, 'select="\'DATE\'"'); // the Detailed report's date
  const out = await G.xsltTransform(serializeGem(G.S.root), xsl, force);
  const doc = new DOMParser().parseFromString(out.html, 'text/html');
  for (const el of doc.querySelectorAll('style,script,title')) el.remove();
  return { engine: out.engine, text: doc.documentElement.textContent.replace(/\s+/g, '') };
}, [key, forcePolyfill]);

for (const [id, name] of [['hand-hygiene', 'sample_hand_hygiene'], ['inhaler-review', 'sample_inhaler_review'], ['blood-pressure', 'sample_blood_pressure']]) {
  test(name + ': all six reports match libxslt, with either engine', async () => {
    await page.evaluate((x) => window.CutGL.openSample(x), id);
    for (const key of REPORTS) {
      const want = fs.readFileSync(path.join(REF, name + '.' + key + '.txt'), 'utf8');
      const native = await reportText(key, false);
      assert.equal(native.engine, 'native');
      assert.equal(native.text, want, key + ' (browser XSLT)');
      const bundled = await reportText(key, true);
      assert.equal(bundled.engine, 'polyfill');
      assert.equal(bundled.text, want, key + ' (bundled XSLT)');
    }
  });
}

test('Report menu: shows the report, saves it as HTML, and drops scripts from the display', async () => {
  await page.evaluate(() => window.CutGL.openSample('inhaler-review'));
  await page.click('#mReport'); await page.click('[data-report="recs"]');
  await page.waitForSelector('#dlgReport[open]');
  assert.equal(await page.textContent('#dlgReportT'), 'Recommendations report');
  const shown = await page.evaluate(() => { const sh = document.getElementById('repHost').shadowRoot; return { text: sh.textContent, scripts: sh.querySelectorAll('script').length }; });
  assert.match(shown.text, /Inhaler Technique Review for Adults With Asthma/);
  assert.match(shown.text, /If the patient makes an error in technique/);
  assert.equal(shown.scripts, 0);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#repSave')]);
  assert.equal(dl.suggestedFilename(), 'sample_inhaler_review_Recommendations_Report.html');
  assert.equal(await page.isVisible('#repPrint'), true);
  await page.click('#dlgReport [data-close]');
});

test('Detailed report carries today\'s date in place of the retired Yale date service', async () => {
  const xsl = await page.evaluate(() => window.CutGL.reportXsl('detailed'));
  assert.equal(xsl.includes('gem.med.yale.edu/date.php'), false);
  assert.match(xsl, /select="'[A-Z][a-z]+ \d{1,2}, \d{4}'"/);
});

test('without browser XSLT the report still appears', async () => {
  const t2 = await openPage({ init: () => { delete window.XSLTProcessor; } });
  try {
    assert.equal(await t2.page.evaluate(() => typeof window.XSLTProcessor), 'undefined');
    await t2.page.click('#mReport'); await t2.page.click('[data-report="gem-cogs"]');
    await t2.page.waitForSelector('#dlgReport[open]');
    assert.match(await t2.page.evaluate(() => document.getElementById('repHost').shadowRoot.textContent), /Hand Hygiene in Outpatient Clinics/);
    assert.deepEqual(t2.errors, []);
  } finally { await t2.close(); }
});
