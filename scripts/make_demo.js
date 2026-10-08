// Writes demo/<sample>/ for each sample project in src/samples.js, as project folders in the
// desktop app's layout. The page itself builds each sample and lists its files; this script only
// saves them. Run after changing a sample:
//
//     python3 scripts/make_sample_pdf.py    (only if the PDF sample's text changed)
//     node scripts/make_demo.js
const fs = require('fs');
const path = require('path');
const { ROOT, openPage } = require('../tests/harness.js');

(async () => {
  const t = await openPage();
  const ids = await t.page.evaluate(() => SAMPLES.map((s) => s.id));
  for (const id of ids) {
    const out = await t.page.evaluate(async (sampleId) => {
      const G = window.CutGL;
      await G.openSample(sampleId);
      const files = G.projectFiles().map((f) => {
        if (typeof f.data === 'string') return { path: f.path, text: f.data };
        let bin = '';
        const u8 = new Uint8Array(f.data);
        for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
        return { path: f.path, base64: btoa(bin) };
      });
      return { name: G.S.name, files };
    }, id);
    const dir = path.join(ROOT, 'demo', out.name);
    fs.rmSync(dir, { recursive: true, force: true });
    for (const f of out.files) {
      const file = path.join(dir, f.path);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      if (f.base64) { fs.writeFileSync(file, Buffer.from(f.base64, 'base64')); continue; }
      let text = f.text;
      // fixed dates, so regenerating the demos changes nothing unless a sample changed
      if (f.path.endsWith('project.properties')) text = text.replace(/^#(?!$).*$/m, '#Sample project for CutGL');
      if (f.path.endsWith('cutgl.json')) text = text.replace(/"saved":"[^"]*"/, '"saved":"2026-10-07T00:00:00.000Z"');
      fs.writeFileSync(file, text);
    }
    console.log('wrote demo/' + out.name + ' (' + out.files.length + ' files)');
  }
  await t.close();
})().catch((e) => { console.error(e); process.exit(1); });
