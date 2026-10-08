// ---- Java object-stream reader (enough of the protocol to read GEM Cutter's "linkbean" file) ----
function parseJavaSerialized(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let p = 0;
  const handles = [];
  const u1 = () => dv.getUint8(p++);
  const u2 = () => { const v = dv.getUint16(p); p += 2; return v; };
  const i4 = () => { const v = dv.getInt32(p); p += 4; return v; };
  const i8 = () => { const hi = dv.getInt32(p), lo = dv.getUint32(p + 4); p += 8; return hi * 4294967296 + lo; };
  const utf = (len) => {
    let s = ''; const end = p + len;
    while (p < end) {
      const a = u1();
      if (a < 0x80) s += String.fromCharCode(a);
      else if ((a & 0xE0) === 0xC0) s += String.fromCharCode(((a & 0x1F) << 6) | (u1() & 0x3F));
      else { const b = u1(), c = u1(); s += String.fromCharCode(((a & 0x0F) << 12) | ((b & 0x3F) << 6) | (c & 0x3F)); }
    }
    return s;
  };
  const keep = (o) => { handles.push(o); return o; };
  const ref = () => { const h = i4() - 0x7E0000; if (h < 0 || h >= handles.length) throw new Error('bad back-reference'); return handles[h]; };
  const prim = (t) => {
    switch (t) {
      case 'B': { const v = dv.getInt8(p); p += 1; return v; }
      case 'C': return String.fromCharCode(u2());
      case 'D': { const v = dv.getFloat64(p); p += 8; return v; }
      case 'F': { const v = dv.getFloat32(p); p += 4; return v; }
      case 'I': return i4();
      case 'J': return i8();
      case 'S': { const v = dv.getInt16(p); p += 2; return v; }
      case 'Z': return u1() !== 0;
    }
    throw new Error('unknown primitive type ' + t);
  };
  function annotations() {
    const out = [];
    for (;;) {
      if (dv.getUint8(p) === 0x78) { p++; return out; }
      out.push(content());
    }
  }
  function classDesc() {
    const tc = u1();
    if (tc === 0x70) return null;
    if (tc === 0x71) return ref();
    if (tc === 0x72) {
      const d = { name: utf(u2()), fields: [] };
      i8();
      keep(d);
      d.flags = u1();
      const n = u2();
      for (let i = 0; i < n; i++) {
        const t = String.fromCharCode(u1());
        const name = utf(u2());
        if (t === 'L' || t === '[') content();
        d.fields.push({ t, name });
      }
      annotations();
      d.sup = classDesc();
      return d;
    }
    if (tc === 0x7D) {
      const d = { name: '$Proxy', fields: [], flags: 0x02 };
      keep(d);
      const n = i4();
      for (let i = 0; i < n; i++) utf(u2());
      annotations();
      d.sup = classDesc();
      return d;
    }
    throw new Error('unexpected class descriptor tag 0x' + tc.toString(16));
  }
  function content() {
    const tc = u1();
    switch (tc) {
      case 0x70: return null;
      case 0x71: return ref();
      case 0x74: return keep(utf(u2()));
      case 0x7C: return keep(utf(i8()));
      case 0x72: case 0x7D: p--; return classDesc();
      case 0x76: return keep({ $class: 'java.lang.Class', desc: classDesc() });
      case 0x75: {
        const d = classDesc(); const arr = keep([]); const n = i4(); const et = d.name.charAt(1);
        for (let i = 0; i < n; i++) arr.push(et === 'L' || et === '[' ? content() : prim(et));
        return arr;
      }
      case 0x7E: { const d = classDesc(); const o = keep({ $class: d.name }); o.value = content(); return o; }
      case 0x73: {
        const d = classDesc(); const o = keep({ $class: d.name, $data: [] });
        const chain = []; for (let c = d; c; c = c.sup) chain.unshift(c);
        for (const c of chain) {
          if (c.flags & 0x04) {
            if (!(c.flags & 0x08)) throw new Error('unsupported externalizable data');
            o.$data.push(...annotations());
          } else {
            for (const f of c.fields) o[f.name] = (f.t === 'L' || f.t === '[') ? content() : prim(f.t);
            if (c.flags & 0x01) o.$data.push(...annotations());
          }
        }
        return o;
      }
      case 0x77: { const n = u1(); const b = bytes.subarray(p, p + n); p += n; return { $block: b }; }
      case 0x7A: { const n = i4(); const b = bytes.subarray(p, p + n); p += n; return { $block: b }; }
    }
    throw new Error('unexpected stream tag 0x' + tc.toString(16) + ' at ' + (p - 1));
  }
  if (u2() !== 0xACED) throw new Error('not a Java object stream');
  u2();
  return content();
}

// Turn the deserialised linkbean object into plain link records.
function readLegacyLinks(bytes) {
  const top = parseJavaSerialized(bytes);
  if (!top || !top.$data) return [];
  const beans = top.$data.filter((x) => x && x.$class === 'gemc.LinkBean');
  const userObj = (n) => {
    const arr = (n.$data || []).find((x) => Array.isArray(x) && x[0] === 'userObject');
    return arr ? arr[1] : null;
  };
  const labelOf = (n) => {
    const uo = n && userObj(n);
    if (uo == null) return '';
    return typeof uo === 'string' ? uo : (uo.elementProperty || '');
  };
  return beans.map((b) => {
    const comps = [];
    for (let tp = b.treepath; tp; tp = tp.parentPath) comps.unshift(tp.lastPathComponent);
    const path = [];
    for (let i = 1; i < comps.length; i++) {
      const kids = comps[i - 1] && comps[i - 1].children ? comps[i - 1].children.elementData || [] : [];
      path.push(kids.indexOf(comps[i]));
    }
    return { start: b.start, end: b.end, index: b.index, path, label: labelOf(comps[comps.length - 1]) };
  });
}
