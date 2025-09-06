const baseCaps = {
  enc: async (c, s, z = null, sp = " ") => {
    const l = x => /[A-Za-z]/.test(x), I = t => { let a = []; for ( let i = 0; i < t.length; i++ ) if ( l(t[i]) ) a.push(i); return a; };
    const te = new TextEncoder(), C = async b => { if ( typeof CompressionStream !== "function" ) return null; let cs = new CompressionStream("deflate"), w = cs.writable.getWriter(); w.write(b); w.close(); return new Uint8Array(await new Response(cs.readable).arrayBuffer()); };
    let rw = te.encode(s), cp = await C(rw), f = 0, r;
    if ( z === true ) { if ( !cp ) throw new Error("Compression not supported"); f = 1; r = cp; }
    else if ( z === false ) { r = rw; }
    else { if ( cp && cp.length < rw.length ) { f = 1; r = cp; } else { r = rw; } }
    let t = c, a = I(t), n = 8 + (r.length << 3);
    if ( a.length === 0 ) throw new Error("Cover text has no A–Z characters to encode into");
    while ( a.length < n ) { let b = t.length; t += sp + c; for ( let i = 0; i < c.length; i++ ) if ( l(c[i]) ) a.push(b + sp.length + i); }
    let e = a.length - n;
    if ( e > 127 ) { let m = e - 127, u = t.length - 1; for ( ; u >= 0 && m > 0; u-- ) if ( l(t[u]) ) m--; t = t.slice(0, u + 1); a = I(t); e = a.length - n; }
    let o = [...t];
    let h = ((f & 1) << 7) | (e & 0x7F);
    for ( let b = 7; b >= 0; b-- ) { let i = a[7 - b]; o[i] = ((h >> b) & 1) ? o[i].toUpperCase() : o[i].toLowerCase(); }
    let p = 8;
    for ( let j = 0; j < r.length; j++ ) { let v = r[j]; for ( let b = 7; b >= 0; b-- ) { let i = a[p++]; o[i] = ((v >> b) & 1) ? o[i].toUpperCase() : o[i].toLowerCase(); } }
    for ( let i = p; i < a.length; i++ ) { let k = a[i]; o[k] = Math.random() < .5 ? o[k].toLowerCase() : o[k].toUpperCase(); }
    return o.join("");
  },
  dec: async t => {
    const l = x => /[A-Za-z]/.test(x), I = s => { let a = []; for ( let i = 0; i < s.length; i++ ) if ( l(s[i]) ) a.push(i); return a; };
    const td = new TextDecoder(), U = async b => { if ( typeof DecompressionStream !== "function" ) throw new Error("Compression not supported"); let ds = new DecompressionStream("deflate"), w = ds.writable.getWriter(); w.write(b); w.close(); return new Uint8Array(await new Response(ds.readable).arrayBuffer()); };
    let a = I(t);
    if ( a.length === 0 ) throw new Error("Input has no A–Z characters to decode from");
    if ( a.length < 8 ) return "";
    let H = 0; for ( let k = 0; k < 8; k++ ) { let c = t[a[k]]; H = (H << 1) | (c === c.toUpperCase()); }
    let f = (H >> 7) & 1;
    let e = H & 0x7F;
    let d = a.length - e - 8; if ( d <= 0 ) return "";
    let B = Math.floor(d / 8), p = 8, u = new Uint8Array(B);
    for ( let i = 0; i < B; i++ ) { let v = 0; for ( let k = 0; k < 8; k++ ) { let c = t[a[p++]]; v = (v << 1) | (c === c.toUpperCase()); } u[i] = v; }
    if ( f & 1 ) { let x = await U(u); return td.decode(x); }
    return td.decode(u);
  }
};
