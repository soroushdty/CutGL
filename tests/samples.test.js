// The sample projects, the demo folders made from them, and saving / reopening a project.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT, openPage, lastToast } = require('./harness.js');

let t, page;
test.before(async () => { t = await openPage(); page = t.page; });
test.after(async () => { await t.close(); });
test.afterEach(() => assert.deepEqual(t.errors.splice(0), [], 'error in the page'));

const state = () => page.evaluate(() => {
  const G = window.CutGL;
  let total = 0, filled = 0;
  (function walk(n) { total++; if (n.text.trim()) filled++; n.kids.forEach(walk); })(G.S.root);
  return { name: G.S.name, type: G.S.src.type, total, filled, links: G.S.links.length, linkedNodes: new Set(G.S.links.map((L) => L.node)).size, xml: serializeGem(G.S.root) };
});

test('the page opens on the first sample, marked as a sample', async () => {
  const s = await state();
  assert.equal(s.name, 'sample_hand_hygiene');
  assert.equal(await page.isVisible('#projTag'), true);
  assert.equal(await page.isVisible('#srcHint'), true);
  assert.match(await page.textContent('#stCounts'), /^234 elements · 19 with text · 15 linked passages$/);
});

for (const [id, name, type, links] of [['hand-hygiene', 'sample_hand_hygiene', 'text', 15], ['inhaler-review', 'sample_inhaler_review', 'html', 28], ['blood-pressure', 'sample_blood_pressure', 'pdf', 24]]) {
  test('sample ' + id + ': every marked passage is found in its guideline', async () => {
    await page.evaluate((x) => window.CutGL.openSample(x), id);
    const s = await state();
    assert.equal(s.name, name);
    assert.equal(s.type, type);
    assert.equal(s.links, links);
    assert.equal(s.linkedNodes, links);
    // each link covers exactly the words stored in its element (or, for an appended element, part of them)
    const bad = await page.evaluate(() => {
      const G = window.CutGL;
      const sq = (x) => G.foldText(x).t;
      return G.S.links.filter((L) => !sq(L.node.text).includes(sq(L.quote))).map((L) => L.node.name + ': ' + L.quote);
    });
    assert.deepEqual(bad, []);
  });

  test('demo/' + name + ' opens as a project folder and matches the sample', async () => {
    await page.evaluate((x) => window.CutGL.openSample(x), id);
    const want = await state();
    assert.equal(want.xml, fs.readFileSync(path.join(ROOT, 'demo', name, name + '.xml'), 'utf8'), 'demo XML is out of date: run npm run demo');
    await page.setInputFiles('#pickFolder', path.join(ROOT, 'demo', name));
    await page.waitForFunction((n) => window.CutGL.S.name === n && !window.CutGL.S.example && /Kept in this browser/.test(document.getElementById('stSave').textContent), name);
    const got = await state();
    assert.equal(got.xml, want.xml);
    assert.equal(got.links, want.links);
    assert.equal(got.type, type);
    assert.equal(await page.isVisible('#projTag'), false, 'an opened folder is not a sample');
  });
}

test('Save project writes a zip in the desktop layout that opens again unchanged', async () => {
  await page.evaluate(() => window.CutGL.openSample('blood-pressure'));
  const before = await state();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.bar-right [data-act="save"]')]);
  assert.equal(dl.suggestedFilename(), 'sample_blood_pressure.zip');
  const zipPath = path.join(fs.mkdtempSync(path.join(require('os').tmpdir(), 'cutgl-')), 'p.zip');
  await dl.saveAs(zipPath);
  const names = Object.keys((await require('jszip').loadAsync(fs.readFileSync(zipPath))).files).filter((n) => !n.endsWith('/')).sort();
  assert.deepEqual(names, ['sample_blood_pressure/blood_pressure.pdf', 'sample_blood_pressure/resources/GEMCutterTreeModel.xml', 'sample_blood_pressure/resources/cutgl.json', 'sample_blood_pressure/resources/project.properties', 'sample_blood_pressure/sample_blood_pressure.xml']);
  await page.evaluate(() => window.CutGL.openSample('hand-hygiene'));
  await page.setInputFiles('#pickFile', zipPath);
  await page.waitForFunction(() => window.CutGL.S.name === 'p' || window.CutGL.S.name === 'sample_blood_pressure');
  await page.waitForFunction(() => window.CutGL.S.links.length === 24);
  const after = await state();
  assert.equal(after.name, 'sample_blood_pressure');
  assert.equal(after.xml, before.xml);
});

test('a project is kept in the browser and comes back after a reload', async () => {
  await page.setInputFiles('#pickFolder', path.join(ROOT, 'demo', 'sample_inhaler_review'));
  await page.waitForFunction(() => window.CutGL.S.name === 'sample_inhaler_review' && !window.CutGL.S.example);
  await page.waitForFunction(() => /Kept in this browser/.test(document.getElementById('stSave').textContent));
  const before = await state();
  await page.reload();
  await page.waitForFunction(() => window.CutGL && window.CutGL.S.root && window.CutGL.S.name === 'sample_inhaler_review' && window.CutGL.S.flowEl);
  const after = await state();
  assert.equal(after.xml, before.xml);
  assert.equal(after.links, 28);
  assert.equal(await page.isVisible('#projTag'), false);
  // the Open dialog lists it, and the three samples
  await page.click('#mProject'); await page.click('.menu [data-act="open"]');
  await page.waitForSelector('#dlgOpen[open]');
  assert.equal((await page.$$eval('#openList .p-name', (els) => els.map((e) => e.textContent)))[0], 'sample_inhaler_review', 'most recent first');
  assert.deepEqual(await page.$$eval('#sampleList .p-name', (els) => els.map((e) => e.textContent)), ['Hand hygiene', 'Inhaler technique review', 'Blood pressure measurement']);
  await page.click('#sampleList li:nth-child(1) .p-open');
  await page.waitForFunction(() => window.CutGL.S.name === 'sample_hand_hygiene' && window.CutGL.S.links.length === 15);
  assert.ok(await lastToast(page) !== undefined);
});
