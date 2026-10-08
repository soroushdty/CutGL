// Editing the element tree: subtrees, element text, code sets, the logic window, drag and drop,
// GEM XML in and out, and the GEM II to GEM III step.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { openPage, row, lastToast } = require('./harness.js');

let t, page;
const G = (fn, arg) => page.evaluate(fn, arg);
test.before(async () => { t = await openPage(); page = t.page; });
test.after(async () => { await t.close(); });
test.beforeEach(async () => { await G(() => { document.querySelectorAll('dialog[open]').forEach((d) => d.close()); document.querySelectorAll('.toast').forEach((x) => x.remove()); return window.CutGL.openSample('hand-hygiene'); }); });
test.afterEach(() => assert.deepEqual(t.errors.splice(0), [], 'error in the page'));

const recs = () => G(() => window.CutGL.S.root.kids.find((k) => k.name === 'KnowledgeComponents').kids.filter((k) => k.name === 'Recommendation').map((r) => ({ id: r.id, text: r.text, kids: r.kids.map((k) => k.name) })));
const selectByName = (name, nth = 0) => G(([n, i]) => { const Gm = window.CutGL; const hits = []; (function w(x) { if (x.name === n) hits.push(x); x.kids.forEach(w); })(Gm.S.root); Gm.selectNode(hits[i], { reveal: true }); }, [name, nth]);

test('toolbar follows the desktop rules: Insert on empty elements, Append / Replace / Clear on filled ones', async () => {
  const buttons = () => G(() => ['tInsert', 'tAppend', 'tReplace', 'tClear', 'tAdd', 'tDel', 'tLogic'].map((id) => (document.getElementById(id).disabled ? '-' : '+')).join(''));
  await selectByName('GuidelineTitle'); assert.equal(await buttons(), '-+++++-');
  await selectByName('Citation'); assert.equal(await buttons(), '+---++-');
  await selectByName('GuidelineDocument'); assert.equal(await buttons(), '-------');
  await selectByName('ActionType'); assert.equal(await buttons(), '----++-');
  await selectByName('Conditional'); assert.equal(await buttons(), '+---+++');
  await selectByName('Logic'); assert.equal((await buttons()).slice(-1), '+');
});

test('Subtree adds a blank copy after the element with the next free id; Delete removes it', async () => {
  await selectByName('Recommendation');
  await page.click('#tAdd');
  let r = await recs();
  assert.equal(r.length, 3);
  assert.deepEqual([r[1].id, r[1].text], ['3', '']);
  assert.deepEqual(r[1].kids, ['StatementOfFact', 'Conditional', 'Imperative', 'RecommendationNotes']);
  assert.equal(await G(() => window.CutGL.S.sel.kids[1].id), '3', 'children take the next id of their own element name');
  await page.click('#tDel');
  assert.equal((await recs()).length, 2);
  assert.equal(await page.isVisible('#dlgConfirm'), false, 'an empty subtree goes without a prompt');
});

test('Delete refuses the last element of a kind and asks before removing text', async () => {
  await selectByName('Developer');
  await page.click('#tDel');
  assert.match(await lastToast(page), /Cannot remove the last <Developer> element\./);
  await selectByName('Recommendation', 1);
  await page.click('#tDel');
  await page.waitForSelector('#dlgConfirm[open]');
  assert.match(await page.textContent('#cfMsg'), /hold text in \d+ elements/);
  await page.click('#cfNo');
  assert.equal((await recs()).length, 2);
  await page.click('#tDel'); await page.click('#cfYes');
  assert.equal((await recs()).length, 1);
  assert.equal(await G(() => window.CutGL.S.links.some((L) => /visibly soiled/.test(L.quote))), false, 'its passage links go with it');
});

test('typing element text marks it inferred; the source can be set by hand', async () => {
  await selectByName('Rationale');
  await page.fill('#inText', 'Reduce infections passed between patients.');
  assert.deepEqual(await G(() => { const n = window.CutGL.S.sel; return [n.text, n.source, document.querySelector('#tree .row.sel .txt').textContent]; }), ['Reduce infections passed between patients.', 'inferred', 'Reduce infections passed between patients.']);
  await page.click('#inSource label:has(#srcExplicit)');
  assert.equal(await G(() => window.CutGL.S.sel.source), 'explicit');
  assert.equal(await page.isVisible('#projTag'), false, 'an edited sample is no longer marked as a sample');
});

test('code elements take a code set; ActionType takes a value from the fixed list', async () => {
  await selectByName('DecisionVariableCode', 1);
  await page.fill('#inCode', 'SNOMED-CT');
  await page.fill('#inText', '271618001');
  assert.match(await G(() => serializeGem(window.CutGL.S.root)), /<DecisionVariableCode codeset="SNOMED-CT" id="2" source="inferred">271618001<\/DecisionVariableCode>/);
  await selectByName('ActionType', 1);
  assert.equal(await page.isDisabled('#inText'), true);
  await page.selectOption('#inType', 'prescribe');
  assert.deepEqual(await G(() => [window.CutGL.S.sel.text, window.CutGL.S.sel.source]), ['prescribe', 'explicit']);
});

test('logic window: loads a Conditional, inserts operators and variables, saves in the desktop format', async () => {
  await selectByName('Conditional', 1);
  await page.click('#tLogic');
  await page.waitForSelector('#dlgLogic[open]');
  assert.equal(await page.inputValue('#lgIf'), 'hands are visibly soiled is [true]');
  assert.equal(await page.inputValue('#lgThen'), 'wash them with soap and water for at least 20 seconds');
  assert.deepEqual(await page.$$eval('#lgDvs li', (els) => els.map((e) => e.textContent)), ['hands are visibly soiled is [true]']);
  await page.focus('#lgIf'); await page.keyboard.press('Control+End');
  await page.click('#lgIfBox .ops [data-op="AND"]');
  await page.click('#lgIfBox .ops [data-op="NOT"]');
  await page.click('#lgDvs li');
  await page.click('#lgSave');
  assert.deepEqual(await G(() => { const l = window.CutGL.S.sel.kids.find((k) => k.name === 'Logic'); return [l.text, l.source]; }),
    ['If \nhands are visibly soiled is [true]\nAND\nNOT hands are visibly soiled is [true]\nThen \nwash them with soap and water for at least 20 seconds', 'inferred']);
});

test('logic window on an Imperative: If is off and Then starts from the directives', async () => {
  await selectByName('Imperative');
  await page.click('#tLogic');
  await page.waitForSelector('#dlgLogic[open]');
  assert.equal(await page.textContent('#dlgLogicT'), 'Imperative');
  assert.equal(await page.isDisabled('#lgIf'), true);
  assert.equal(await page.isVisible('#lgDvBox'), false);
  assert.equal(await page.inputValue('#lgThen'), 'clean their hands with an alcohol-based hand rub before and after every patient contact');
  await page.click('#lgSave');
  assert.equal(await G(() => window.CutGL.S.sel.kids.find((k) => k.name === 'Logic').text), 'If \nThen \nclean their hands with an alcohol-based hand rub before and after every patient contact');
});

test('drag and drop: only Conditional and Imperative move, onto a Recommendation or beside another', async () => {
  await page.click('#mView'); await page.click('[data-act="collapseAll"]');
  await row(page, 'KnowledgeComponents').locator('.tw').click();
  await row(page, 'Recommendation', 1).locator('.tw').click();
  const drag = async (from, to) => {
    const a = await from.boundingBox(), b = await to.boundingBox();
    await page.mouse.move(a.x + 120, a.y + a.height / 2); await page.mouse.down();
    await page.mouse.move(a.x + 130, a.y + a.height / 2 - 6, { steps: 4 });
    await page.mouse.move(b.x + 140, b.y + b.height / 2, { steps: 8 });
    await page.mouse.move(b.x + 150, b.y + b.height / 2 + 2, { steps: 3 });
    await page.waitForTimeout(120);
    await page.mouse.up();
  };
  await drag(row(page, 'Conditional', 0), row(page, 'Recommendation', 0));
  let r = await recs();
  assert.deepEqual(r[0].kids.slice(0, 3), ['Conditional', 'StatementOfFact', 'Conditional']);
  assert.equal(r[1].kids.includes('Conditional'), false);
  await drag(row(page, 'Identity'), row(page, 'Recommendation', 0));
  assert.equal(await G(() => window.CutGL.S.root.kids[0].name), 'Identity');
  assert.deepEqual(await G(() => [canDrop(mkNode('Identity'), mkNode('Recommendation')), isDraggable(window.CutGL.S.root)]), [false, false]);
});

test('View XML shows what Export writes, and importing it gives the same document', async () => {
  const before = await G(() => serializeGem(window.CutGL.S.root));
  await page.click('#mView'); await page.click('[data-act="viewXml"]');
  await page.waitForSelector('#dlgText[open]');
  assert.equal(await page.textContent('#xmlBody'), before);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#xmlSave')]);
  assert.equal(dl.suggestedFilename(), 'sample_hand_hygiene.xml');
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cutgl-')), 'round_trip.xml');
  await dl.saveAs(file);
  assert.equal(fs.readFileSync(file, 'utf8'), before);
  await page.click('#dlgText [data-close]');
  await page.setInputFiles('#pickFile', file);
  await page.waitForFunction(() => window.CutGL.S.name === 'round_trip');
  assert.equal(await G(() => serializeGem(window.CutGL.S.root)), before);
  assert.equal(await page.isVisible('#srcEmpty'), true, 'an XML file brings no guideline; the page offers to attach one');
});

test('a file that is not GEM XML is refused with the reason', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cutgl-'));
  fs.writeFileSync(path.join(dir, 'other.xml'), '<?xml version="1.0"?><note><to>x</to></note>');
  await page.setInputFiles('#pickFile', path.join(dir, 'other.xml'));
  await page.waitForSelector('.toast.err');
  assert.match(await lastToast(page), /not a GEM file: its root element is <note>/);
  fs.writeFileSync(path.join(dir, 'broken.xml'), '<GuidelineDocument><Identity></GuidelineDocument>');
  await G(() => document.querySelectorAll('.toast').forEach((x) => x.remove()));
  await page.setInputFiles('#pickFile', path.join(dir, 'broken.xml'));
  await page.waitForSelector('.toast.err');
  assert.match(await lastToast(page), /not well-formed XML/);
  t.errors.splice(0); // both refusals are also logged to the console on purpose
});

test('GEM II to GEM III: missing GEM III elements are added in schema order, text is kept', async () => {
  const gem3 = await G(() => serializeGem(window.CutGL.S.root));
  const gem2 = gem3.replace(/<(GEMCutHistory|BenefitHarmAssessment|StatementOfFact|COIPolicy|COIDisclosure|PatientAndPublicInvolvement|RecommendationNotes|IntentionalVagueness|DecisionVariableCode|ActionCode|DirectiveCode|ScopeCode|MemberConflict|MemberRole)\b[^>]*?(\/>|>[\s\S]*?<\/\1>)\n?/g, '');
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cutgl-')), 'older.xml');
  fs.writeFileSync(file, gem2);
  await page.setInputFiles('#pickFile', file);
  await page.waitForFunction(() => window.CutGL.S.name === 'older');
  assert.equal(await G(() => looksLikeGem2(window.CutGL.S.root)), true);
  assert.equal(await page.isVisible('.toast button'), true, 'the page offers the conversion');
  // a GEM XML opens for reading; the conversion changes the document, so it waits for Edit
  assert.equal(await G(() => window.CutGL.S.view), true);
  await page.click('#mProject'); await page.click('.menu [data-act="convert"]');
  assert.equal(await lastToast(page), 'Switch to Edit to change the document.');
  await page.click('#modeEdit');
  await page.click('#mProject'); await page.click('.menu [data-act="convert"]');
  assert.match(await lastToast(page), /Added 31 GEM III elements that were missing\./);
  const r = await G(() => { const Gm = window.CutGL; const names = (n) => [n.name, n.kids.map(names)]; const want = (function w(s) { return [s.name, s.children.map(w)]; })(Gm.schema.root); return { identity: JSON.stringify(names(Gm.S.root.kids[0])) === JSON.stringify(want[1][0]), gem2: looksLikeGem2(Gm.S.root), title: Gm.S.root.kids[0].kids[0].text }; });
  assert.deepEqual(r, { identity: true, gem2: false, title: 'Hand Hygiene in Outpatient Clinics' });
  await page.click('#mProject'); await page.click('.menu [data-act="convert"]');
  assert.match(await lastToast(page), /Nothing to add/);
});

test('the blank tree is the GEM III schema, every element once', async () => {
  const r = await G(() => { const root = instantiate(window.CutGL.schema.root); let n = 0; const names = new Set(); walkTree(root, (x) => { n++; names.add(x.name); }); return { n, names: names.size, top: root.kids.map((k) => k.name), def: window.CutGL.schema.byName.GuidelineTitle.doc }; });
  assert.equal(r.n, 163);
  assert.deepEqual(r.top, ['Identity', 'Developer', 'Purpose', 'IntendedAudience', 'MethodOfDevelopment', 'TargetPopulation', 'KnowledgeComponents', 'Testing', 'RevisionPlan', 'ImplementationPlan']);
  assert.equal(r.def, 'Complete title of the guideline');
});
