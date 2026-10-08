// =====================================================================
// CutGL: document model, schema, file formats.
// Behaviour follows GEM Cutter III (Yale Center for Medical Informatics).
// =====================================================================
const GEM_NS = 'http://gem.yale.edu';
const SCHEMA_FILE = 'gemschemaiii.xsd';
const ACTION_TYPES = ['test', 'test/examine', 'test/inquire', 'prescribe', 'educate/counsel', 'perform', 'prepare',
  'monitor', 'prevent', 'conclude', 'refer/consult', 'advocate', 'document', 'dispose', ''];
const CODE_SETS = ['SNOMED-CT', 'LOINC', 'RxNorm', 'ICD-9', 'ICD-10', 'CPT', 'UMLS CUI', 'NDC', 'CVX', 'X12N'];

const elKids = (el, name) => Array.from(el.children).filter((c) => !name || c.localName === name);

function parseXml(text, what) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  const err = doc.getElementsByTagName('parsererror')[0];
  if (err) throw new Error((what || 'The file') + ' is not well-formed XML.');
  return doc;
}

// Java's String.trim(): strips every char <= U+0020 and nothing else.
function javaTrim(s) {
  let a = 0, b = s.length;
  while (a < b && s.charCodeAt(a) <= 32) a++;
  while (b > a && s.charCodeAt(b - 1) <= 32) b--;
  return s.slice(a, b);
}

// ---------------------------------------------------------------- schema
function parseSchema(xsdText) {
  const top = parseXml(xsdText, 'The GEM schema').documentElement;
  const named = {};
  for (const c of elKids(top, 'complexType')) if (c.getAttribute('name')) named[c.getAttribute('name')] = c;
  const docOf = (el) => {
    const ann = elKids(el, 'annotation')[0];
    const d = ann && elKids(ann, 'documentation')[0];
    return d ? d.textContent.replace(/[\r\n]/g, ' ').replace(/\t/g, '').replace(/ {2,}/g, ' ').trim() : '';
  };
  const build = (el) => {
    const type = (el.getAttribute('type') || '').replace(/^.*:/, '');
    const ct = elKids(el, 'complexType')[0] || named[type];
    const children = [];
    const walk = (n) => {
      for (const c of n.children) {
        if (c.localName === 'element') children.push(build(c));
        else if (c.localName === 'choice' || c.localName === 'sequence' || c.localName === 'all') walk(c);
      }
    };
    if (ct) walk(ct);
    return { name: el.getAttribute('name'), doc: docOf(el), children };
  };
  const rootEl = elKids(top, 'element').find((e) => e.getAttribute('name') === 'GuidelineDocument') || elKids(top, 'element')[0];
  const root = build(rootEl);
  const byName = {};
  const queue = [root];
  while (queue.length) { // breadth-first, first definition of a name wins (as the desktop app looked them up)
    const s = queue.shift();
    if (!byName[s.name]) byName[s.name] = s;
    queue.push(...s.children);
  }
  return { root, byName };
}

// ---------------------------------------------------------------- tree nodes
let UID = 1;
function mkNode(name, text, source, id, codeset) {
  return {
    uid: UID++, name, text: text || '', source: source || 'nd', id: id == null || id === '' ? '1' : String(id),
    codeset: codeset == null ? null : String(codeset), kids: [], parent: null, open: false,
  };
}
function addKid(parent, kid, at) {
  kid.parent = parent;
  if (at == null) parent.kids.push(kid); else parent.kids.splice(at, 0, kid);
  return kid;
}
function instantiate(s) {
  const n = mkNode(s.name);
  for (const c of s.children) addKid(n, instantiate(c));
  return n;
}
function walkTree(node, fn) {
  fn(node);
  for (const k of node.kids) walkTree(k, fn);
}
function nodePath(node) {
  const p = [];
  for (let n = node; n.parent; n = n.parent) p.unshift(n.parent.kids.indexOf(n));
  return p;
}
function nodeAt(root, path) {
  let n = root;
  for (const i of path) { n = n && n.kids[i]; if (!n) return null; }
  return n;
}
function rootOf(node) { let n = node; while (n.parent) n = n.parent; return n; }
function isAncestor(a, n) { for (let x = n; x; x = x.parent) if (x === a) return true; return false; }

function schemaFor(node, schema) {
  const names = [];
  for (let n = node; n; n = n.parent) names.unshift(n.name);
  let s = schema.root;
  if (s.name !== names[0]) s = null;
  for (let i = 1; s && i < names.length; i++) s = s.children.find((c) => c.name === names[i]) || null;
  return s || schema.byName[node.name] || null;
}

function maxIds(root) {
  const m = {};
  walkTree(root, (n) => {
    const v = parseInt(n.id, 10);
    if (!isNaN(v) && (m[n.name] == null || v > m[n.name])) m[n.name] = v;
  });
  return m;
}

// "Create subtree": a blank copy of the element, inserted right after it.
// Each element of the copy takes the next free id for its element name.
function createSubtree(node, schema) {
  if (!node.parent) return null;
  const s = schemaFor(node, schema);
  const blank = (n) => { const c = mkNode(n.name); for (const k of n.kids) addKid(c, blank(k)); return c; };
  const copy = s && s.name === node.name ? instantiate(s) : blank(node);
  const ids = maxIds(rootOf(node));
  walkTree(copy, (n) => { ids[n.name] = (ids[n.name] || 0) + 1; n.id = String(ids[n.name]); });
  addKid(node.parent, copy, node.parent.kids.indexOf(node) + 1);
  return copy;
}
function canRemove(node) {
  if (!node.parent) return false;
  return node.parent.kids.filter((k) => k.name === node.name).length > 1;
}
function removeSubtree(node) {
  const p = node.parent;
  p.kids.splice(p.kids.indexOf(node), 1);
  node.parent = null;
}
// Drag and drop: only Conditional and Imperative elements move; they can be dropped on
// another Conditional/Imperative (inserted before it) or on a Recommendation (made its first child).
const isDraggable = (n) => !!n.parent && (n.name === 'Conditional' || n.name === 'Imperative');
function canDrop(node, target) {
  if (!isDraggable(node) || !target || target === node || !target.kids.length) return false;
  if (isAncestor(node, target)) return false;
  return target.name === 'Conditional' || target.name === 'Imperative' || target.name === 'Recommendation';
}
function moveNode(node, target) {
  removeSubtree(node);
  if (target.name === 'Recommendation') addKid(target, node, 0);
  else addKid(target.parent, node, target.parent.kids.indexOf(target));
}

// Add any element the GEM III schema defines that the tree lacks (the GEM II -> GEM III step).
function completeToSchema(root, schema) {
  let added = 0;
  const visit = (node, s) => {
    if (!s) return;
    s.children.forEach((sc, si) => {
      if (!node.kids.some((k) => k.name === sc.name)) {
        let at = 0;
        node.kids.forEach((k, ki) => {
          const idx = s.children.findIndex((c) => c.name === k.name);
          if (idx !== -1 && idx < si) at = ki + 1;
        });
        const fresh = instantiate(sc);
        walkTree(fresh, () => { added++; });
        addKid(node, fresh, at);
      }
    });
    for (const k of node.kids) visit(k, s.children.find((c) => c.name === k.name));
  };
  visit(root, schema.root.name === root.name ? schema.root : null);
  return added;
}
const GEM3_ONLY = ['GEMCutHistory', 'BenefitHarmAssessment', 'StatementOfFact', 'COIPolicy', 'PatientAndPublicInvolvement'];
function looksLikeGem2(root) {
  let found = false;
  walkTree(root, (n) => { if (GEM3_ONLY.includes(n.name)) found = true; });
  return !found;
}

// Text taken from the guideline: join hyphenated line breaks, turn other line breaks into spaces.
function filterSelection(text) {
  return text.replace(/­/g, '').replace(/-\r?\n/g, '').replace(/[ \t]*\r?\n[ \t]*/g, ' ').replace(/^ +| +$/g, '');
}

// ---------------------------------------------------------------- GEM XML out
const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#13;');
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  .replace(/\n/g, '&#10;').replace(/\r/g, '&#13;').replace(/\t/g, '&#9;');
const xmlName = (s) => {
  let n = String(s).replace(/[^A-Za-z0-9_.\-\u00C0-\uD7FF\uE000-\uFFFC]/g, '_');
  if (!/^[A-Za-z_\u00C0-\uD7FF\uE000-\uFFFC]/.test(n)) n = '_' + n;
  return n;
};
// Strip characters XML 1.0 cannot carry.
const xmlChars = (s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '');

// Same layout the desktop app writes: one element per line, no indentation.
function serializeGem(root) {
  const out = [];
  const ser = (n) => {
    const name = xmlName(n.name);
    out.push('<', name);
    if (name.endsWith('Code') && n.codeset != null) out.push(' codeset="', escAttr(xmlChars(n.codeset)), '"');
    out.push(' id="', escAttr(n.id), '" source="', escAttr(n.source), '"');
    const text = xmlChars(javaTrim(n.text));
    if (!text && !n.kids.length) { out.push('/>'); return; }
    out.push('>', escText(text));
    n.kids.forEach((k, i) => { if (i > 0 || !text) out.push('\n'); ser(k); });
    if (n.kids.length) out.push('\n');
    out.push('</', name, '>');
  };
  const rn = xmlName(root.name);
  out.push('<?xml version="1.0" encoding="UTF-8"?><', rn, ' xmlns="', GEM_NS,
    '" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="', GEM_NS, ' ', SCHEMA_FILE, '">');
  for (const k of root.kids) { out.push('\n'); ser(k); }
  out.push('\n</', rn, '>\n');
  return out.join('');
}

// ---------------------------------------------------------------- GEM XML in
function parseGemXml(text) {
  const doc = parseXml(text, 'This');
  const top = doc.documentElement;
  if (top.localName !== 'GuidelineDocument') {
    throw new Error('This is not a GEM file: its root element is <' + top.localName + '>, not <GuidelineDocument>.');
  }
  const conv = (el, isRoot) => {
    let t = '';
    for (const c of el.childNodes) if ((c.nodeType === 3 || c.nodeType === 4) && /\S/.test(c.data)) t += c.data;
    const n = mkNode(el.localName, isRoot ? '' : javaTrim(t), el.getAttribute('source') || 'nd',
      el.getAttribute('id') || '1', el.hasAttribute('codeset') ? el.getAttribute('codeset') : null);
    for (const c of el.children) addKid(n, conv(c, false));
    return n;
  };
  return conv(top, true);
}

// ---------------------------------------------------------------- desktop tree model (java.beans.XMLEncoder)
function splitLabel(label) {
  const m = /^<([\s\S]*?)>/.exec(label);
  if (!m) return { name: javaTrim(label), text: '' };
  return { name: javaTrim(m[1]), text: javaTrim(label.slice(m[0].length)) };
}
function parseTreeModel(text) {
  const doc = parseXml(text, 'GEMCutterTreeModel.xml');
  const byId = {};
  for (const o of doc.getElementsByTagName('object')) if (o.getAttribute('id')) byId[o.getAttribute('id')] = o;
  const deref = (o) => (o && o.getAttribute('idref') && byId[o.getAttribute('idref')]) || o;
  const strOf = (v) => {
    const s = elKids(v, 'string')[0];
    if (!s) return null;
    let out = '';
    for (const c of s.childNodes) {
      if (c.nodeType === 3 || c.nodeType === 4) out += c.data;
      else if (c.nodeType === 1 && c.localName === 'char') out += String.fromCharCode(parseInt((c.getAttribute('code') || '#20').slice(1), 16));
    }
    return out;
  };
  const isNode = (o) => /DefaultMutableTreeNode$/.test(o.getAttribute('class') || '');
  const conv = (obj) => {
    let label = '', id = null, source = null, codeset = null;
    const voids = elKids(obj, 'void');
    for (const v of voids) {
      if (v.getAttribute('property') !== 'userObject') continue;
      const bean = deref(elKids(v, 'object')[0]);
      if (!bean) { label = strOf(v) || ''; continue; }
      for (const pv of elKids(bean, 'void')) {
        const val = strOf(pv);
        switch (pv.getAttribute('property')) {
          case 'elementProperty': label = val || ''; break;
          case 'attributeIDProperty': id = val; break;
          case 'attributeSourceProperty': source = val; break;
          case 'attributeCodeSetProperty': codeset = val; break;
        }
      }
    }
    const parts = splitLabel(label);
    const n = mkNode(parts.name, parts.text, source, id, codeset);
    for (const v of voids) {
      if (v.getAttribute('method') !== 'add') continue;
      const o = deref(elKids(v, 'object')[0]);
      if (o && isNode(o)) addKid(n, conv(o));
    }
    return n;
  };
  const first = Array.from(doc.getElementsByTagName('object')).find(isNode);
  if (!first) throw new Error('GEMCutterTreeModel.xml does not contain a tree.');
  const root = conv(first);
  root.text = '';
  return root;
}

// Written so the desktop app can open a project saved here.
function serializeTreeModel(root) {
  const enc = (s) => {
    let out = '';
    for (const ch of s) {
      const c = ch.codePointAt(0);
      if (ch === '&') out += '&amp;';
      else if (ch === '<') out += '&lt;';
      else if (ch === '>') out += '&gt;';
      else if (ch === '"') out += '&quot;';
      else if (ch === "'") out += '&apos;';
      else if (ch === '\r') out += '&#13;';
      else if (c < 0x20 && c !== 9 && c !== 10) out += '<char code="#' + c.toString(16) + '"/>';
      else out += ch;
    }
    return out;
  };
  const out = ['<?xml version="1.0" encoding="UTF-8"?>\n<java version="1.8.0" class="java.beans.XMLDecoder">\n',
    ' <object class="javax.swing.tree.DefaultTreeModel">\n'];
  const prop = (pad, name, value) => {
    out.push(pad, '<void property="', name, '">\n', pad, ' <string>', enc(value), '</string>\n', pad, '</void>\n');
  };
  const ser = (n, depth, isRoot) => {
    const pad = ' '.repeat(depth);
    out.push(pad, '<object class="javax.swing.tree.DefaultMutableTreeNode">\n');
    out.push(pad, ' <void property="userObject">\n', pad, '  <object class="gemc.UserObjectBean">\n');
    if (n.codeset != null) prop(pad + '   ', 'attributeCodeSetProperty', n.codeset);
    prop(pad + '   ', 'attributeIDProperty', n.id);
    prop(pad + '   ', 'attributeSourceProperty', n.source);
    const text = isRoot ? '' : javaTrim(n.text);
    prop(pad + '   ', 'elementProperty', '<' + n.name + '> ' + (text ? text + ' ' : ''));
    out.push(pad, '  </object>\n', pad, ' </void>\n');
    for (const k of n.kids) {
      out.push(pad, ' <void method="add">\n');
      ser(k, depth + 2, false);
      out.push(pad, ' </void>\n');
    }
    out.push(pad, '</object>\n');
  };
  ser(root, 2, true);
  out.push(' </object>\n</java>\n');
  return out.join('');
}

// ---------------------------------------------------------------- compact JSON (browser storage, project zip)
function treeToJson(n) {
  return [n.name, n.text, n.source, n.id, n.codeset, n.kids.map(treeToJson), n.open ? 1 : 0];
}
function treeFromJson(a) {
  const n = mkNode(a[0], a[1], a[2], a[3], a[4]);
  n.open = !!a[6];
  for (const k of a[5] || []) addKid(n, treeFromJson(k));
  return n;
}

// ---------------------------------------------------------------- logic statements
function splitLogic(text) {
  const m = /If([\s\S]*?)Then([\s\S]*)/.exec(text || '');
  if (!m) return null;
  return { ifPart: m[1].trim(), thenPart: m[2].trim() };
}
function joinLogic(ifPart, thenPart) {
  return ('If \n' + ifPart + '\nThen \n' + thenPart).replace(/(\r\n){2,}/g, '\r\n').replace(/\n{2,}/g, '\n');
}
function logicLists(holder) {
  const dvs = [], actions = [], directives = [];
  for (const k of holder.kids) {
    const t = javaTrim(k.text);
    if (k.name === 'DecisionVariable' && t) {
      const vals = k.kids.filter((v) => v.name === 'Value' && javaTrim(v.text)).map((v) => javaTrim(v.text));
      dvs.push(vals.length ? t + ' is [' + vals.join(',') + ']' : t);
    } else if (k.name === 'Action' && t) actions.push(t);
    else if (k.name === 'Directive' && t) directives.push(t);
  }
  return { dvs, actions, directives };
}

// ---------------------------------------------------------------- RTF -> styled runs
// Returns runs of {text, b, i, u}; paragraphs end with "\n" so offsets match a plain-text reading.
function rtfToRuns(raw) {
  const SKIP = new Set(['fonttbl', 'colortbl', 'stylesheet', 'info', 'pict', 'object', 'header', 'headerl', 'headerr',
    'headerf', 'footer', 'footerl', 'footerr', 'footerf', 'footnote', 'fldinst', 'themedata', 'colorschememapping',
    'datastore', 'latentstyles', 'listtable', 'listoverridetable', 'rsidtbl', 'generator', 'xmlnstbl', 'filetbl',
    'revtbl', 'bkmkstart', 'bkmkend', 'comment', 'annotation', 'nonshppict', 'shpinst', 'pntext', 'listtext']);
  const SYM = { emdash: '—', endash: '–', bullet: '•', lquote: '‘', rquote: '’',
    ldblquote: '“', rdblquote: '”', tab: '\t', emspace: ' ', enspace: ' ', line: '\n',
    par: '\n', sect: '\n', page: '\n', row: '\n', cell: '\t' };
  let cp = 'windows-1252';
  let dec = null;
  const decode = (byte) => {
    if (byte < 0x80) return String.fromCharCode(byte);
    try { dec = dec || new TextDecoder(cp); return dec.decode(new Uint8Array([byte])); } catch (e) { return String.fromCharCode(byte); }
  };
  const runs = [];
  const stack = [];
  let st = { skip: false, b: false, i: false, u: false, uc: 1 };
  let pendingSkip = 0;
  const emit = (text) => {
    if (st.skip || !text) return;
    const last = runs[runs.length - 1];
    if (last && last.b === st.b && last.i === st.i && last.u === st.u) last.text += text;
    else runs.push({ text, b: st.b, i: st.i, u: st.u });
  };
  const n = raw.length;
  let p = 0;
  let fresh = false; // just opened a group: the next control word may name a destination
  while (p < n) {
    const ch = raw[p];
    if (ch === '{') { stack.push(st); st = Object.assign({}, st); fresh = true; p++; continue; }
    if (ch === '}') { st = stack.pop() || st; fresh = false; p++; continue; }
    if (ch === '\r' || ch === '\n') { p++; continue; }
    if (ch !== '\\') {
      if (pendingSkip > 0) pendingSkip--; else emit(decode(raw.charCodeAt(p) & 0xFF));
      fresh = false; p++; continue;
    }
    const c2 = raw[p + 1];
    if (c2 === undefined) break;
    if (c2 === "'") {
      const byte = parseInt(raw.substr(p + 2, 2), 16);
      p += 4;
      if (pendingSkip > 0) pendingSkip--; else if (!isNaN(byte)) emit(decode(byte));
      fresh = false; continue;
    }
    if (!/[a-zA-Z]/.test(c2)) {
      p += 2;
      if (c2 === '*') { if (fresh) st.skip = true; continue; }
      if (c2 === '~') emit(' ');
      else if (c2 === '_') emit('‑');
      else if (c2 === '\\' || c2 === '{' || c2 === '}') emit(c2);
      else if (c2 === '\n' || c2 === '\r') emit('\n');
      fresh = false; continue;
    }
    let q = p + 1;
    while (q < n && /[a-zA-Z]/.test(raw[q])) q++;
    const word = raw.slice(p + 1, q);
    let num = null;
    const m = /^-?\d+/.exec(raw.slice(q, q + 12));
    if (m) { num = parseInt(m[0], 10); q += m[0].length; }
    if (raw[q] === ' ') q++;
    p = q;
    if (fresh && SKIP.has(word)) { st.skip = true; fresh = false; continue; }
    fresh = false;
    if (word === 'u' && num != null) {
      emit(String.fromCharCode(num < 0 ? num + 65536 : num));
      pendingSkip = st.uc;
    } else if (word === 'uc' && num != null) st.uc = num;
    else if (word === 'ansicpg' && num != null) { cp = 'windows-' + num; dec = null; }
    else if (word === 'b') st.b = num !== 0;
    else if (word === 'i') st.i = num !== 0;
    else if (word === 'ul') st.u = num !== 0;
    else if (word === 'ulnone') st.u = false;
    else if (word === 'plain') { st.b = false; st.i = false; st.u = false; }
    else if (word === 'bin' && num) p += num;
    else if (SYM[word]) emit(SYM[word]);
  }
  return runs;
}

// ---------------------------------------------------------------- HTML allow-list sanitiser
const SAFE_TAGS = new Set(('a abbr article aside b big blockquote br caption center cite code col colgroup dd del div dl dt em ' +
  'figcaption figure font footer h1 h2 h3 h4 h5 h6 header hr i ins li main mark ol p pre q s section small span strike ' +
  'strong sub sup table tbody td tfoot th thead tr tt u ul').split(' '));
const DROP_TAGS = new Set(('script style head title meta link iframe frame frameset object embed noscript template svg math ' +
  'input select textarea button audio video canvas source track map area base applet').split(' '));
const SAFE_ATTRS = new Set(['colspan', 'rowspan', 'align', 'valign', 'start', 'alt']);
function sanitizeInto(target, html, opts) {
  const keepStyles = !!(opts && opts.report);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const copy = (src, dst) => {
    for (const c of src.childNodes) {
      if (c.nodeType === 3) { dst.appendChild(document.createTextNode(c.data)); continue; }
      if (c.nodeType !== 1) continue;
      const tag = c.localName;
      if (DROP_TAGS.has(tag)) continue;
      if (tag === 'img') {
        const src2 = c.getAttribute('src') || '';
        if (/^data:image\/(png|jpe?g|gif|webp);/i.test(src2)) {
          const img = document.createElement('img');
          img.src = src2; img.alt = c.getAttribute('alt') || '';
          dst.appendChild(img);
        }
        continue;
      }
      if (!SAFE_TAGS.has(tag)) { copy(c, dst); continue; }
      const el = document.createElement(tag);
      for (const a of c.attributes) {
        const an = a.name.toLowerCase();
        if (SAFE_ATTRS.has(an)) el.setAttribute(an, a.value);
        else if (keepStyles && /^(class|width|height|bgcolor|color|border|cellpadding|cellspacing|size|face|style)$/.test(an) &&
          !/url\s*\(|expression|@import|javascript:/i.test(a.value)) el.setAttribute(an, a.value);
      }
      copy(c, el);
      dst.appendChild(el);
    }
  };
  if (keepStyles) {
    for (const s of doc.querySelectorAll('style')) {
      const css = s.textContent;
      if (/url\s*\(|@import|expression/i.test(css)) continue;
      const st = document.createElement('style');
      st.textContent = css;
      target.appendChild(st);
    }
  }
  copy(doc.body, target);
}

function decodeText(bytes) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let t;
  try { t = new TextDecoder('utf-8', { fatal: true }).decode(u8); } catch (e) { t = new TextDecoder('windows-1252').decode(u8); }
  return t.charCodeAt(0) === 0xFEFF ? t.slice(1) : t;
}
function latin1(bytes) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192));
  return s;
}
function sourceTypeOf(name) {
  const ext = (/\.([a-z0-9]+)$/i.exec(name || '') || [])[1];
  switch ((ext || '').toLowerCase()) {
    case 'pdf': return 'pdf';
    case 'htm': case 'html': return 'html';
    case 'rtf': return 'rtf';
    case 'docx': return 'docx';
    case 'doc': return 'doc';
    default: return 'text';
  }
}
function parseProperties(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*[#!]/.test(line)) continue;
    const m = /^\s*([^=:\s]+)\s*[=:]?\s*(.*)$/.exec(line);
    if (m) out[m[1]] = m[2].replace(/\\(.)/g, '$1');
  }
  return out;
}
