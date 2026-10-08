// Opening a document from a link, and viewer mode.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT, openPage, lastToast } = require('./harness.js');

const BP = 'demo/sample_blood_pressure/';
const toolsShown = (page) => page.evaluate(() => getComputedStyle(document.querySelector('.tools .tool-group')).display !== 'none');

test('?xml=…&guideline=… opens the document for reading, linked to its guideline', async () => {
  const t = await openPage({ query: '?xml=' + BP + 'sample_blood_pressure.xml&guideline=' + BP + 'blood_pressure.pdf' });
  const { page } = t;
  try {
    const s = await page.evaluate(() => ({ name: window.CutGL.S.name, view: window.CutGL.S.view, filled: window.CutGL.S.filled, type: window.CutGL.S.src.type, links: window.CutGL.S.links.length }));
    assert.deepEqual(s, { name: 'sample_blood_pressure', view: true, filled: true, type: 'pdf', links: 24 });
    assert.match(await lastToast(page), /^Opened sample_blood_pressure\.xml: 305 elements, 24 passages linked in the guideline\.$/);
    // reading only: the editing tools are put away, the text cannot be typed in, editing actions are refused
    assert.equal(await toolsShown(page), false);
    assert.equal(await page.getAttribute('#modeView', 'aria-pressed'), 'true');
    await page.locator('#tree .row', { hasText: 'Measure blood pressure after' }).first().click();
    assert.equal(await page.evaluate(() => document.getElementById('inText').readOnly), true);
    assert.equal(await page.isDisabled('#srcExplicit'), true);
    assert.equal(await page.evaluate(() => document.querySelector('#tree .row[draggable="true"]')), null);
    // the reports and the XML view still work
    await page.click('#mReport'); await page.click('.menu [data-report="recs"]');
    await page.waitForSelector('#dlgReport[open]');
    await page.click('#dlgReport [data-close]');
    // nothing from a link is put into this browser's storage
    assert.equal(await page.evaluate(() => localStorage.getItem('cutgl:last')), null);
    // the link can be copied
    await page.click('#mView');
    assert.equal(await page.isVisible('#copyLink'), true);
    // Edit brings the tools back
    await page.click('#modeEdit');
    assert.equal(await toolsShown(page), true);
    assert.equal(await page.evaluate(() => document.getElementById('inText').readOnly), false);
    assert.deepEqual(t.errors, []);
  } finally { await t.close(); }
});

test('?project=… opens a zipped project from another site; &edit opens it for editing', async () => {
  const JSZip = require('jszip');
  const zip = new JSZip();
  const dir = path.join(ROOT, 'demo', 'sample_hand_hygiene');
  (function add(d, rel) {
    for (const f of fs.readdirSync(d)) {
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) add(full, rel + f + '/'); else zip.file(rel + f, fs.readFileSync(full));
    }
  })(dir, 'sample_hand_hygiene/');
  const body = await zip.generateAsync({ type: 'nodebuffer' });
  const routes = [[/^https:\/\/files\.example\/hygiene\.zip$/, (route) => route.fulfill({ body, contentType: 'application/zip', headers: { 'access-control-allow-origin': '*' } })]];
  const t = await openPage({ query: '?project=https://files.example/hygiene.zip&edit', routes });
  try {
    const s = await t.page.evaluate(() => ({ name: window.CutGL.S.name, view: window.CutGL.S.view, links: window.CutGL.S.links.length }));
    assert.deepEqual(s, { name: 'sample_hand_hygiene', view: false, links: 15 });
    assert.equal(await toolsShown(t.page), true);
    assert.deepEqual(t.errors, []);
  } finally { await t.close(); }
});

test('?sample=… opens a sample for reading', async () => {
  const t = await openPage({ query: '?sample=inhaler-review' });
  try {
    assert.deepEqual(await t.page.evaluate(() => [window.CutGL.S.name, window.CutGL.S.view]), ['sample_inhaler_review', true]);
    assert.deepEqual(t.errors, []);
  } finally { await t.close(); }
});

test('a link that cannot be loaded says so and the page still opens', async () => {
  const t = await openPage({ query: '?xml=demo/no_such_file.xml' });
  try {
    assert.match(await t.page.textContent('#toasts'), /The document in the link could not be opened\. Could not load http:\/\/127\.0\.0\.1:\d+\/demo\/no_such_file\.xml \(HTTP 404\)\./);
    assert.equal(await t.page.evaluate(() => window.CutGL.S.name), 'sample_hand_hygiene');
    t.errors.splice(0); // the failure is also logged to the console on purpose
  } finally { await t.close(); }
});
