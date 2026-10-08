// =====================================================================
// CutGL: interface
// =====================================================================
(function () {
  'use strict';

  // Libraries are fetched only when first needed. Each has a second source in case the first is unreachable.
  const CDN = {
    pdfjs: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js'],
    pdfworker: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js', 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'],
    jszip: ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'],
    mammoth: ['https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js', 'https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js'],
    xslt: ['https://cdn.jsdelivr.net/npm/xslt-polyfill@1.0.29/xslt-polyfill.min.js', 'https://unpkg.com/xslt-polyfill@1.0.29/xslt-polyfill.min.js'],
    cmaps: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
    stdfonts: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/',
  };
  const REPORTS = { recs: 'Recommendations', detailed: 'Detailed', rules: 'Rules', dvs: 'Decision Variables', action: 'Actions', 'gem-cogs': 'GEM-COGS' };
  const NativeXSLT = window.XSLTProcessor;
  const IN_VIEWER = !!(window.claude && typeof window.claude.use === 'function');

  const $ = (id) => document.getElementById(id);
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k === 'text') e.textContent = v;
        else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const c of kids) if (c != null) e.append(c);
    return e;
  }
  const fmt = (n) => n.toLocaleString('en-US');
  const squash = (s) => s.replace(/\s+/g, ' ').trim();
  const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

  // ---------------------------------------------------------------- small UI services
  function toast(msg, opts) {
    const o = opts || {};
    const t = h('div', { class: 'toast' + (o.err ? ' err' : ''), role: o.err ? 'alert' : 'status' }, h('span', { text: msg }));
    if (o.action) t.append(h('button', { text: o.action.label, onclick: () => { t.remove(); o.action.run(); } }));
    $('toasts').append(t);
    setTimeout(() => t.remove(), o.ms || (o.err || o.action ? 9000 : 4200));
  }
  function fail(e, prefix) {
    console.error(e);
    toast((prefix ? prefix + ' ' : '') + (e && e.message ? e.message : String(e)), { err: true });
  }
  function confirmDlg(title, msg, okLabel) {
    return new Promise((resolve) => {
      const d = $('dlgConfirm');
      $('cfT').textContent = title;
      $('cfMsg').textContent = msg;
      $('cfYes').textContent = okLabel || 'OK';
      const done = (v) => { $('cfYes').onclick = $('cfNo').onclick = d.oncancel = null; d.close(); resolve(v); };
      $('cfYes').onclick = () => done(true);
      $('cfNo').onclick = () => done(false);
      d.oncancel = (ev) => { ev.preventDefault(); done(false); };
      d.showModal();
    });
  }
  const libs = new Map();
  // Loads the first reachable copy of a library; resolves with the index of the source that worked.
  function loadScript(urls) {
    if (!libs.has(urls)) {
      const attempt = (i) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = urls[i]; s.charset = 'utf-8';
        s.onload = () => resolve(i);
        s.onerror = () => { s.remove(); reject(new Error('unreachable')); };
        document.head.append(s);
      }).catch(() => {
        if (i + 1 < urls.length) return attempt(i + 1);
        libs.delete(urls);
        throw new Error('A required library (' + urls[0].split('/').pop() + ') could not be loaded. Check your connection and try again.');
      });
      libs.set(urls, attempt(0));
    }
    return libs.get(urls);
  }

  // Inside the Claude artifact viewer, files are handed over through the viewer's own save prompt.
  let viewerDownloads = null;
  const downloadsReady = IN_VIEWER
    ? Promise.resolve().then(() => window.claude.use('downloads')).then((d) => { viewerDownloads = d || null; }).catch(() => {})
    : Promise.resolve();
  const VIEWER_EXT = /\.(html|zip|txt|json|csv|pdf|md)$/i;
  async function saveFile(filename, data, mime) {
    await downloadsReady;
    if (viewerDownloads) {
      try {
        await viewerDownloads.save({ filename, data });
        toast('Saved ' + filename);
      } catch (e) {
        if (e && e.code === 'declined') return;
        toast('The file could not be saved: ' + ((e && e.message) || 'saving is unavailable here') + '.', { err: true });
      }
      return;
    }
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime || 'application/octet-stream' });
    const a = h('a', { href: URL.createObjectURL(blob), download: filename });
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    toast('Downloaded ' + filename);
  }

  // ---------------------------------------------------------------- state
  const schema = parseSchema(RES.xsd);
  const S = {
    view: false, link: null,
    name: '', root: null, sel: null, links: [], example: false, filled: false, zoom: 1,
    src: { type: 'none', name: '', bytes: null }, flowEl: null, find: null, customXsl: {},
  };
  let pendingSel = null;   // the last text selected in the guideline: {text, segs:[{page,start,end,quote}]}
  let saveTimer = null;
  let storageOk = true;

  // ---------------------------------------------------------------- browser storage
  const DB = {
    p: null,
    open() {
      if (!this.p) {
        this.p = new Promise((resolve, reject) => {
          let rq;
          try { rq = indexedDB.open('cutgl', 1); } catch (e) { reject(e); return; }
          rq.onupgradeneeded = () => { rq.result.createObjectStore('projects', { keyPath: 'name' }); rq.result.createObjectStore('sources'); };
          rq.onsuccess = () => resolve(rq.result);
          rq.onerror = () => reject(rq.error);
          rq.onblocked = () => reject(new Error('storage blocked'));
          setTimeout(() => reject(new Error('storage did not answer')), 4000);
        });
      }
      return this.p;
    },
    async run(store, mode, fn) {
      const db = await this.open();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(store, mode);
        const rq = fn(tx.objectStore(store));
        tx.oncomplete = () => resolve(rq ? rq.result : undefined);
        tx.onerror = tx.onabort = () => reject(tx.error || new Error('storage error'));
      });
    },
    get(store, key) { return this.run(store, 'readonly', (s) => s.get(key)); },
    all(store) { return this.run(store, 'readonly', (s) => s.getAll()); },
    put(store, val, key) { return this.run(store, 'readwrite', (s) => (key === undefined ? s.put(val) : s.put(val, key))); },
    del(store, key) { return this.run(store, 'readwrite', (s) => s.delete(key)); },
  };
  const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } };

  function linkRecords() {
    return S.links.map((L) => ({ path: nodePath(L.node), name: L.node.name, page: L.page, start: L.start, end: L.end, quote: L.quote }));
  }
  function linksFromRecords(root, recs) {
    const out = [];
    for (const r of recs || []) {
      const node = nodeAt(root, r.path || []);
      if (node && node.name === r.name && r.end > r.start) out.push({ node, page: r.page == null ? null : r.page, start: r.start, end: r.end, quote: r.quote || '' });
    }
    return out;
  }
  async function saveLocal(withSource) {
    if (!S.root || !S.name) return;
    try {
      await DB.put('projects', {
        name: S.name, updated: Date.now(), example: S.example, view: S.view, tree: treeToJson(S.root), links: linkRecords(),
        srcName: S.src.name, srcType: S.src.type, zoom: S.zoom, filled: S.filled,
      });
      if (withSource && S.src.bytes) await DB.put('sources', { name: S.src.name, bytes: S.src.bytes }, S.name);
      lsSet('cutgl:last', S.name);
      storageOk = true;
      $('stSave').textContent = 'Kept in this browser at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      storageOk = false;
      $('stSave').textContent = 'Not kept in this browser (storage is unavailable). Use Project → Save project.';
    }
  }
  function changed(structural) {
    S.example = false;
    $('projTag').hidden = true; $('srcHint').hidden = true;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveLocal(false), 900);
    updateCounts();
    if (structural) renderTree();
  }

  // ---------------------------------------------------------------- tree
  let rows = [];
  const rowEls = new Map();
  let dragNode = null;

  function contentSet() {
    const keep = new Set();
    const visit = (n) => {
      let any = !!javaTrim(n.text);
      for (const k of n.kids) if (visit(k)) any = true;
      if (any) keep.add(n);
      return any;
    };
    visit(S.root);
    return keep;
  }
  function makeRow(n, depth) {
    const text = javaTrim(n.text);
    const r = h('div', {
      class: 'row' + (n === S.sel ? ' sel' : '') + (text ? '' : ' empty'), role: 'treeitem', 'aria-level': depth + 1,
      'aria-selected': n === S.sel ? 'true' : 'false', 'aria-expanded': n.kids.length ? String(!!n.open) : null,
      'data-uid': n.uid, style: '--d:' + depth, draggable: isDraggable(n) && !S.view ? 'true' : null,
    });
    r.append(n.kids.length ? h('button', { class: 'tw' + (n.open ? ' open' : ''), tabindex: '-1', 'aria-hidden': 'true', text: '▶' }) : h('span', { class: 'tw' }));
    r.append(h('span', { class: 'dot s-' + n.source, title: 'source: ' + n.source }));
    r.append(h('span', { class: 'tag', text: '<' + n.name + '>' }));
    if (n.id !== '1') r.append(h('span', { class: 'nid', text: '#' + n.id }));
    if (text) r.append(h('span', { class: 'txt', text: clip(squash(text), 160) }));
    if (S.links.some((L) => L.node === n)) r.append(h('span', { class: 'lk', title: 'Linked to a passage in the guideline', text: '⚓' }));
    r._node = n; r._depth = depth;
    return r;
  }
  function renderTree() {
    const box = $('tree');
    const keep = S.filled ? contentSet() : null;
    const chain = new Set();
    for (let n = S.sel; n; n = n.parent) chain.add(n);
    const frag = document.createDocumentFragment();
    rows = []; rowEls.clear();
    const visit = (n, d) => {
      if (keep && n !== S.root && !keep.has(n) && !chain.has(n)) return;
      rows.push(n);
      const r = makeRow(n, d);
      rowEls.set(n.uid, r);
      frag.append(r);
      if (n.open) for (const k of n.kids) visit(k, d + 1);
    };
    visit(S.root, 0);
    const top = box.scrollTop;
    box.replaceChildren(frag);
    box.scrollTop = top;
  }
  function updateRow(n) {
    const old = rowEls.get(n.uid);
    if (!old) return;
    const r = makeRow(n, old._depth);
    rowEls.set(n.uid, r);
    old.replaceWith(r);
  }
  function reveal(n) {
    let need = false;
    for (let p = n.parent; p; p = p.parent) if (!p.open) { p.open = true; need = true; }
    if (need || !rowEls.has(n.uid)) renderTree();
    const r = rowEls.get(n.uid);
    if (r) r.scrollIntoView({ block: 'nearest' });
  }
  function selectNode(n, opts) {
    if (!n) return;
    const prev = S.sel;
    S.sel = n;
    if (opts && opts.reveal) reveal(n);
    if (prev && prev !== n) updateRow(prev);
    updateRow(n);
    renderInspector();
    updateTools();
    queueHighlights();
  }
  function setOpenAll(open) {
    walkTree(S.root, (n) => { n.open = open && n.kids.length > 0; });
    S.root.open = true;
    if (!open) S.sel = S.root;
    renderTree(); renderInspector(); updateTools();
  }
  function openFilledPaths() {
    const keep = contentSet();
    if (keep.size > 260) return;
    walkTree(S.root, (n) => { if (keep.has(n) && n.kids.some((k) => keep.has(k))) n.open = true; });
  }
  function updateCounts() {
    let total = 0, filled = 0;
    walkTree(S.root, (n) => { total++; if (javaTrim(n.text)) filled++; });
    $('stCounts').textContent = fmt(total) + ' elements · ' + fmt(filled) + ' with text · ' + fmt(S.links.length) + ' linked passage' + (S.links.length === 1 ? '' : 's');
  }

  $('tree').addEventListener('click', (ev) => {
    const r = ev.target.closest('.row');
    if (!r) return;
    const n = r._node;
    if (ev.target.closest('.tw') && n.kids.length) {
      n.open = !n.open;
      if (!n.open && S.sel && S.sel !== n && isAncestor(n, S.sel)) S.sel = n;
      renderTree(); renderInspector(); updateTools();
      return;
    }
    selectNode(n);
    if (matchMedia('(max-width: 900px)').matches && ev.detail === 2) setTab('insp');
  });
  $('tree').addEventListener('dblclick', (ev) => {
    const r = ev.target.closest('.row');
    if (!r || ev.target.closest('.tw') || !r._node.kids.length) return;
    r._node.open = !r._node.open;
    renderTree();
  });
  $('tree').addEventListener('keydown', (ev) => {
    const i = rows.indexOf(S.sel);
    if (i < 0) return;
    const n = S.sel;
    let go = null;
    switch (ev.key) {
      case 'ArrowDown': go = rows[i + 1]; break;
      case 'ArrowUp': go = rows[i - 1]; break;
      case 'Home': go = rows[0]; break;
      case 'End': go = rows[rows.length - 1]; break;
      case 'ArrowRight':
        if (n.kids.length && !n.open) { n.open = true; renderTree(); } else go = rows[i + 1] && rows[i + 1].parent === n ? rows[i + 1] : null;
        break;
      case 'ArrowLeft':
        if (n.kids.length && n.open && n.parent) { n.open = false; renderTree(); } else go = n.parent;
        break;
      case 'Enter': $('inText').focus(); break;
      default: return;
    }
    ev.preventDefault();
    if (go) { selectNode(go); const r = rowEls.get(go.uid); if (r) r.scrollIntoView({ block: 'nearest' }); }
  });
  $('tree').addEventListener('dragstart', (ev) => {
    const r = ev.target.closest('.row');
    if (!r || !isDraggable(r._node)) { ev.preventDefault(); return; }
    dragNode = r._node;
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/plain', '<' + dragNode.name + '>');
  });
  const clearDropMarks = () => { for (const e of $('tree').querySelectorAll('.row.drop')) e.classList.remove('drop'); };
  $('tree').addEventListener('dragover', (ev) => {
    const r = ev.target.closest('.row');
    clearDropMarks();
    if (!dragNode || !r || !canDrop(dragNode, r._node)) return;
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    r.classList.add('drop');
  });
  $('tree').addEventListener('drop', (ev) => {
    const r = ev.target.closest('.row');
    clearDropMarks();
    if (!dragNode || !r || !canDrop(dragNode, r._node)) return;
    ev.preventDefault();
    ev.stopPropagation();
    moveNode(dragNode, r._node);
    S.sel = dragNode;
    dragNode = null;
    changed(true);
    reveal(S.sel); renderInspector(); updateTools();
  });
  $('tree').addEventListener('dragend', () => { dragNode = null; clearDropMarks(); });

  // ---------------------------------------------------------------- inspector
  function fixedText(n) { return n.name === 'ActionType' || n.name === 'DirectiveType'; }
  function renderInspector() {
    const n = S.sel;
    if (!n) return;
    const isRoot = !n.parent;
    $('inName').textContent = '<' + n.name + '>';
    $('inId').textContent = isRoot ? '' : 'id ' + n.id;
    const names = [];
    for (let p = n.parent; p; p = p.parent) names.unshift(p.name);
    $('inPath').textContent = names.join(' › ');
    const s = schemaFor(n, schema);
    $('inDef').textContent = s ? s.doc : '';
    for (const r of $('inSource').querySelectorAll('input')) { r.checked = r.value === n.source; r.disabled = isRoot; }
    const typed = fixedText(n);
    $('inTypeWrap').hidden = !typed;
    if (typed) {
      const sel = $('inType');
      sel.replaceChildren();
      const cur = javaTrim(n.text);
      const opts = ACTION_TYPES.includes(cur) ? ACTION_TYPES : ACTION_TYPES.concat([cur]);
      for (const t of opts) sel.append(h('option', { value: t, text: t || '(none)' }));
      sel.value = cur;
    }
    const coded = n.name.endsWith('Code');
    $('inCodeWrap').hidden = !coded;
    if (coded) $('inCode').value = n.codeset || '';
    const ta = $('inText');
    const logicish = n.name === 'Logic';
    ta.value = isRoot ? '' : n.text;
    ta.disabled = isRoot || typed || logicish;
    ta.readOnly = S.view;
    $('inType').disabled = S.view;
    $('inCode').readOnly = S.view;
    for (const r of $('inSource').querySelectorAll('input')) r.disabled = r.disabled || S.view;
    const hint = $('inHint');
    hint.hidden = !(typed || logicish);
    if (typed) hint.textContent = 'Choose the type from the list above.';
    if (logicish) hint.textContent = 'Logic statements are built in the logic window.';
    $('inLogic').hidden = !(n.name === 'Conditional' || n.name === 'Imperative' || logicish);
    updateLocateBtn();
    renderLinkList();
  }
  function renderLinkList() {
    const box = $('inLinks');
    box.replaceChildren();
    const mine = S.links.filter((L) => L.node === S.sel);
    if (!mine.length) return;
    box.append(h('h3', { text: mine.length === 1 ? 'Linked passage' : 'Linked passages' }));
    for (const L of mine) {
      const label = (L.page != null ? 'p. ' + (L.page + 1) + ' · ' : '') + clip(squash(L.quote || ''), 70);
      box.append(h('div', { class: 'link-row' },
        h('button', { class: 'link-go', title: 'Show this passage in the guideline', text: label, onclick: () => showLink(L) }),
        h('button', { class: 'link-x', title: 'Remove this link (the element text stays)', 'aria-label': 'Remove link', text: '×', onclick: () => {
          S.links.splice(S.links.indexOf(L), 1); changed(false); updateRow(S.sel); renderLinkList(); updateLocateBtn(); queueHighlights();
        } })));
    }
  }
  $('inText').addEventListener('input', () => {
    const n = S.sel;
    if (!n || !n.parent) return;
    n.text = $('inText').value;
    if (javaTrim(n.text) && n.source !== 'inferred') {
      n.source = 'inferred';
      $('srcInferred').checked = true;
    }
    updateRow(n); updateTools(); updateLocateBtn(); changed(false);
  });
  $('inSource').addEventListener('change', (ev) => {
    const n = S.sel;
    if (!n || !n.parent || !ev.target.value) return;
    n.source = ev.target.value;
    updateRow(n); changed(false);
  });
  $('inType').addEventListener('change', () => {
    const n = S.sel;
    if (!n || !fixedText(n)) return;
    n.text = $('inType').value;
    n.source = 'explicit';
    renderInspector(); updateRow(n); changed(false);
  });
  $('inCode').addEventListener('input', () => {
    const n = S.sel;
    if (!n || !n.name.endsWith('Code')) return;
    n.codeset = $('inCode').value;
    changed(false);
  });
  for (const c of CODE_SETS) $('codeSets').append(h('option', { value: c }));

  // ---------------------------------------------------------------- toolbar rules (as in the desktop app)
  function updateTools() {
    const n = S.sel;
    const isRoot = !n || !n.parent;
    const typed = n && fixedText(n);
    const has = n && !!javaTrim(n.text);
    $('tInsert').disabled = isRoot || typed || has;
    $('tAppend').disabled = isRoot || typed || !has;
    $('tReplace').disabled = isRoot || typed || !has;
    $('tClear').disabled = isRoot || typed || !has;
    $('tAdd').disabled = isRoot;
    $('tDel').disabled = isRoot;
    $('tLogic').disabled = !n || !(n.name === 'Conditional' || n.name === 'Imperative' || n.name === 'Logic');
  }
  function dropLinks(pred) {
    S.links = S.links.filter((L) => !pred(L));
  }
  function moveText(mode) {
    const n = S.sel;
    if (!n || !n.parent) return;
    const p = pendingSel || captureSelection();
    if (!p || !squash(p.text)) { toast(S.src.type === 'none' ? 'Attach the guideline document first.' : 'Select some text in the guideline first.'); return; }
    const t = filterSelection(p.text);
    if (mode === 'append') n.text = javaTrim(javaTrim(n.text) + ' ' + t);
    else n.text = t;
    if (mode === 'replace') dropLinks((L) => L.node === n);
    n.source = 'explicit';
    for (const seg of p.segs) S.links.push({ node: n, page: seg.page, start: seg.start, end: seg.end, quote: seg.quote });
    pendingSel = null;
    const sel = getSelection();
    if (sel && $('srcDoc').contains(sel.anchorNode)) sel.removeAllRanges();
    renderInspector(); updateRow(n); updateTools(); changed(false); queueHighlights();
  }
  function clearText() {
    const n = S.sel;
    if (!n || !n.parent) return;
    dropLinks((L) => L.node === n);
    n.text = ''; n.source = 'nd';
    renderInspector(); updateRow(n); updateTools(); changed(false); queueHighlights();
  }
  function addSub() {
    const n = S.sel;
    if (!n || !n.parent) return;
    const copy = createSubtree(n, schema);
    if (!copy) return;
    S.sel = copy;
    changed(true);
    reveal(copy); renderInspector(); updateTools();
  }
  async function delSub() {
    const n = S.sel;
    if (!n || !n.parent) return;
    if (!canRemove(n)) { toast('Cannot remove the last <' + n.name + '> element.'); return; }
    let filled = 0;
    walkTree(n, (x) => { if (javaTrim(x.text)) filled++; });
    if (filled && !(await confirmDlg('Delete this subtree?', '<' + n.name + '> and its children hold text in ' + filled + ' element' + (filled === 1 ? '' : 's') + '. This cannot be undone.', 'Delete'))) return;
    const p = n.parent, at = p.kids.indexOf(n);
    removeSubtree(n);
    dropLinks((L) => isAncestor(n, L.node));
    S.sel = p.kids[Math.min(at, p.kids.length - 1)] || p;
    changed(true);
    renderInspector(); updateTools(); queueHighlights();
  }

  // ---------------------------------------------------------------- guideline: text offsets and marks
  const HAS_HL = typeof Highlight !== 'undefined' && typeof CSS !== 'undefined' && !!CSS.highlights;
  const HL = {};
  if (HAS_HL) {
    ['link', 'multi', 'active', 'pending', 'find', 'cur'].forEach((k, i) => {
      HL[k] = new Highlight(); HL[k].priority = i; CSS.highlights.set('gem-' + k, HL[k]);
    });
  }
  const PDF = { doc: null, pages: [], scale: 1, gen: 0, docGen: 0, io: null, texts: [], folds: [], textsReady: null, baseW: 612, baseH: 792, laidW: 0 };

  function textIndex(c) {
    if (c._ti) return c._ti;
    const nodes = [], starts = [];
    let len = 0;
    const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
    for (let t = w.nextNode(); t; t = w.nextNode()) { nodes.push(t); starts.push(len); len += t.data.length; }
    return (c._ti = { nodes, starts, len, text: null });
  }
  function ctrText(c) {
    const ti = textIndex(c);
    if (ti.text == null) ti.text = ti.nodes.map((n) => n.data).join('');
    return ti.text;
  }
  function locate(ti, off, isEnd) {
    let lo = 0, hi = ti.nodes.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (ti.starts[mid] <= off) lo = mid; else hi = mid - 1;
    }
    if (isEnd && lo > 0 && ti.starts[lo] === off) lo--;
    return { node: ti.nodes[lo], offset: Math.min(off - ti.starts[lo], ti.nodes[lo].data.length) };
  }
  function mkRange(c, start, end) {
    const ti = textIndex(c);
    if (!ti.nodes.length) return null;
    start = Math.max(0, Math.min(start, ti.len)); end = Math.max(0, Math.min(end, ti.len));
    if (end <= start) return null;
    const a = locate(ti, start, false), b = locate(ti, end, true);
    const r = new Range();
    r.setStart(a.node, a.offset); r.setEnd(b.node, b.offset);
    return r;
  }
  function offsetOf(c, node, offset) {
    if (node.nodeType === 3) {
      const ti = textIndex(c);
      const i = ti.nodes.indexOf(node);
      if (i >= 0) return ti.starts[i] + offset;
    }
    const r = new Range();
    r.selectNodeContents(c);
    try { r.setEnd(node, offset); } catch (e) { return 0; }
    return r.toString().length;
  }
  // Searching ignores case, spacing, line breaks and hyphens, so a phrase is found even where the page wraps it.
  const FOLD = { '\ufb00': 'ff', '\ufb01': 'fi', '\ufb02': 'fl', '\ufb03': 'ffi', '\ufb04': 'ffl', '\u2018': "'", '\u2019': "'", '\u201c': '"', '\u201d': '"' };
  function foldText(text) {
    const out = [], map = [];
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      if (c <= 32 || c === 0x2d || c === 0xa0 || c === 0xad || (c >= 0x2010 && c <= 0x2015) || c === 0x200b || c === 0x2028 || c === 0x2029 || c === 0xfeff) continue;
      const r = FOLD[text[i]] || text[i].toLowerCase();
      for (let k = 0; k < r.length; k++) { out.push(r[k]); map.push(i); }
    }
    return { t: out.join(''), map };
  }
  let flowFold = null;
  // The searchable units of the guideline: one per PDF page, or the whole of a text document.
  function searchUnits() {
    if (S.src.type === 'pdf') {
      return PDF.pages.map((P) => {
        const raw = P.tx === 2 ? ctrText(P.tl) : (PDF.texts[P.i] || '');
        if (!PDF.folds[P.i] || PDF.folds[P.i].raw !== raw) { PDF.folds[P.i] = foldText(raw); PDF.folds[P.i].raw = raw; }
        return { page: P.i, raw, fold: PDF.folds[P.i] };
      });
    }
    if (!S.flowEl) return [];
    const raw = ctrText(S.flowEl);
    if (!flowFold || flowFold.raw !== raw) { flowFold = foldText(raw); flowFold.raw = raw; }
    return [{ page: null, raw, fold: flowFold }];
  }
  function containers() {
    if (S.src.type === 'pdf') return PDF.pages.filter((P) => P.tx === 2).map((P) => ({ el: P.tl, page: P.i }));
    return S.flowEl ? [{ el: S.flowEl, page: null }] : [];
  }
  function containerFor(page) {
    if (S.src.type === 'pdf') { const P = PDF.pages[page]; return P && P.tx === 2 ? P.tl : null; }
    return S.flowEl;
  }
  // If the stored offsets no longer cover the stored words (a different renderer version, say), find the words again.
  function reanchor(L, c) {
    if (L._seen === c._stamp) return;
    L._seen = c._stamp;
    if (!L.quote) return;
    const text = ctrText(c);
    if (text.slice(L.start, L.end) === L.quote) return;
    let best = -1, bd = Infinity;
    for (let i = text.indexOf(L.quote); i !== -1; i = text.indexOf(L.quote, i + 1)) {
      const d = Math.abs(i - L.start);
      if (d < bd) { bd = d; best = i; }
    }
    if (best !== -1) { L.start = best; L.end = best + L.quote.length; }
  }
  let hlQueued = false;
  function queueHighlights() {
    if (hlQueued) return;
    hlQueued = true;
    requestAnimationFrame(() => { hlQueued = false; refreshHighlights(); });
  }
  function refreshHighlights() {
    if (!HAS_HL) return;
    for (const k in HL) HL[k].clear();
    const per = new Map();
    for (const L of S.links) {
      const c = containerFor(L.page);
      if (!c) continue;
      reanchor(L, c);
      const r = mkRange(c, L.start, L.end);
      if (!r) continue;
      HL.link.add(r);
      if (L.node === S.sel) HL.active.add(r);
      if (!per.has(c)) per.set(c, []);
      per.get(c).push([L.start, L.end]);
    }
    for (const [c, spans] of per) { // passages used by more than one element show in yellow, as in the desktop app
      if (spans.length < 2) continue;
      const pts = [];
      for (const [a, b] of spans) { pts.push([a, 1], [b, -1]); }
      pts.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
      let depth = 0, from = -1;
      for (const [pos, d] of pts) {
        const next = depth + d;
        if (depth < 2 && next >= 2) from = pos;
        if (depth >= 2 && next < 2 && pos > from) { const r = mkRange(c, from, pos); if (r) HL.multi.add(r); }
        depth = next;
      }
    }
    if (pendingSel) {
      for (const seg of pendingSel.segs) {
        const c = containerFor(seg.page);
        const r = c && mkRange(c, seg.start, seg.end);
        if (r) HL.pending.add(r);
      }
    }
    if (S.find && S.find.q) {
      for (const fm of S.find.matches) {
        const c = containerFor(fm.page);
        const r = c && mkRange(c, fm.start, fm.end);
        if (r) HL.find.add(r);
      }
      const m = S.find.matches[S.find.cur];
      const mc = m && containerFor(m.page);
      const mr = mc && mkRange(mc, m.start, m.end);
      if (mr) HL.cur.add(mr);
    }
  }
  function scrollToRange(r) {
    const sc = $('srcScroll');
    const rr = r.getBoundingClientRect(), sr = sc.getBoundingClientRect();
    if (rr.top < sr.top + 20 || rr.bottom > sr.bottom - 20) sc.scrollTop += rr.top - sr.top - sc.clientHeight / 3;
  }
  async function showLink(L) {
    if (S.src.type === 'pdf') await ensurePdfPage(L.page);
    const c = containerFor(L.page);
    if (!c) return;
    reanchor(L, c);
    const r = mkRange(c, L.start, L.end);
    if (!r) { toast('This passage could not be found in the document.'); return; }
    setTab('src');
    scrollToRange(r);
    queueHighlights();
  }

  function captureSelection() {
    const sel = getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) return null;
    const r = sel.getRangeAt(0);
    if (!$('srcDoc').contains(r.commonAncestorContainer)) return null;
    const segs = [];
    for (const c of containers()) {
      if (!r.intersectsNode(c.el)) continue;
      const cr = new Range();
      cr.selectNodeContents(c.el);
      const s = r.compareBoundaryPoints(Range.START_TO_START, cr) < 0 ? 0 : offsetOf(c.el, r.startContainer, r.startOffset);
      const e = r.compareBoundaryPoints(Range.END_TO_END, cr) > 0 ? textIndex(c.el).len : offsetOf(c.el, r.endContainer, r.endOffset);
      if (e > s) segs.push({ page: c.page, start: s, end: e, quote: ctrText(c.el).slice(s, e) });
    }
    if (!segs.length) return null;
    let text = sel.toString();
    if (!squash(text)) text = segs.map((x) => x.quote).join(' ');
    return { text, segs };
  }
  document.addEventListener('selectionchange', () => {
    const sel = getSelection();
    if (!sel || !sel.rangeCount) return;
    if (!$('srcDoc').contains(sel.anchorNode)) return; // selection moved elsewhere: keep what was picked in the guideline
    const cap = captureSelection();
    if (cap || pendingSel) { pendingSel = cap; queueHighlights(); }
  });
  function pointToOffset(x, y) {
    let node = null, offset = 0;
    if (document.caretPositionFromPoint) {
      const p = document.caretPositionFromPoint(x, y);
      if (p) { node = p.offsetNode; offset = p.offset; }
    } else if (document.caretRangeFromPoint) {
      const r = document.caretRangeFromPoint(x, y);
      if (r) { node = r.startContainer; offset = r.startOffset; }
    }
    if (!node) return null;
    for (const c of containers()) if (c.el.contains(node)) return { page: c.page, off: offsetOf(c.el, node, offset) };
    return null;
  }
  $('srcDoc').addEventListener('click', (ev) => {
    const sel = getSelection();
    if (sel && !sel.isCollapsed) return;
    const at = pointToOffset(ev.clientX, ev.clientY);
    if (!at) return;
    const hits = S.links.filter((L) => (L.page == null ? null : L.page) === at.page && at.off >= L.start && at.off < L.end);
    if (!hits.length) return;
    const i = hits.findIndex((L) => L.node === S.sel);
    selectNode(hits[(i + 1) % hits.length].node, { reveal: true });
  });
  // Keeps drag-selection steady over the gaps between positioned PDF text runs.
  $('srcDoc').addEventListener('mousedown', (ev) => {
    const tl = ev.target.closest && ev.target.closest('.textLayer');
    const end = tl && tl.querySelector('.endOfContent');
    if (!end) return;
    if (ev.target !== tl) {
      const b = tl.getBoundingClientRect();
      end.style.top = (Math.max(0, (ev.clientY - b.top) / b.height) * 100).toFixed(2) + '%';
    }
    const up = () => { end.style.top = ''; document.removeEventListener('mouseup', up); };
    document.addEventListener('mouseup', up);
  });

  // ---------------------------------------------------------------- guideline: rendering
  let stamp = 1;
  async function showSource() {
    const host = $('srcDoc');
    PDF.gen++; PDF.docGen++;
    if (PDF.io) { PDF.io.disconnect(); PDF.io = null; }
    if (PDF.doc) { try { PDF.doc.destroy(); } catch (e) { /* already gone */ } }
    PDF.doc = null; PDF.pages = []; PDF.texts = []; PDF.folds = []; PDF.textsReady = null; flowFold = null;
    S.flowEl = null; pendingSel = null;
    host.replaceChildren(); host.className = 'src-doc';
    host.style.setProperty('--zoom', S.zoom);
    const src = S.src;
    $('srcName').textContent = src.name || '';
    $('srcEmpty').hidden = src.type !== 'none';
    if (src.type === 'none') { queueHighlights(); return; }
    try {
      if (src.type === 'pdf') { await showPdf(src.bytes); return; }
      const body = h('div', { class: 'flow-body' });
      if (src.type === 'html') sanitizeInto(body, decodeText(src.bytes));
      else if (src.type === 'docx') {
        await loadScript(CDN.mammoth);
        const res = await window.mammoth.convertToHtml({ arrayBuffer: src.bytes.slice(0) });
        sanitizeInto(body, res.value);
      } else if (src.type === 'rtf') {
        body.classList.add('pre');
        for (const run of rtfToRuns(latin1(src.bytes))) {
          let n = document.createTextNode(run.text);
          if (run.u) n = h('u', null, n);
          if (run.i) n = h('i', null, n);
          if (run.b) n = h('b', null, n);
          body.append(n);
        }
      } else {
        body.classList.add('pre');
        body.textContent = decodeText(src.bytes).replace(/\r\n?/g, '\n');
      }
      body._stamp = stamp++;
      host.className = 'src-doc flow';
      host.append(body);
      S.flowEl = body;
    } catch (e) {
      host.append(h('div', { class: 'empty' }, h('p', null, h('strong', { text: 'This document could not be displayed.' })), h('p', { text: e.message || String(e) })));
    }
    queueHighlights();
  }

  async function showPdf(bytes) {
    const gen = PDF.docGen;
    let docLoaded;
    const loaded = new Promise((resolve) => { docLoaded = resolve; });
    // Page text for the whole document, read in the background; search and passage linking wait for it.
    PDF.textsReady = loaded.then(async (doc) => {
      if (!doc) return;
      for (let i = 0; i < doc.numPages; i++) {
        if (gen !== PDF.docGen) return;
        const page = await doc.getPage(i + 1);
        const tc = await page.getTextContent();
        PDF.texts[i] = tc.items.map((it) => it.str || '').join('');
      }
    }).catch(() => {});
    try {
      const from = await loadScript(CDN.pdfjs);
      const lib = window.pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc = CDN.pdfworker[from];
      const doc = await lib.getDocument({ data: new Uint8Array(bytes.slice(0)), cMapUrl: CDN.cmaps, cMapPacked: true, standardFontDataUrl: CDN.stdfonts }).promise;
      if (gen !== PDF.docGen) { doc.destroy(); docLoaded(null); return; }
      PDF.doc = doc;
      const p1 = await doc.getPage(1);
      const vp = p1.getViewport({ scale: 1 });
      PDF.baseW = vp.width; PDF.baseH = vp.height;
      layoutPdf();
      docLoaded(doc);
    } catch (e) { docLoaded(null); throw e; }
  }
  function layoutPdf() {
    const host = $('srcDoc'), sc = $('srcScroll');
    if (!PDF.doc) return;
    const avail = sc.clientWidth - 28;
    if (avail < 80) { PDF.laidW = 0; return; } // panel hidden (narrow layout); laid out when it is shown
    const ratio = sc.scrollHeight > 0 ? sc.scrollTop / sc.scrollHeight : 0;
    PDF.gen++;
    PDF.laidW = sc.clientWidth;
    if (PDF.io) PDF.io.disconnect();
    PDF.scale = Math.max(0.2, (avail / PDF.baseW) * S.zoom);
    host.className = 'src-doc pdf';
    host.replaceChildren();
    PDF.pages = [];
    PDF.io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        const P = PDF.pages[+en.target.dataset.page];
        if (!P) continue;
        if (en.isIntersecting) renderPdfPage(P.i);
        else if (P.cv === 2 && en.rootBounds && Math.abs(en.boundingClientRect.top - en.rootBounds.top) > 6000) { P.canvas.width = 0; P.canvas.height = 0; P.cv = 0; }
      }
    }, { root: sc, rootMargin: '900px 0px' });
    for (let i = 0; i < PDF.doc.numPages; i++) {
      const canvas = h('canvas');
      const tl = h('div', { class: 'textLayer' });
      const elp = h('div', { class: 'pg', 'data-page': i }, canvas, tl, h('div', { class: 'pg-num', text: 'Page ' + (i + 1) }));
      elp.style.width = Math.floor(PDF.baseW * PDF.scale) + 'px';
      elp.style.height = Math.floor(PDF.baseH * PDF.scale) + 'px';
      PDF.pages.push({ i, el: elp, canvas, tl, cv: 0, tx: 0, job: null });
      host.append(elp);
      PDF.io.observe(elp);
    }
    sc.scrollTop = ratio * sc.scrollHeight;
    queueHighlights();
  }
  function renderPdfPage(i) {
    const P = PDF.pages[i];
    if (!P) return Promise.resolve();
    if (P.job) return P.job;
    if (P.cv === 2 && P.tx === 2) return Promise.resolve();
    const gen = PDF.gen, lib = window.pdfjsLib;
    P.job = (async () => {
      const page = await PDF.doc.getPage(i + 1);
      if (gen !== PDF.gen) return;
      const vp = page.getViewport({ scale: PDF.scale });
      P.el.style.width = Math.floor(vp.width) + 'px';
      P.el.style.height = Math.floor(vp.height) + 'px';
      if (P.cv !== 2) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        P.canvas.width = Math.floor(vp.width * dpr); P.canvas.height = Math.floor(vp.height * dpr);
        await page.render({ canvasContext: P.canvas.getContext('2d'), viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null }).promise;
        if (gen !== PDF.gen) return;
        P.cv = 2;
      }
      if (P.tx !== 2) {
        const tc = await page.getTextContent();
        if (gen !== PDF.gen) return;
        P.tl.replaceChildren();
        P.tl.style.setProperty('--scale-factor', vp.scale);
        await lib.renderTextLayer({ textContentSource: tc, container: P.tl, viewport: vp, textDivs: [] }).promise;
        if (gen !== PDF.gen) return;
        P.tl.append(h('div', { class: 'endOfContent' }));
        P.tl._ti = null; P.tl._stamp = stamp++;
        P.tx = 2;
        queueHighlights();
      }
    })().catch((e) => { if (gen === PDF.gen) console.warn('Page ' + (i + 1) + ' failed to draw', e); }).finally(() => { P.job = null; });
    return P.job;
  }
  async function ensurePdfPage(i) {
    if (!PDF.pages[i]) return;
    await renderPdfPage(i);
  }
  let relayoutTimer = null;
  function relayoutSoon() {
    clearTimeout(relayoutTimer);
    relayoutTimer = setTimeout(() => {
      if (S.src.type === 'pdf' && PDF.doc && Math.abs($('srcScroll').clientWidth - PDF.laidW) > 12) layoutPdf();
    }, 180);
  }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(relayoutSoon).observe($('srcScroll'));

  function setZoom(f) {
    S.zoom = Math.max(0.5, Math.min(3, S.zoom * f));
    $('srcDoc').style.setProperty('--zoom', S.zoom);
    if (S.src.type === 'pdf') layoutPdf();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveLocal(false), 900);
  }
  $('zoomIn').onclick = () => setZoom(1.1);
  $('zoomOut').onclick = () => setZoom(1 / 1.1);

  // ---------------------------------------------------------------- find
  async function runFind(q, step) {
    q = q.trim();
    if (!q) { S.find = null; $('findCount').textContent = ''; queueHighlights(); return; }
    if (S.find && S.find.q === q && S.find.matches.length) {
      const n = S.find.matches.length;
      S.find.cur = (S.find.cur + (step || 1) + n) % n;
    } else {
      const matches = [];
      const fq = foldText(q).t;
      if (S.src.type === 'pdf' && PDF.textsReady) { $('findCount').textContent = 'Reading…'; await PDF.textsReady; }
      if (fq) {
        for (const u of searchUnits()) {
          const F = u.fold;
          for (let i = F.t.indexOf(fq); i !== -1; i = F.t.indexOf(fq, i + fq.length)) matches.push({ page: u.page, start: F.map[i], end: F.map[i + fq.length - 1] + 1 });
        }
      }
      S.find = { q, matches, cur: 0 };
    }
    const f = S.find;
    $('findCount').textContent = f.matches.length ? (f.cur + 1) + ' / ' + f.matches.length : 'No match';
    const m = f.matches[f.cur];
    if (m) {
      if (S.src.type === 'pdf') {
        const P = PDF.pages[m.page];
        if (P && P.tx !== 2) { P.el.scrollIntoView({ block: 'start' }); await ensurePdfPage(m.page); }
      }
      const c = containerFor(m.page);
      const r = c && mkRange(c, m.start, m.end);
      if (r) scrollToRange(r);
    }
    queueHighlights();
  }
  $('findForm').addEventListener('submit', (ev) => { ev.preventDefault(); runFind($('findInput').value, 1); });
  $('findInput').addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.shiftKey) { ev.preventDefault(); runFind($('findInput').value, -1); } });
  $('findInput').addEventListener('input', () => { if (!$('findInput').value) runFind(''); });

  // ---------------------------------------------------------------- link element text back to the guideline
  // Searches the whole guideline as one folded string. locate(text) finds the first place the text appears,
  // locate(text, n) the n-th (from 0), and locate(text, {near}) the place inside near (a {lo, hi} span of the
  // folded string) or, failing that, the one closest to it.
  function buildLocator() {
    const units = searchUnits();
    const starts = [];
    let total = 0;
    for (const u of units) { starts.push(total); total += u.fold.t.length; }
    const all = units.map((u) => u.fold.t).join('');
    const segsAt = (at, len) => {
      const segs = [];
      for (let ui = 0; ui < units.length; ui++) {
        const a = Math.max(at, starts[ui]), b = Math.min(at + len, starts[ui] + units[ui].fold.t.length);
        if (b <= a) continue;
        const F = units[ui].fold;
        const start = F.map[a - starts[ui]], end = F.map[b - 1 - starts[ui]] + 1;
        segs.push({ page: units[ui].page, start, end, quote: units[ui].raw.slice(start, end) });
      }
      return segs;
    };
    // The place in the folded string of an offset into a unit's text.
    const posOf = (page, off) => {
      const ui = units.findIndex((u) => u.page === page);
      if (ui < 0) return null;
      const map = units[ui].fold.map;
      let lo = 0, hi = map.length;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (map[mid] < off) lo = mid + 1; else hi = mid; }
      return starts[ui] + lo;
    };
    const locate = (text, opt) => {
      const fq = foldText(text).t;
      if (!fq) return null;
      const hits = [];
      for (let i = all.indexOf(fq); i !== -1 && hits.length < 2000; i = all.indexOf(fq, i + 1)) hits.push(i);
      let at = hits[typeof opt === 'number' ? opt : 0];
      if (at == null) return null;
      if (opt && opt.near) {
        const near = opt.near;
        const inside = hits.find((x) => x >= near.lo && x + fq.length <= near.hi);
        const dist = (x) => (x < near.lo ? near.lo - x : Math.max(0, x - near.hi));
        at = inside != null ? inside : hits.reduce((best, x) => (dist(x) < dist(best) ? x : best), hits[0]);
      }
      return { segs: segsAt(at, fq.length), more: hits.length > 1, count: hits.length, at, len: fq.length };
    };
    // Where an element's text is most likely to be: around the passages already linked in the nearest
    // enclosing element that has any, its parent's own or those of the parent's other children.
    // The guideline's top-level sections are as far up as it looks.
    const own = new Map();
    locate.track = (L) => {
      const a = posOf(L.page, L.start), b = posOf(L.page, L.end);
      if (a == null || b == null) return;
      const sp = own.get(L.node);
      own.set(L.node, sp ? { lo: Math.min(sp.lo, a), hi: Math.max(sp.hi, b) } : { lo: a, hi: b });
    };
    for (const L of S.links) locate.track(L);
    locate.spanOf = (node) => own.get(node) || null;
    locate.anchorOf = (node) => {
      for (let p = node.parent; p && p.parent; p = p.parent) {
        let lo = Infinity, hi = -Infinity;
        walkTree(p, (x) => { const sp = x !== node && own.get(x); if (sp) { lo = Math.min(lo, sp.lo); hi = Math.max(hi, sp.hi); } });
        if (lo <= hi) return { lo, hi };
      }
      return null;
    };
    return locate;
  }
  // Text shorter than this is linked only close to its ancestor's passage, where it cannot be mistaken.
  const SHORT_TEXT = 15, CLOSE = 300;
  function placeText(locate, n) {
    const near = locate.anchorOf(n);
    const hit = locate(n.text, near ? { near } : null);
    if (!hit) return null;
    const close = !!near && hit.at >= near.lo - CLOSE && hit.at <= near.hi + CLOSE;
    if (hit.len < SHORT_TEXT && !close) return null;
    return Object.assign(hit, { close });
  }
  async function locateSelected() {
    const n = S.sel;
    if (!n || !n.parent || !javaTrim(n.text)) return;
    if (S.src.type === 'none') { toast('Attach the guideline document first.'); return; }
    if (S.src.type === 'pdf' && PDF.textsReady) await PDF.textsReady;
    const locate = buildLocator();
    const near = locate.anchorOf(n);
    const hit = locate(n.text, near ? { near } : null);
    if (!hit) { toast('This text does not appear word for word in the guideline.'); return; }
    for (const seg of hit.segs) S.links.push({ node: n, page: seg.page, start: seg.start, end: seg.end, quote: seg.quote });
    changed(false); updateRow(n); renderLinkList(); updateLocateBtn();
    await showLink(S.links.find((L) => L.node === n));
    toast(!hit.more ? 'Linked to the passage.' : near ? 'Linked to the place nearest its recommendation. The text appears ' + fmt(hit.count) + ' times.' : 'Linked to the first place this text appears. It appears more than once.');
  }
  // Links every element that has text but no passage. Elements are placed from the top of the tree down,
  // so each one is looked for within, or as close as possible to, the passage of its nearest linked ancestor:
  // a phrase such as "Strong recommendation" lands beside its own recommendation, not at its first appearance.
  async function locateAll(quiet) {
    if (S.src.type === 'none') { if (quiet !== true) toast('Attach the guideline document first.'); return { tried: 0, found: 0 }; }
    if (S.src.type === 'pdf' && PDF.textsReady) await PDF.textsReady;
    const locate = buildLocator();
    const linked = new Set(S.links.map((L) => L.node));
    const todo = [];
    walkTree(S.root, (n) => { if (n.parent && !linked.has(n) && n.name !== 'Logic' && !fixedText(n) && javaTrim(n.text)) todo.push(n); });
    const tried = todo.length;
    let found = 0;
    // Two passes: the first places the longer texts, the second the short ones (and anything the first could
    // not place) near the passages the first one found.
    for (let pass = 0; pass < 2; pass++) {
      for (const n of todo) {
        if (linked.has(n) || (pass === 0 && foldText(n.text).t.length < SHORT_TEXT)) continue;
        const hit = placeText(locate, n);
        if (!hit) continue;
        found++;
        linked.add(n);
        for (const seg of hit.segs) {
          const L = { node: n, page: seg.page, start: seg.start, end: seg.end, quote: seg.quote };
          S.links.push(L);
          locate.track(L);
        }
      }
    }
    if (found) { changed(false); renderTree(); renderInspector(); queueHighlights(); }
    if (quiet !== true) {
      toast(tried ? 'Linked ' + fmt(found) + ' of ' + fmt(tried) + ' unlinked elements to their passages.' + (found < tried ? ' The rest do not appear word for word in the guideline, or are too short to place.' : '') : 'Every element with text is already linked.', { ms: 8000 });
    }
    return { tried, found };
  }
  function updateLocateBtn() {
    const n = S.sel;
    $('inLocate').hidden = !(n && n.parent && javaTrim(n.text) && S.src.type !== 'none' && n.name !== 'Logic' && !fixedText(n) && !S.links.some((L) => L.node === n));
  }

  // ---------------------------------------------------------------- projects
  function setTitle() {
    $('projName').textContent = S.name || 'untitled';
    $('projTag').hidden = !S.example;
    $('srcHint').hidden = !S.example;
  }
  async function setProject(p) {
    clearTimeout(saveTimer);
    S.name = p.name; S.root = p.root; S.root.open = true; S.sel = S.root;
    S.links = p.links || []; S.example = !!p.example; S.zoom = p.zoom || 1; S.filled = !!p.filled;
    S.find = null; S.customXsl = {}; S.link = null;
    $('copyLink').hidden = true;
    setView(!!p.view, true);
    S.src = p.src && p.src.bytes ? { type: sourceTypeOf(p.src.name), name: p.src.name, bytes: p.src.bytes } : { type: 'none', name: '', bytes: null };
    $('filledOnly').checked = S.filled;
    $('findInput').value = ''; $('findCount').textContent = '';
    setTitle();
    if (!p.keepOpen) openFilledPaths();
    renderTree(); renderInspector(); updateTools(); updateCounts();
    await showSource();
  }
  function fileSafe(name) { return (name || 'project').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '_').trim() || 'project'; }
  const xmlFileName = () => fileSafe(S.name).replace(/\s+/g, '') + '.xml';

  // Legacy links carry an offset into the desktop text pane plus a snapshot of the tree node.
  function adoptLegacyLinks(legacy) {
    const out = [];
    let skipped = 0;
    const flow = S.flowEl;
    const text = flow ? ctrText(flow) : '';
    let N = null;
    const norm = () => {
      if (N) return N;
      let t = ''; const map = [];
      let space = true;
      for (let i = 0; i < text.length; i++) {
        const ws = /\s/.test(text[i]);
        if (ws) { if (!space) { t += ' '; map.push(i); } space = true; } else { t += text[i]; map.push(i); space = false; }
      }
      return (N = { text: t, map });
    };
    for (const L of legacy) {
      if (!(L.end > L.start) || !flow) { skipped++; continue; }
      const lab = splitLabel(L.label || '');
      let node = nodeAt(S.root, L.path || []);
      if (!node || node.name !== lab.name) {
        node = null;
        const want = squash(lab.text);
        walkTree(S.root, (n) => { if (!node && n.name === lab.name && n.parent && n.parent.kids.indexOf(n) === L.index && squash(n.text) === want) node = n; });
      }
      if (!node) { skipped++; continue; }
      let start = Math.min(L.start, text.length), end = Math.min(L.end, text.length);
      const want = squash(node.text);
      const got = squash(filterSelection(text.slice(start, end)));
      if (!(got && want && (got === want || (got.length >= 6 && want.startsWith(got))))) {
        const needle = want.slice(0, 80);
        if (needle.length >= 6) {
          const M = norm();
          let best = -1, bd = Infinity;
          for (let i = M.text.indexOf(needle); i !== -1; i = M.text.indexOf(needle, i + 1)) {
            const d = Math.abs(M.map[i] - L.start);
            if (d < bd) { bd = d; best = i; }
          }
          if (best !== -1) {
            const full = M.text.startsWith(want, best) ? want.length : needle.length;
            start = M.map[best]; end = M.map[best + full - 1] + 1;
          }
        }
      }
      if (end > start) out.push({ node, page: null, start, end, quote: text.slice(start, end) }); else skipped++;
    }
    return { links: out, skipped };
  }

  const DOC_EXT = /\.(pdf|rtf|html?|txt|docx)$/i;
  function cleanEntries(list) {
    return list.map((e) => ({ path: e.path.replace(/\\/g, '/').replace(/^\.?\//, ''), get: e.get }))
      .filter((e) => !/(^|\/)(__MACOSX\/|\._|\.DS_Store|Thumbs\.db)/.test(e.path));
  }
  async function openEntries(list, hint, opts) {
    const entries = cleanEntries(list);
    const depth = (p) => p.split('/').length;
    const text = async (e) => decodeText(await e.get());
    let base = null, treeEntry = null, xmlEntry = null;
    const tms = entries.filter((e) => /(^|\/)resources\/GEMCutterTreeModel\.xml$/i.test(e.path)).sort((a, b) => depth(a.path) - depth(b.path));
    if (tms.length) {
      treeEntry = tms[0];
      base = treeEntry.path.replace(/resources\/GEMCutterTreeModel\.xml$/i, '');
    } else {
      const xmls = entries.filter((e) => /\.xml$/i.test(e.path) && !/(^|\/)(resources|projects)\//i.test(e.path)).sort((a, b) => depth(a.path) - depth(b.path));
      for (const e of xmls) {
        const head = (await text(e)).slice(0, 4000);
        if (/<([\w.-]+:)?GuidelineDocument[\s>]/.test(head)) { xmlEntry = e; break; }
      }
      if (!xmlEntry) throw new Error('No GEM Cutter project was found there. Choose the folder that holds “resources”, a zipped project, or a GEM .xml file.');
      base = xmlEntry.path.replace(/[^/]*$/, '');
    }
    const inBase = (rel) => entries.find((e) => e.path === base + rel) || entries.find((e) => e.path.toLowerCase() === (base + rel).toLowerCase());
    const name = base ? base.replace(/\/$/, '').split('/').pop() : (hint || 'project');
    let root;
    if (treeEntry) root = parseTreeModel(await text(treeEntry));
    else root = parseGemXml(await text(xmlEntry));
    const propsE = inBase('resources/project.properties');
    const props = propsE ? parseProperties(await text(propsE)) : {};
    let srcE = props.ProjectSourceFile ? inBase(props.ProjectSourceFile) : null;
    if (!srcE) {
      srcE = entries.find((e) => e.path.startsWith(base) && !e.path.slice(base.length).includes('/') && DOC_EXT.test(e.path) && !/Report\.html?$/i.test(e.path));
    }
    const src = srcE ? { name: srcE.path.split('/').pop(), bytes: await srcE.get() } : null;
    if (src && sourceTypeOf(src.name) === 'doc') src.bytes = null;
    let web = null;
    const webE = inBase('resources/cutgl.json') || inBase('resources/gemcutter-web.json'); // the second: the name before CutGL
    if (webE) { try { web = JSON.parse(await text(webE)); } catch (e) { web = null; } }
    let legacy = null;
    const lbE = inBase('resources/linkbean') || inBase('projects/linkbean');
    if (!web && lbE) { try { legacy = readLegacyLinks(new Uint8Array(await lbE.get())); } catch (e) { console.warn('linkbean unreadable', e); legacy = null; } }

    await setProject({ name, root, src, links: web ? linksFromRecords(root, web.links) : [], zoom: web && web.zoom });
    let note = '';
    if (legacy && legacy.length) {
      if (S.src.type === 'pdf') note = ' The desktop app does not record where text was taken from in a PDF, so there are no passage links to restore.';
      else {
        const res = adoptLegacyLinks(legacy);
        S.links = res.links;
        note = ' ' + res.links.length + ' passage link' + (res.links.length === 1 ? '' : 's') + ' restored' + (res.skipped ? ', ' + res.skipped + ' could not be placed' : '') + '.';
        renderTree(); queueHighlights();
      }
    }
    if (!src && props.ProjectSourceFile) note += ' The guideline file “' + props.ProjectSourceFile + '” was not in the folder.';
    updateCounts();
    if (!(opts && opts.store === false)) await saveLocal(true);
    let total = 0;
    walkTree(root, () => { total++; });
    const gem2 = !treeEntry && looksLikeGem2(root);
    toast('Opened ' + name + ': ' + fmt(total) + ' elements.' + note, gem2 ? { action: { label: 'Add GEM III elements', run: convertGem } } : { ms: note ? 9000 : 4200 });
  }
  async function openZip(buf, fileName, opts) {
    await loadScript(CDN.jszip);
    const zip = await window.JSZip.loadAsync(buf);
    const list = Object.values(zip.files).filter((f) => !f.dir).map((f) => ({ path: f.name, get: () => f.async('arraybuffer') }));
    await openEntries(list, fileName.replace(/\.zip$/i, ''), opts);
  }
  // A GEM XML on its own opens for reading: viewer mode, empty elements hidden. opts.store false keeps it
  // out of this browser's storage (a document opened from a link is fetched again from the link).
  async function openXmlFile(buf, fileName, opts) {
    const o = opts || {};
    const root = parseGemXml(decodeText(buf));
    const name = fileName.replace(/\.xml$/i, '');
    await setProject({ name, root, src: null, links: [], view: o.view !== false, filled: o.view !== false });
    if (o.store !== false) await saveLocal(true);
    let total = 0, filled = 0;
    walkTree(root, (n) => { total++; if (javaTrim(n.text)) filled++; });
    if (o.quiet) return;
    toast('Opened ' + fileName + ': ' + fmt(total) + ' elements, ' + fmt(filled) + ' with text. Attach the guideline it was cut from to see where the text came from.',
      looksLikeGem2(root) ? { action: { label: 'Add GEM III elements', run: convertGem } } : { ms: 7000 });
  }

  // ---- open from a link: ?xml=…[&guideline=…], ?project=… (a zipped project), ?sample=…; add &edit to open for editing
  async function fetchBytes(url) {
    let res;
    try { res = await fetch(url); } catch (e) {
      throw new Error('Could not load ' + url + '. It is unreachable, or its server does not let other sites read it (CORS).');
    }
    if (!res.ok) throw new Error('Could not load ' + url + ' (HTTP ' + res.status + ').');
    return res.arrayBuffer();
  }
  const fileOf = (url) => decodeURIComponent(new URL(url).pathname.split('/').pop() || 'document');
  async function openFromLink(q) {
    const abs = (v) => new URL(v, location.href).href;
    const view = !q.has('edit');
    if (q.get('project')) {
      const u = abs(q.get('project'));
      await openZip(await fetchBytes(u), fileOf(u), { store: false });
      if (view) { S.filled = true; $('filledOnly').checked = true; setView(true); }
    } else {
      const u = abs(q.get('xml'));
      await openXmlFile(await fetchBytes(u), fileOf(u), { view, store: false, quiet: true });
      if (q.get('guideline')) {
        const g = abs(q.get('guideline'));
        S.src = { type: sourceTypeOf(fileOf(g)), name: fileOf(g), bytes: await fetchBytes(g) };
        await showSource();
        await locateAll(true);
      }
      let total = 0;
      walkTree(S.root, () => { total++; });
      toast('Opened ' + fileOf(u) + ': ' + fmt(total) + ' elements' + (S.links.length ? ', ' + fmt(S.links.length) + ' passage' + (S.links.length === 1 ? '' : 's') + ' linked in the guideline.' : '.'), { ms: 6000 });
    }
    S.link = location.href;
    $('copyLink').hidden = false;
    renderTree(); updateCounts();
  }
  async function copyLink() {
    if (!S.link) return;
    try { await navigator.clipboard.writeText(S.link); toast('Link copied.'); } catch (e) { toast('Copying is blocked here. The link: ' + S.link, { ms: 12000 }); }
  }

  // ---- viewer mode: the document can be read, searched, linked to its guideline and reported on, not changed
  const EDIT_ACTS = new Set(['insert', 'append', 'replace', 'clear', 'addSub', 'delSub', 'logic', 'convert']);
  function setView(on, quiet) {
    S.view = !!on;
    document.body.classList.toggle('viewing', S.view);
    $('modeView').setAttribute('aria-pressed', String(S.view));
    $('modeEdit').setAttribute('aria-pressed', String(!S.view));
    if (quiet || !S.root) return;
    renderTree(); renderInspector(); updateTools();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveLocal(false), 900);
  }
  $('modeView').onclick = () => setView(true);
  $('modeEdit').onclick = () => setView(false);
  async function openPicked(files) {
    try {
      if (!files.length) return;
      $('dlgOpen').close();
      if (files.length === 1 && !files[0].webkitRelativePath) {
        const f = files[0];
        if (/\.zip$/i.test(f.name)) await openZip(await f.arrayBuffer(), f.name);
        else if (/\.xml$/i.test(f.name)) await openXmlFile(await f.arrayBuffer(), f.name);
        else throw new Error('Choose a project folder, a .zip of one, or a GEM .xml file.');
        return;
      }
      await openEntries(files.map((f) => ({ path: f.webkitRelativePath || f.name, get: () => f.arrayBuffer() })), 'project');
    } catch (e) { fail(e); }
  }
  async function openStored(name) {
    try {
      const rec = await DB.get('projects', name);
      if (!rec) throw new Error('That project is no longer in this browser.');
      const srcRec = await DB.get('sources', name);
      const root = treeFromJson(rec.tree);
      await setProject({ name: rec.name, root, links: linksFromRecords(root, rec.links), example: rec.example, zoom: rec.zoom,
        filled: rec.filled, view: rec.view, keepOpen: true, src: srcRec ? { name: srcRec.name, bytes: srcRec.bytes } : null });
      lsSet('cutgl:last', rec.name);
      return true;
    } catch (e) { fail(e); return false; }
  }

  // The files of a project folder, in the desktop app's layout plus one file of our own for passage links.
  function projectFiles() {
    const files = [
      { path: xmlFileName(), data: serializeGem(S.root) },
      { path: 'resources/GEMCutterTreeModel.xml', data: serializeTreeModel(S.root) },
      { path: 'resources/project.properties', data: '#\n#' + new Date().toString() + '\nProjectSourceFile=' + (S.src.name || '') + '\n' },
      { path: 'resources/cutgl.json', data: JSON.stringify({ format: 1, name: S.name, saved: new Date().toISOString(), zoom: S.zoom, links: linkRecords() }) },
    ];
    if (S.src.bytes) files.push({ path: S.src.name, data: S.src.bytes });
    return files;
  }
  async function saveProjectZip() {
    try {
      await loadScript(CDN.jszip);
      const zip = new window.JSZip();
      const dir = fileSafe(S.name);
      const f = zip.folder(dir);
      for (const file of projectFiles()) f.file(file.path, file.data);
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      await saveFile(dir + '.zip', blob, 'application/zip');
    } catch (e) { fail(e, 'The project could not be saved.'); }
  }
  async function exportXml() {
    try {
      const xml = serializeGem(S.root);
      const name = xmlFileName();
      await downloadsReady;
      if (viewerDownloads && !VIEWER_EXT.test(name)) { // this viewer only hands over certain file types, so the XML travels in a zip
        await loadScript(CDN.jszip);
        const zip = new window.JSZip();
        zip.file(name, xml);
        await saveFile(name.replace(/\.xml$/, '') + '-xml.zip', await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }));
      } else await saveFile(name, xml, 'application/xml');
    } catch (e) { fail(e); }
  }
  function convertGem() {
    const added = completeToSchema(S.root, schema);
    if (!added) { toast('Nothing to add: the tree already has every GEM III element.'); return; }
    changed(true);
    toast('Added ' + fmt(added) + ' GEM III element' + (added === 1 ? '' : 's') + ' that were missing.');
  }

  // ---- new project / attach
  let newDoc = null;
  function readDocFile(file) {
    if (sourceTypeOf(file.name) === 'doc') throw new Error('Old Word .doc files cannot be read here. Save the guideline as .docx, RTF or PDF and try again.');
    return file.arrayBuffer().then((bytes) => ({ name: file.name, bytes }));
  }
  let pickDocFor = null;
  $('pickDoc').addEventListener('change', async () => {
    const f = $('pickDoc').files[0];
    $('pickDoc').value = '';
    if (!f) return;
    try {
      const doc = await readDocFile(f);
      if (pickDocFor === 'new') { newDoc = doc; $('newFile').textContent = f.name; $('newFile').classList.remove('muted'); if (!$('newName').value) $('newName').value = f.name.replace(/\.[^.]+$/, '').replace(/\s+/g, '_'); }
      else await attachDoc(doc);
    } catch (e) { if (pickDocFor === 'new') { $('newErr').textContent = e.message; $('newErr').hidden = false; } else fail(e); }
  });
  $('newPick').onclick = () => { pickDocFor = 'new'; $('pickDoc').click(); };
  function openNewDialog() {
    newDoc = null;
    $('newName').value = ''; $('newErr').hidden = true;
    $('newFile').textContent = 'PDF, HTML, RTF, .docx or plain text. You can attach it later.';
    $('newFile').classList.add('muted');
    $('dlgNew').showModal();
  }
  $('newForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const name = $('newName').value.trim();
    if (!name) { $('newErr').textContent = 'Give the project a name.'; $('newErr').hidden = false; return; }
    let existing = null;
    try { existing = await DB.get('projects', name); } catch (e) { existing = null; }
    if (existing) { $('newErr').textContent = 'A project called “' + name + '” is already saved in this browser. Choose another name.'; $('newErr').hidden = false; return; }
    $('dlgNew').close();
    await setProject({ name, root: instantiate(schema.root), src: newDoc, links: [] });
    await saveLocal(true);
    toast('Created ' + name + '.');
  });
  async function attachDoc(doc) {
    if (S.links.length && !(await confirmDlg('Replace the guideline document?', 'The ' + S.links.length + ' passage link' + (S.links.length === 1 ? '' : 's') + ' to the current document will be removed. Element text is kept.', 'Replace'))) return;
    S.links = [];
    S.src = { type: sourceTypeOf(doc.name), name: doc.name, bytes: doc.bytes };
    S.example = false; setTitle();
    renderTree(); renderInspector(); updateCounts();
    await showSource();
    await saveLocal(true);
  }

  // ---- open dialog
  async function openOpenDialog() {
    const list = $('openList');
    list.replaceChildren();
    let recs = [];
    try { recs = await DB.all('projects'); } catch (e) { recs = []; }
    recs.sort((a, b) => b.updated - a.updated);
    $('openNone').hidden = recs.length > 0;
    for (const r of recs) {
      const li = h('li', null,
        h('button', { class: 'p-open', onclick: async () => { $('dlgOpen').close(); if (await openStored(r.name)) toast('Opened ' + r.name + '.'); } },
          h('span', { class: 'p-name', text: r.name }), h('span', { class: 'p-when', text: new Date(r.updated).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) })),
        h('button', { class: 'p-del', title: 'Remove from this browser', 'aria-label': 'Remove ' + r.name + ' from this browser', text: '×', onclick: async () => {
          if (!(await confirmDlg('Remove from this browser?', '“' + r.name + '” will be deleted from this browser\'s storage. Files on your computer are not affected.', 'Remove'))) return;
          try { await DB.del('projects', r.name); await DB.del('sources', r.name); } catch (e) { /* nothing stored */ }
          li.remove();
          if (!list.children.length) $('openNone').hidden = false;
        } }));
      list.append(li);
    }
    const sl = $('sampleList');
    sl.replaceChildren();
    for (const s of SAMPLES) {
      sl.append(h('li', null, h('button', { class: 'p-open', onclick: async () => { $('dlgOpen').close(); try { await openSample(s.id); } catch (e) { fail(e); } } },
        h('span', { class: 'p-name', text: s.label }), h('span', { class: 'p-when', text: s.kind }))));
    }
    $('dlgOpen').showModal();
  }
  $('openFolder').onclick = () => $('pickFolder').click();
  $('openFile').onclick = () => $('pickFile').click();
  $('pickFolder').addEventListener('change', () => { const f = Array.from($('pickFolder').files); $('pickFolder').value = ''; openPicked(f); });
  $('pickFile').addEventListener('change', () => { const f = Array.from($('pickFile').files); $('pickFile').value = ''; openPicked(f); });

  // ---- drag a folder / zip / xml onto the page
  let dragDepth = 0;
  const hasFiles = (ev) => ev.dataTransfer && Array.from(ev.dataTransfer.types || []).includes('Files');
  window.addEventListener('dragenter', (ev) => { if (!hasFiles(ev)) return; dragDepth++; $('drop').hidden = false; });
  window.addEventListener('dragleave', (ev) => { if (!hasFiles(ev)) return; dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) $('drop').hidden = true; });
  window.addEventListener('dragover', (ev) => { if (hasFiles(ev)) ev.preventDefault(); });
  window.addEventListener('drop', async (ev) => {
    if (!hasFiles(ev)) return;
    ev.preventDefault();
    dragDepth = 0; $('drop').hidden = true;
    try {
      const items = Array.from(ev.dataTransfer.items || []);
      const fsEntries = items.map((it) => (it.webkitGetAsEntry ? it.webkitGetAsEntry() : null)).filter(Boolean);
      const dirs = fsEntries.filter((e) => e.isDirectory);
      if (dirs.length) {
        const out = [];
        const readDir = (dir) => new Promise((resolve, reject) => {
          const reader = dir.createReader();
          const acc = [];
          const more = () => reader.readEntries((batch) => { if (!batch.length) resolve(acc); else { acc.push(...batch); more(); } }, reject);
          more();
        });
        const walk = async (entry) => {
          if (entry.isFile) {
            const file = await new Promise((resolve, reject) => entry.file(resolve, reject));
            out.push({ path: entry.fullPath.replace(/^\//, ''), get: () => file.arrayBuffer() });
          } else for (const c of await readDir(entry)) await walk(c);
        };
        for (const d of dirs) await walk(d);
        await openEntries(out, dirs[0].name);
        return;
      }
      const files = Array.from(ev.dataTransfer.files || []);
      if (!files.length) return;
      const f = files[0];
      if (/\.zip$/i.test(f.name)) await openZip(await f.arrayBuffer(), f.name);
      else if (/\.xml$/i.test(f.name)) await openXmlFile(await f.arrayBuffer(), f.name);
      else if (DOC_EXT.test(f.name) || /\.doc$/i.test(f.name)) await attachDoc(await readDocFile(f));
      else throw new Error('Drop a project folder, a .zip of one, a GEM .xml file, or a guideline document.');
    } catch (e) { fail(e); }
  });

  // ---------------------------------------------------------------- XML view
  let shownXml = '';
  function viewXml() {
    shownXml = serializeGem(S.root);
    $('xmlBody').textContent = shownXml;
    $('xmlSave').textContent = viewerDownloads ? 'Download (zipped)' : 'Download .xml';
    $('dlgText').showModal();
    $('xmlBody').scrollTop = 0;
  }
  $('xmlCopy').onclick = async () => {
    try { await navigator.clipboard.writeText(shownXml); toast('XML copied.'); } catch (e) {
      const r = new Range(); r.selectNodeContents($('xmlBody'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      toast('Copying is blocked here. The XML is selected: press Ctrl+C or ⌘C.');
    }
  };
  $('xmlSave').onclick = exportXml;

  // ---------------------------------------------------------------- reports (the original XSLT stylesheets)
  let report = { key: '', html: '' };
  function resultToHtml(doc) {
    const root = doc && doc.documentElement;
    if (!root) throw new Error('The stylesheet produced no output.');
    const isHtmlNs = root.namespaceURI === 'http://www.w3.org/1999/xhtml';
    let out = (typeof HTMLDocument !== 'undefined' && doc instanceof HTMLDocument) || isHtmlNs ? root.outerHTML : new XMLSerializer().serializeToString(root);
    if (String(root.localName).toLowerCase() !== 'html') out = '<html><body>' + out + '</body></html>';
    if (!/<meta[^>]+charset/i.test(out)) {
      out = /<head[\s>]/i.test(out) ? out.replace(/<head[^>]*>/i, (m) => m + '<meta charset="utf-8">') : out.replace(/<html[^>]*>/i, (m) => m + '<head><meta charset="utf-8"></head>');
    }
    return '<!DOCTYPE html>\n' + out;
  }
  async function xsltTransform(xmlText, xslText, forcePolyfill) {
    const run = (Proc) => {
      const p = new Proc();
      p.importStylesheet(parseXml(xslText, 'The stylesheet'));
      return resultToHtml(p.transformToDocument(parseXml(xmlText, 'The GEM document')));
    };
    let nativeErr = null;
    if (NativeXSLT && !forcePolyfill) {
      try { return { html: run(NativeXSLT), engine: 'native' }; } catch (e) { nativeErr = e; }
    }
    try {
      window.xsltDontAutoloadXmlDocs = true; window.xsltPolyfillQuiet = true;
      await loadScript(CDN.xslt);
      if (typeof window.xsltPolyfillReady === 'function') await window.xsltPolyfillReady();
      return { html: run(window.XSLTProcessor), engine: 'polyfill' };
    } catch (e) {
      throw new Error('The report could not be produced' + (nativeErr ? ' (' + (nativeErr.message || nativeErr) + ')' : '') + ': ' + (e.message || e));
    }
  }
  function reportXsl(key) {
    if (S.customXsl[key]) return S.customXsl[key];
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    // The Detailed report asked a Yale server for today's date; that server is gone, so the date is supplied here.
    // Two of the sheets declare XSLT 2.0 but use only 1.0 features; browsers run XSLT 1.0.
    return RES.xsl[key].replace(/select="document\('http:\/\/gem\.med\.yale\.edu\/date\.php'\)\/timestamp"/, 'select="\'' + today + '\'"')
      .replace(/(<xsl:stylesheet\b[^>]*\bversion=")2\.0"/, '$11.0"');
  }
  async function runReport(key) {
    try {
      const out = await xsltTransform(serializeGem(S.root), reportXsl(key));
      report = { key, html: out.html };
      $('dlgReportT').textContent = REPORTS[key] + ' report' + (S.customXsl[key] ? ' (custom stylesheet)' : '');
      const host = $('repHost');
      const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
      shadow.replaceChildren();
      const base = document.createElement('style');
      base.textContent = ':host{display:block}.rep{padding:18px 20px;font:14px/1.4 Arial,Helvetica,sans-serif;color:var(--paper-fg);background:var(--paper);min-height:100%;overflow-wrap:anywhere}.rep table{max-width:100%}';
      const wrap = h('div', { class: 'rep' });
      sanitizeInto(wrap, out.html, { report: true });
      shadow.append(base, wrap);
      $('repPrint').hidden = IN_VIEWER;
      if (!$('dlgReport').open) $('dlgReport').showModal();
      host.scrollTop = 0;
    } catch (e) { fail(e); }
  }
  $('repSave').onclick = () => saveFile(fileSafe(S.name) + '_' + REPORTS[report.key].replace(/\s+/g, '') + '_Report.html', report.html, 'text/html');
  $('repPrint').onclick = () => {
    const f = h('iframe', { style: 'position:fixed;right:0;bottom:0;width:0;height:0;border:0', 'aria-hidden': 'true' });
    f.onload = () => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { toast('Printing is not available here. Save the report and print the file.'); } setTimeout(() => f.remove(), 120000); };
    f.srcdoc = report.html;
    document.body.append(f);
  };
  $('repXsl').onclick = () => $('pickXsl').click();
  $('pickXsl').addEventListener('change', async () => {
    const f = $('pickXsl').files[0];
    $('pickXsl').value = '';
    if (!f) return;
    try {
      const text = decodeText(await f.arrayBuffer());
      parseXml(text, f.name);
      S.customXsl[report.key] = text;
      await runReport(report.key);
    } catch (e) { fail(e); }
  });

  // ---------------------------------------------------------------- logic window
  let logicHolder = null, logicFocus = null;
  function openLogic() {
    let holder = S.sel;
    if (holder && holder.name === 'Logic') holder = holder.parent;
    if (!holder || !(holder.name === 'Conditional' || holder.name === 'Imperative')) return;
    logicHolder = holder;
    const cond = holder.name === 'Conditional';
    const lists = logicLists(holder);
    const logicNode = holder.kids.find((k) => k.name === 'Logic');
    const parts = logicNode ? splitLogic(logicNode.text) : null;
    $('dlgLogicT').textContent = cond ? 'Conditional logic' : 'Imperative';
    $('lgIf').disabled = !cond;
    for (const b of $('lgIfBox').querySelectorAll('.ops button')) b.disabled = !cond;
    $('lgDvBox').hidden = !cond;
    $('lgActT').textContent = cond ? 'Actions' : 'Directives';
    if (cond) {
      $('lgIf').value = parts ? parts.ifPart : '';
      $('lgThen').value = parts ? parts.thenPart : '';
    } else {
      $('lgIf').value = '';
      $('lgThen').value = parts && parts.thenPart
        ? parts.thenPart.replace(/[\r\n]+/g, ' ').replace(/\s*\b(AND|OR)\b\s*/g, '\n$1\n').trim()
        : lists.directives.join('\n');
    }
    const fill = (ul, items, target, none) => {
      ul.replaceChildren();
      if (!items.length) { ul.append(h('li', { class: 'none', text: none })); return; }
      for (const t of items) {
        const li = h('li', { text: t, draggable: 'true', tabindex: '0', role: 'button' });
        const put = () => insertAtCaret(logicFocus && !logicFocus.disabled ? logicFocus : $(target), t);
        li.addEventListener('click', put);
        li.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); put(); } });
        li.addEventListener('dragstart', (ev) => ev.dataTransfer.setData('text/plain', t));
        ul.append(li);
      }
    };
    fill($('lgDvs'), lists.dvs, 'lgIf', 'No decision variables have text yet.');
    fill($('lgActs'), cond ? lists.actions : lists.directives, 'lgThen', cond ? 'No actions have text yet.' : 'No directives have text yet.');
    logicFocus = cond ? $('lgIf') : $('lgThen');
    $('dlgLogic').showModal();
    logicFocus.focus();
  }
  function insertAtCaret(ta, text) {
    const s = ta.selectionStart == null ? ta.value.length : ta.selectionStart;
    const e = ta.selectionEnd == null ? s : ta.selectionEnd;
    ta.setRangeText(text, s, e, 'end');
    ta.focus();
  }
  for (const ta of [$('lgIf'), $('lgThen')]) ta.addEventListener('focus', () => { logicFocus = ta; });
  for (const ops of document.querySelectorAll('#dlgLogic .ops')) {
    ops.addEventListener('click', (ev) => {
      const op = ev.target.dataset && ev.target.dataset.op;
      if (!op) return;
      const ta = $(ops.dataset.for);
      let text = op;
      if (op === ')') text = ') ';
      else if (op === 'NOT') text = 'NOT ';
      else if (op === 'AND' || op === 'OR') {
        const col = ta.selectionStart - (ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1);
        text = col === 0 ? op + ' \n' : '\n' + op + '\n';
      }
      insertAtCaret(ta, text);
    });
  }
  $('lgSave').onclick = () => {
    const holder = logicHolder;
    if (!holder) return;
    let logicNode = holder.kids.find((k) => k.name === 'Logic');
    let structural = false;
    if (!logicNode) {
      logicNode = addKid(holder, mkNode('Logic'));
      const ids = maxIds(S.root);
      logicNode.id = String(ids.Logic || 1);
      structural = true;
    }
    logicNode.text = joinLogic($('lgIf').value, $('lgThen').value);
    logicNode.source = 'inferred';
    $('dlgLogic').close();
    changed(structural);
    if (!structural) updateRow(logicNode);
    renderInspector(); updateTools();
  };

  // ---------------------------------------------------------------- menus, actions, layout
  const ACTIONS = {
    new: openNewDialog,
    open: openOpenDialog,
    save: saveProjectZip,
    attach: () => { pickDocFor = 'attach'; $('pickDoc').click(); },
    exportXml,
    convert: convertGem,
    locate: locateSelected,
    locateAll: () => locateAll(false),
    about: () => $('dlgAbout').showModal(),
    viewXml,
    copyLink,
    expandAll: () => setOpenAll(true),
    collapseAll: () => setOpenAll(false),
    report: (btn) => runReport(btn.dataset.report),
    insert: () => moveText('insert'),
    append: () => moveText('append'),
    replace: () => moveText('replace'),
    clear: clearText,
    addSub, delSub,
    logic: openLogic,
  };
  function closeMenus() {
    for (const m of document.querySelectorAll('.menu')) m.hidden = true;
    for (const b of document.querySelectorAll('.mbtn')) b.setAttribute('aria-expanded', 'false');
  }
  document.addEventListener('click', (ev) => {
    const mb = ev.target.closest('.mbtn');
    if (mb) {
      const menu = mb.nextElementSibling;
      const open = menu.hidden;
      closeMenus();
      if (open) { menu.hidden = false; mb.setAttribute('aria-expanded', 'true'); }
      return;
    }
    const act = ev.target.closest('[data-act]');
    closeMenus();
    if (act && !act.disabled && S.view && EDIT_ACTS.has(act.dataset.act)) toast('Switch to Edit to change the document.');
    else if (act && !act.disabled && ACTIONS[act.dataset.act]) ACTIONS[act.dataset.act](act);
    const closer = ev.target.closest('[data-close]');
    if (closer) { const d = closer.closest('dialog'); if (d) d.close(); }
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeMenus();
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); saveProjectZip(); }
  });
  $('filledOnly').addEventListener('change', () => { S.filled = $('filledOnly').checked; renderTree(); });

  function setTab(tab) {
    $('panes').dataset.tab = tab;
    for (const b of document.querySelectorAll('.tabs button')) b.setAttribute('aria-selected', String(b.dataset.tab === tab));
    if (tab === 'src') relayoutSoon();
  }
  for (const b of document.querySelectorAll('.tabs button')) b.addEventListener('click', () => setTab(b.dataset.tab));

  (function splitter() {
    const sp = $('split'), panes = $('panes');
    const setW = (px) => {
      const total = panes.clientWidth;
      panes.style.setProperty('--src-w', Math.round(Math.max(220, Math.min(px, total - 560))) + 'px');
    };
    sp.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      sp.setPointerCapture(ev.pointerId);
      sp.classList.add('drag');
      const left = panes.getBoundingClientRect().left;
      const move = (e) => setW(e.clientX - left);
      const up = () => { sp.classList.remove('drag'); sp.removeEventListener('pointermove', move); sp.removeEventListener('pointerup', up); relayoutSoon(); };
      sp.addEventListener('pointermove', move);
      sp.addEventListener('pointerup', up);
    });
    sp.addEventListener('keydown', (ev) => {
      if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
      ev.preventDefault();
      setW($('paneSrc').clientWidth + (ev.key === 'ArrowLeft' ? -40 : 40));
      relayoutSoon();
    });
  })();

  window.addEventListener('beforeunload', () => { if (saveTimer) saveLocal(false); });

  // ---------------------------------------------------------------- sample projects (invented guidelines, see samples.js)
  function buildSample(def) {
    const root = instantiate(schema.root);
    const marks = [];
    const h = {
      root,
      at: (from, path) => path.split('/').reduce((n, name) => n && n.kids.find((k) => k.name === name), from),
      put: (node, quote, opts) => {
        const o = opts || {};
        node.text = o.text || quote;
        node.source = o.source || 'explicit';
        if (quote && !o.noLink) marks.push({ node, quote, nth: o.nth || 0 });
        return node;
      },
      another: (node) => createSubtree(node, schema),
      logic: joinLogic,
    };
    def.build(h);
    let bytes;
    if (def.base64 != null) {
      const bin = atob(def.base64);
      const u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      bytes = u8.buffer;
    } else bytes = new TextEncoder().encode(def.text).buffer;
    return { name: def.name, root, links: [], example: true, src: { name: def.file, bytes }, marks };
  }
  async function openSample(id) {
    const def = SAMPLES.find((s) => s.id === id) || SAMPLES[0];
    const p = buildSample(def);
    await setProject(p);
    if (S.src.type === 'pdf' && PDF.textsReady) await PDF.textsReady;
    const locate = buildLocator();
    for (const m of p.marks) {
      const hit = locate(m.quote, m.nth);
      if (hit) for (const seg of hit.segs) S.links.push({ node: m.node, page: seg.page, start: seg.start, end: seg.end, quote: seg.quote });
    }
    renderTree(); updateCounts(); queueHighlights();
    const first = S.links[0];
    if (first) selectNode(first.node, { reveal: true });
  }

  // ---------------------------------------------------------------- start
  async function start() {
    let opened = false;
    const q = new URLSearchParams(location.search);
    if (q.get('xml') || q.get('project')) {
      try { await openFromLink(q); return; } catch (e) { fail(e, 'The document in the link could not be opened.'); }
    } else if (q.get('sample') && SAMPLES.some((x) => x.id === q.get('sample'))) {
      await openSample(q.get('sample'));
      if (!q.has('edit')) setView(true);
      return;
    }
    const last = lsGet('cutgl:last');
    if (last) {
      try { if (await DB.get('projects', last)) opened = await openStored(last); } catch (e) { opened = false; }
    }
    if (!opened) await openSample(SAMPLES[0].id);
    $('stSave').textContent = opened ? 'Kept in this browser' : '';
  }
  start().catch((e) => fail(e));

  // Hooks for automated checks.
  window.CutGL = {
    S, PDF, schema, openEntries, openZip, openXmlFile, setProject, selectNode, moveText, renderTree, xsltTransform, reportXsl,
    runReport, runFind, captureSelection, locateAll, locateSelected, setView, buildLocator, foldText, searchUnits, ensurePdfPage, openSample, projectFiles, saveLocal, containers, ctrText, mkRange,
    setPending: (p) => { pendingSel = p; queueHighlights(); }, getReport: () => report, HL,
  };
})();
