// The guideline pane: taking text from a PDF, passage links, search, Word documents,
// narrow screens, and saving from inside the Claude artifact viewer.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { ROOT, openPage, row, lastToast } = require('./harness.js');

let t, page;
const G = (fn, arg) => page.evaluate(fn, arg);
test.before(async () => { t = await openPage(); page = t.page; });
test.after(async () => { await t.close(); });
test.beforeEach(async () => { await G(() => { document.querySelectorAll('dialog[open]').forEach((d) => d.close()); document.querySelectorAll('.toast').forEach((x) => x.remove()); }); });
test.afterEach(() => assert.deepEqual(t.errors.splice(0), [], 'error in the page'));

// Drag across the PDF with the mouse from the start of one phrase to the end of another.
async function dragSelect(from, to) {
  const box = await G(([a, b]) => {
    const spans = Array.from(document.querySelectorAll('.textLayer span')).filter((s) => s.textContent.trim());
    const sa = spans.find((s) => s.textContent.includes(a)), sb = spans.find((s) => s.textContent.includes(b));
    const ra = sa.getBoundingClientRect(), rb = sb.getBoundingClientRect();
    return { ax: ra.left + 1, ay: ra.top + ra.height / 2, bx: rb.right - 1, by: rb.top + rb.height / 2 };
  }, [from, to]);
  await page.mouse.move(box.ax, box.ay); await page.mouse.down();
  await page.mouse.move((box.ax + box.bx) / 2, (box.ay + box.by) / 2, { steps: 5 });
  await page.mouse.move(box.bx, box.by, { steps: 5 });
  await page.mouse.up();
  return box;
}

test('PDF: text selected with the mouse goes into the chosen element and stays linked', async () => {
  await G(() => window.CutGL.openSample('blood-pressure'));
  await page.waitForFunction(() => window.CutGL.PDF.pages[0].tx === 2);
  const box = await dragSelect('A working group of four clinicians', 'graded each recommendation');
  assert.match(await G(() => getSelection().toString()), /^A working group of four clinicians[\s\S]*strong or conditional\.$/);
  await G(() => { const Gm = window.CutGL; let n; (function w(x) { if (x.name === 'DescriptionEvidenceCombination') n = x; x.kids.forEach(w); })(Gm.S.root); Gm.selectNode(n, { reveal: true }); });
  await row(page, 'DescriptionEvidenceCombination').click();   // clicking in the tree must not lose the selection
  assert.equal(await page.isDisabled('#tInsert'), false);
  await page.click('#tInsert');
  const r = await G(() => { const Gm = window.CutGL; const n = Gm.S.sel; return { text: n.text, source: n.source, links: Gm.S.links.filter((L) => L.node === n).map((L) => [L.page, L.quote.length > 50]) }; });
  assert.equal(r.text, 'A working group of four clinicians searched for studies published from 2010 to 2025 and graded each recommendation as strong or conditional.', 'the line break inside the selection became a space');
  assert.equal(r.source, 'explicit');
  assert.deepEqual(r.links, [[0, true]]);
  assert.equal(await page.isDisabled('#tInsert'), true);
  assert.equal(await page.isDisabled('#tAppend'), false);
  // clicking the marked passage selects its element
  await row(page, 'GuidelineDocument').click();
  await page.mouse.click(box.ax + 30, box.ay);
  assert.equal(await G(() => window.CutGL.S.sel.name), 'DescriptionEvidenceCombination');
  // Clear removes text and link
  await page.click('#tClear');
  assert.deepEqual(await G(() => { const Gm = window.CutGL; return [Gm.S.sel.text, Gm.S.sel.source, Gm.S.links.filter((L) => L.node === Gm.S.sel).length]; }), ['', 'nd', 0]);
});

test('Append and Replace', async () => {
  await G(() => window.CutGL.openSample('hand-hygiene'));
  const pick = (phrase) => G((p) => { const Gm = window.CutGL; const text = Gm.ctrText(Gm.S.flowEl); const i = text.indexOf(p); const s = getSelection(); s.removeAllRanges(); s.addRange(Gm.mkRange(Gm.S.flowEl, i, i + p.length)); }, phrase);
  await G(() => { const Gm = window.CutGL; let n; (function w(x) { if (!n && x.name === 'Users') n = x; x.kids.forEach(w); })(Gm.S.root); Gm.selectNode(n, { reveal: true }); });
  await pick('Intended users'); await page.waitForTimeout(60);
  await page.click('#tAppend');
  assert.deepEqual(await G(() => { const Gm = window.CutGL; return [Gm.S.sel.text, Gm.S.links.filter((L) => L.node === Gm.S.sel).length]; }), ['Physicians, nurses and medical assistants working in outpatient clinics. Intended users', 2]);
  await pick('medical assistants'); await page.waitForTimeout(60);
  await page.click('#tReplace');
  assert.deepEqual(await G(() => { const Gm = window.CutGL; return [Gm.S.sel.text, Gm.S.links.filter((L) => L.node === Gm.S.sel).map((L) => L.quote)]; }), ['medical assistants', ['medical assistants']]);
  await G(() => getSelection().removeAllRanges());
  await page.click('#srcScroll', { position: { x: 5, y: 5 } });
  await G(() => { const Gm = window.CutGL; let n; (function w(x) { if (!n && x.name === 'CareSetting') n = x; x.kids.forEach(w); })(Gm.S.root); Gm.selectNode(n, { reveal: true }); Gm.setPending(null); });
  await page.click('#tInsert');
  assert.match(await lastToast(page), /Select some text in the guideline first\./);
});

test('Find ignores case and line breaks, counts every match and steps through them', async () => {
  await G(() => window.CutGL.openSample('blood-pressure'));
  await page.fill('#findInput', 'STRONG recommendation');
  await page.press('#findInput', 'Enter');
  await page.waitForFunction(() => /\d+ \/ \d+/.test(document.getElementById('findCount').textContent));
  assert.equal(await page.textContent('#findCount'), '1 / 2');
  assert.equal(await G(() => window.CutGL.S.find.matches[0].page), 1, 'found on page 2 before that page was drawn');
  await page.press('#findInput', 'Enter');
  assert.equal(await page.textContent('#findCount'), '2 / 2');
  await page.press('#findInput', 'Shift+Enter');
  assert.equal(await page.textContent('#findCount'), '1 / 2');
  await page.fill('#findInput', 'comparable between visits and between clinicians'); // wraps across lines in the PDF
  await page.press('#findInput', 'Enter');
  await page.waitForFunction(() => document.getElementById('findCount').textContent === '1 / 1');
  await page.fill('#findInput', 'zebra');
  await page.press('#findInput', 'Enter');
  await page.waitForFunction(() => document.getElementById('findCount').textContent === 'No match');
  await page.fill('#findInput', '');
  assert.equal(await page.textContent('#findCount'), '');
});

test('element text can be linked back to the guideline, one element or all at once', async () => {
  await page.setInputFiles('#pickFolder', path.join(ROOT, 'demo', 'sample_blood_pressure'));
  await page.waitForFunction(() => window.CutGL.S.name === 'sample_blood_pressure' && !window.CutGL.S.example && window.CutGL.S.links.length === 24);
  await G(() => { const Gm = window.CutGL; Gm.S.links.length = 0; Gm.renderTree(); let n; (function w(x) { if (!n && x.name === 'MainFocus') n = x; x.kids.forEach(w); })(Gm.S.root); Gm.selectNode(n, { reveal: true }); });
  assert.equal(await page.isVisible('#inLocate'), true);
  await page.click('#inLocate');
  await page.waitForFunction(() => window.CutGL.S.links.length === 1);
  assert.deepEqual(await G(() => { const L = window.CutGL.S.links[0]; return [L.node.name, L.page, L.quote.startsWith('This guideline sets out')]; }), ['MainFocus', 0, true]);
  assert.equal(await page.isVisible('#inLocate'), false);
  await page.click('#mProject'); await page.click('.menu [data-act="locateAll"]');
  await page.waitForFunction(() => /Linked \d+ of \d+ unlinked elements/.test((Array.from(document.querySelectorAll('.toast')).pop() || {}).textContent || ''));
  assert.match(await lastToast(page), /^Linked 20 of 20 unlinked elements to their passages\.$/);
  const r = await G(() => { const Gm = window.CutGL; return { short: Gm.S.links.some((L) => L.node.text.length < 15), fixed: Gm.S.links.some((L) => L.node.name === 'Logic' || L.node.name === 'ActionType') }; });
  assert.deepEqual(r, { short: false, fixed: false }, 'very short text, type values and logic statements are left unlinked');
});

test('a new project from a Word .docx; an old .doc is refused with advice', async () => {
  await page.click('#mProject'); await page.click('.menu [data-act="new"]');
  const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('#newPick')]);
  await fc.setFiles(path.join(ROOT, 'tests', 'fixtures', 'guide.docx'));
  await page.waitForFunction(() => document.getElementById('newFile').textContent === 'guide.docx');
  assert.equal(await page.inputValue('#newName'), 'guide', 'the name is suggested from the file');
  await page.fill('#newName', 'word project ' + Date.now());
  await page.click('#newGo');
  await page.waitForFunction(() => /^word project/.test(window.CutGL.S.name) && window.CutGL.S.flowEl);
  const r = await G(() => { const Gm = window.CutGL; let n = 0; walkTree(Gm.S.root, () => { n++; }); return { type: Gm.S.src.type, n, text: Gm.ctrText(Gm.S.flowEl) }; });
  assert.equal(r.type, 'docx');
  assert.equal(r.n, 163);
  assert.match(r.text, /Asthma Care in Adults[\s\S]*Review inhaler technique at every visit\./);
  await G(() => { const dt = new DataTransfer(); dt.items.add(new File([new Uint8Array([1, 2, 3])], 'old.doc')); document.querySelector('.menu [data-act="attach"]').click(); const inp = document.getElementById('pickDoc'); inp.files = dt.files; inp.dispatchEvent(new Event('change')); });
  await page.waitForSelector('.toast.err');
  assert.match(await lastToast(page), /Old Word \.doc files cannot be read here\. Save the guideline as \.docx, RTF or PDF/);
  t.errors.splice(0); // the refusal is also logged to the console on purpose
});

test('the libraries load from their second source when the first is unreachable', async () => {
  const t2 = await openPage({ blockFirstCdn: true });
  try {
    await t2.page.evaluate(() => window.CutGL.openSample('blood-pressure'));
    await t2.page.waitForFunction(() => window.CutGL.PDF.pages.length === 2 && window.CutGL.PDF.pages[0].tx === 2);
    assert.equal(await t2.page.evaluate(() => window.CutGL.S.links.length), 24);
  } finally { await t2.close(); }
});

test('phone width: one panel at a time, nothing wider than the screen, in the dark theme too', async () => {
  const t2 = await openPage({ viewport: { width: 400, height: 780 }, colorScheme: 'dark' });
  try {
    const p = t2.page;
    const fits = () => p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert.equal(await fits(), true);
    assert.deepEqual(await p.evaluate(() => ['paneSrc', 'paneTree', 'paneInsp'].map((id) => getComputedStyle(document.getElementById(id)).display !== 'none')), [true, false, false]);
    await p.click('.tabs [data-tab="tree"]');
    assert.deepEqual(await p.evaluate(() => ['paneSrc', 'paneTree', 'paneInsp'].map((id) => getComputedStyle(document.getElementById(id)).display !== 'none')), [false, true, false]);
    assert.equal(await fits(), true);
    await p.evaluate(() => window.CutGL.openSample('blood-pressure'));
    await p.click('.tabs [data-tab="src"]');
    await p.waitForFunction(() => window.CutGL.PDF.pages[0] && window.CutGL.PDF.pages[0].tx === 2);
    assert.equal(await fits(), true);
    assert.ok(await p.evaluate(() => document.querySelector('.pg').getBoundingClientRect().width <= 400));
    assert.deepEqual(t2.errors, []);
  } finally { await t2.close(); }
});

test('inside the Claude artifact viewer: files go through its save prompt, XML is zipped, Print is hidden', async () => {
  const init = () => {
    window.__saved = [];
    const allowed = /\.(gif|png|jpe?g|webp|mp4|webm|txt|json|md|docx|pptx|epub|csv|ttf|html|svg|pdf|xlsx|zip)$/i;
    const downloads = Object.freeze({ save: async (req) => {
      if (!allowed.test(req.filename)) throw { code: 'rejected_extension', message: 'extension not allowed' };
      window.__saved.push(req.filename);
      return { status: 'saved' };
    } });
    window.claude = { use: (name) => Promise.resolve(name === 'downloads' ? downloads : null) };
  };
  const t2 = await openPage({ init });
  try {
    const p = t2.page;
    await p.click('.bar-right [data-act="save"]');
    await p.waitForFunction(() => window.__saved.length === 1);
    await p.click('#mProject'); await p.click('.menu [data-act="exportXml"]');
    await p.waitForFunction(() => window.__saved.length === 2);
    await p.click('#mReport'); await p.click('[data-report="action"]');
    await p.waitForSelector('#dlgReport[open]');
    assert.equal(await p.isVisible('#repPrint'), false);
    await p.click('#repSave');
    await p.waitForFunction(() => window.__saved.length === 3);
    assert.deepEqual(await p.evaluate(() => window.__saved), ['sample_hand_hygiene.zip', 'sample_hand_hygiene-xml.zip', 'sample_hand_hygiene_Actions_Report.html']);
    assert.deepEqual(t2.errors, []);
  } finally { await t2.close(); }
});
