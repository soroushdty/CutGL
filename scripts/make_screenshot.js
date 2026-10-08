// Takes docs/screenshot.png: the blood-pressure sample with its third recommendation selected.
//     node scripts/make_screenshot.js
const path = require('path');
const { ROOT, openPage } = require('../tests/harness.js');

(async () => {
  const t = await openPage({ viewport: { width: 1360, height: 820 } });
  const { page } = t;
  await page.evaluate(() => window.CutGL.openSample('blood-pressure'));
  await page.click('#filledOnly');
  await page.evaluate(() => {
    const G = window.CutGL;
    const recs = G.S.root.kids.find((k) => k.name === 'KnowledgeComponents').kids.filter((k) => k.name === 'Recommendation');
    recs[2].open = true;
    recs[2].kids.find((k) => k.name === 'Conditional').open = true;
    G.renderTree();
    G.selectNode(recs[2], { reveal: true });
    document.querySelector('#tree .row.sel').scrollIntoView({ block: 'center' });
  });
  await page.click('.link-go');
  await page.waitForFunction(() => window.CutGL.PDF.pages[1].tx === 2);
  await page.waitForTimeout(500);
  await page.evaluate(() => { document.querySelectorAll('.toast').forEach((x) => x.remove()); document.getElementById('srcScroll').scrollTop -= 60; });
  await page.screenshot({ path: path.join(ROOT, 'docs', 'screenshot.png') });
  await t.close();
})().catch((e) => { console.error(e); process.exit(1); });
