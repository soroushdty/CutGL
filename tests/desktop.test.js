// Projects written by the desktop application. The fixtures in tests/fixtures/desktop/ were made by
// scripts/java/MakeFixture.java with the JDK's own XMLEncoder, object serialisation and Swing text
// documents, so tree model, linkbean and link offsets are in the real formats.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT, openPage } = require('./harness.js');

const FIX = path.join(ROOT, 'tests', 'fixtures', 'desktop');
let t, page;
test.before(async () => { t = await openPage(); page = t.page; });
test.after(async () => { await t.close(); });
test.afterEach(() => assert.deepEqual(t.errors.splice(0), [], 'error in the page'));

async function openFixture(name) {
  await page.setInputFiles('#pickFolder', path.join(FIX, name));
  await page.waitForFunction((n) => window.CutGL.S.name === n && window.CutGL.S.flowEl && /Kept in this browser/.test(document.getElementById('stSave').textContent), name);
  return page.evaluate(() => {
    const G = window.CutGL;
    const text = G.ctrText(G.S.flowEl);
    return { text, type: G.S.src.type, links: G.S.links.map((L) => ({ name: L.node.name, start: L.start, end: L.end, words: text.slice(L.start, L.end), nodeText: L.node.text })), toast: Array.from(document.querySelectorAll('.toast')).pop().textContent, tree: serializeGem(G.S.root) };
  });
}
const squash = (s) => s.replace(/\s+/g, ' ').trim();

test('plain-text project: same text as the desktop pane, links at the same offsets', async () => {
  const swing = fs.readFileSync(path.join(FIX, 'txtproj', 'swing-text.txt'), 'utf8');
  const expected = JSON.parse(fs.readFileSync(path.join(FIX, 'txtproj', 'expected.json'), 'utf8'));
  const r = await openFixture('txtproj');
  assert.equal(r.type, 'text');
  assert.equal(r.text, swing, 'CRLF line endings are read as the desktop reads them');
  assert.deepEqual(r.links.map((L) => [L.name, L.start, L.end]), expected.map((e) => [e.name, e.start, e.end]));
  assert.match(r.toast, /3 passage links restored\.$/);
  // element text is kept exactly as the desktop stored it, line break included
  assert.equal(r.links[1].nodeText, 'Adults with persistent asthma should be offered an inhaled cortico-\nsteroid as first-line controller therapy.');
  assert.match(r.tree, /<GuidelineTitle id="1" source="explicit">Asthma Care in Adults<\/GuidelineTitle>/);
});

test('RTF project: text and link offsets match the desktop RTF reader', async () => {
  const swing = fs.readFileSync(path.join(FIX, 'rtfproj', 'swing-text.txt'), 'utf8');
  const expected = JSON.parse(fs.readFileSync(path.join(FIX, 'rtfproj', 'expected.json'), 'utf8'));
  const r = await openFixture('rtfproj');
  assert.equal(r.type, 'rtf');
  assert.equal(r.text, swing, 'control words, \\u escapes, code-page bytes and skipped groups');
  assert.deepEqual(r.links.map((L) => [L.name, L.start, L.end]), expected.map((e) => [e.name, e.start, e.end]));
});

test('HTML project: links land on the same words although the offsets differ', async () => {
  const swing = fs.readFileSync(path.join(FIX, 'htmlproj', 'swing-text.txt'), 'utf8');
  const expected = JSON.parse(fs.readFileSync(path.join(FIX, 'htmlproj', 'expected.json'), 'utf8'));
  const r = await openFixture('htmlproj');
  assert.equal(r.type, 'html');
  assert.equal(r.links.length, 3);
  r.links.forEach((L, i) => assert.equal(squash(L.words), squash(swing.slice(expected[i].start, expected[i].end)), 'link ' + i));
  assert.equal(r.text.includes('color:red'), false, 'style and script content of the guideline is not shown');
});

test('linkbean reader: a Java-serialised ArrayList of LinkBean objects', async () => {
  const bytes = Array.from(fs.readFileSync(path.join(FIX, 'txtproj', 'resources', 'linkbean')));
  const links = await page.evaluate((b) => readLegacyLinks(new Uint8Array(b)), bytes);
  assert.deepEqual(links.map((L) => [L.start, L.end, L.index, L.path.join('/')]), [[0, 21, 0, '0/0'], [85, 194, 0, '1/0'], [213, 253, 1, '1/1']]);
  assert.equal(links[0].label, '<GuidelineTitle> Asthma Care in Adults ');
  assert.equal(await page.evaluate(() => { try { readLegacyLinks(new Uint8Array([1, 2, 3, 4])); return 'no error'; } catch (e) { return e.message; } }), 'not a Java object stream');
});

test('tree model writer: what the page writes reads back to the same tree', async () => {
  const same = await page.evaluate(async () => {
    const G = window.CutGL;
    await G.openSample('inhaler-review');
    const xml = serializeTreeModel(G.S.root);
    const back = parseTreeModel(xml);
    return { equal: serializeGem(back) === serializeGem(G.S.root), head: xml.slice(0, 160), codeset: /attributeCodeSetProperty/.test(xml) };
  });
  assert.equal(same.equal, true);
  assert.match(same.head, /<java version="[^"]+" class="java\.beans\.XMLDecoder">\s+<object class="javax\.swing\.tree\.DefaultTreeModel">/);
  assert.equal(same.codeset, false, 'no code set attribute until one is chosen, as in the desktop app');
});

test('GEM XML layout: one element per line, no indentation, attributes in the desktop order', async () => {
  const xml = await page.evaluate(() => {
    const root = mkNode('GuidelineDocument');
    const rec = addKid(root, mkNode('Recommendation', 'Offer <x> & "y"', 'explicit', '2'));
    addKid(rec, mkNode('StatementOfFact'));
    const code = addKid(rec, mkNode('ActionCode', '  12345 ', 'inferred', '1', 'SNOMED-CT'));
    addKid(rec, mkNode('ActionCode'));
    return serializeGem(root);
  });
  assert.equal(xml, '<?xml version="1.0" encoding="UTF-8"?><GuidelineDocument xmlns="http://gem.yale.edu" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://gem.yale.edu gemschemaiii.xsd">\n' +
    '<Recommendation id="2" source="explicit">Offer &lt;x&gt; &amp; "y"<StatementOfFact id="1" source="nd"/>\n' +
    '<ActionCode codeset="SNOMED-CT" id="1" source="inferred">12345</ActionCode>\n' +
    '<ActionCode id="1" source="nd"/>\n' +
    '</Recommendation>\n</GuidelineDocument>\n');
});
