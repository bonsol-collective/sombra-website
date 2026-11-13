// @ts-nocheck: scene code ported verbatim from the "Quantum fridge — glass seal, white" export
// (.agent/reference/quantum-fridge/QuantumWhite.dc.html, lines 59–546). Only the DCLogic/React glue
// around it is replaced; every prop except `bg` falls back to the export's defaults inside tick().
import * as THREE from "three";

export class QuantumFridge {
  constructor(canvas, bg) {
    this.canvas = canvas;
    this.props = { bg }; // occluders are painted in the box colour so they read as solid
    this.cur = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.hover = false;
    this.t0 = performance.now();
    this.build();
  }
  resize(w, h) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
  /** x, y in -1…1 across the box (the export's onMouseMove). */
  pointer(x, y) { this.hover = true; this.target = { x, y }; }
  leave() { this.hover = false; }
  start() {
    if (this.raf) return;
    this.last = 0;
    const loop = () => { this.tick(); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
  }
  stop() { cancelAnimationFrame(this.raf); this.raf = 0; }
  /** Render one frame at time t (s) — for reduced motion. */
  still(t) { this.t0 = performance.now() - t * 1000; this.last = 0; this.tick(); }
  dispose() { this.stop(); this.renderer.dispose(); this.renderer.forceContextLoss(); }
  build() {
    const T = THREE;
    const renderer = new T.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    this.renderer = renderer;

    const scene = new T.Scene();
    this.scene = scene;
    this.camera = new T.PerspectiveCamera(32, 1200 / 1500, 0.1, 300);

    // line colours per material
    const lineMat = (hex) => new T.LineBasicMaterial({ color: hex, transparent: true, opacity: 0.95 });
    this.lineMats = {
      gold: lineMat(0x1a1a1a),
      copper: lineMat(0x3d3d3d),
      silver: lineMat(0x5c5c5c),
      steel: lineMat(0x9a9a9a)
    };
    this.gridMats = [];
    this.occMat = new T.MeshBasicMaterial({ color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    this.occluders = [];
    const gold = 'gold', copper = 'copper', silver = 'silver', steel = 'steel';

    const model = new T.Group();
    scene.add(model);
    this.model = model;
    const stages = [0, 1, 2, 3].map(() => { const g = new T.Group(); model.add(g); return g; });
    this.stages = stages;

    // every solid becomes: black occluder + edge lines in its metal colour
    const add = (geo, mat, x, y, z, parent) => {
      const g = new T.Group();
      g.position.set(x, y, z);
      const occ = new T.Mesh(geo, this.occMat);
      this.occluders.push(occ);
      g.add(occ);
      g.add(new T.LineSegments(new T.EdgesGeometry(geo, 1), this.lineMats[mat]));
      parent.add(g);
      return g;
    };
    const cyl = (r, h, mat, x, y, z, p, seg) => add(new T.CylinderGeometry(r, r, h, seg || 24), mat, x, y, z, p);
    const rod = (x, z, y1, y2, r, mat, p) => cyl(r, y2 - y1, mat, x, (y1 + y2) / 2, z, p, 12);
    const box = (w, h, d, mat, x, y, z, p) => add(new T.BoxGeometry(w, h, d), mat, x, y, z, p);
    // wires are drawn as single glowing lines along their path
    const tube = (pts, r, mat, p, seg) => {
      const curve = new T.CatmullRomCurve3(pts.map((a) => new T.Vector3(a[0], a[1], a[2])));
      const geo = new T.BufferGeometry().setFromPoints(curve.getPoints(seg || 48));
      const ln = new T.Line(geo, this.lineMats[mat]);
      p.add(ln);
      return ln;
    };
    const torus = (R, r, mat, x, y, z, p, rx) => {
      const g = add(new T.TorusGeometry(R, r, 6, 32), mat, x, y, z, p);
      g.rotation.x = rx === undefined ? Math.PI / 2 : rx;
      return g;
    };
    const helix = (cx, y0, cz, R, h, turns, r, mat, p) => {
      const pts = [];
      const n = Math.round(turns * 16);
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * turns * Math.PI * 2;
        pts.push([cx + Math.cos(a) * R, y0 + (i / n) * h, cz + Math.sin(a) * R]);
      }
      return tube(pts, r, mat, p, n * 2);
    };
    const polarGrid = (R, y, p) => {
      const v = [];
      [0.25, 0.45, 0.65, 0.82].forEach((f) => {
        const n = 64;
        for (let i = 0; i < n; i++) {
          const a1 = (i / n) * Math.PI * 2, a2 = ((i + 1) / n) * Math.PI * 2;
          v.push(Math.cos(a1) * R * f, y, Math.sin(a1) * R * f, Math.cos(a2) * R * f, y, Math.sin(a2) * R * f);
        }
      });
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        v.push(Math.cos(a) * R * 0.25, y, Math.sin(a) * R * 0.25, Math.cos(a) * R * 0.82, y, Math.sin(a) * R * 0.82);
      }
      const geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.Float32BufferAttribute(v, 3));
      const m = new T.LineBasicMaterial({ color: 0x1a1a1a, transparent: true, opacity: 0.22 });
      this.gridMats.push(m);
      p.add(new T.LineSegments(geo, m));
    };
    const plate = (R, y, p) => {
      cyl(R, 0.18, gold, 0, y, 0, p, 64);
      cyl(R * 0.6, 0.08, gold, 0, y - 0.13, 0, p, 48);
      polarGrid(R, y + 0.095, p);
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        cyl(0.045, 0.06, silver, Math.cos(a) * (R - 0.12), y + 0.12, Math.sin(a) * (R - 0.12), p, 8);
      }
    };
    const ringRods = (n, R, y1, y2, r, a0, p) => {
      for (let i = 0; i < n; i++) {
        const a = a0 + (i / n) * Math.PI * 2;
        const x = Math.cos(a) * R, z = Math.sin(a) * R;
        rod(x, z, y1, y2, r, silver, p);
        cyl(r * 1.7, 0.1, steel, x, (y1 + y2) / 2, z, p, 12);
      }
    };

    // floor grid
    const grid = new T.GridHelper(30, 40, 0xc4c4c4, 0xe6e6e6);
    this.grid = grid;
    grid.material.transparent = true;
    grid.position.y = -9.2;
    model.add(grid);

    // ---------- stage 0: 4 K plate, frame and top wiring ----------
    const s0 = stages[0];
    plate(3.3, 6, s0);
    [45, 135, 225, 315].forEach((d) => {
      const a = (d * Math.PI) / 180;
      rod(Math.cos(a) * 2.5, Math.sin(a) * 2.5, 6.09, 14, 0.13, silver, s0);
    });
    torus(2.5, 0.07, silver, 0, 9.6, 0, s0);
    torus(2.5, 0.07, silver, 0, 12.4, 0, s0);
    tube([[1.77, 9.6, 1.77], [0.5, 6.1, 0.4]], 0.06, silver, s0, 4);
    tube([[-1.77, 9.6, 1.77], [-0.4, 6.1, 0.5]], 0.06, silver, s0, 4);
    tube([[1.77, 9.6, -1.77], [0.2, 6.1, -0.6]], 0.06, silver, s0, 4);
    rod(0.55, -0.7, 6.09, 14, 0.17, copper, s0);
    rod(-0.45, -1.0, 6.09, 14, 0.12, copper, s0);
    rod(-1.1, 0.1, 6.09, 14, 0.09, copper, s0);
    for (let i = 0; i < 12; i++) torus(0.24, 0.05, copper, 0.55, 7.2 + i * 0.1, -0.7, s0);
    ringRods(6, 2.2, 2.79, 5.91, 0.09, Math.PI / 6, s0);
    box(1.1, 1.3, 0.6, steel, -1.3, 5.15, 0.9, s0);
    for (let i = 0; i < 8; i++) box(0.04, 1.1, 0.26, silver, -1.72 + i * 0.12, 5.15, 1.32, s0);
    for (let i = 0; i < 8; i++) cyl(0.04, 0.14, silver, -1.75 + i * 0.13, 4.45, 0.9, s0, 8);
    box(0.7, 1.0, 0.5, steel, 1.5, 5.3, 0.6, s0);
    for (let i = 0; i < 5; i++) cyl(0.04, 0.12, silver, 1.26 + i * 0.12, 5.86, 0.6, s0, 8);
    box(0.8, 0.5, 0.4, steel, 0.1, 5.4, 1.25, s0);
    for (let i = 0; i < 3; i++) { const m = cyl(0.08, 0.06, silver, -0.15 + i * 0.25, 5.4, 1.47, s0, 12); m.rotation.x = Math.PI / 2; }
    box(0.45, 0.4, 0.4, silver, 0.45, 5.7, -0.25, s0);
    for (let i = 0; i < 8; i++) {
      const x = -1.75 + i * 0.13;
      tube([[x, 4.4, 0.9], [x + 0.06, 3.6, 0.96], [x - 0.05, 1.6, 0.92], [x, 0.4, 0.9]], 0.026, copper, s0);
    }
    for (let i = 0; i < 8; i++) {
      tube([[-0.75, 5.45 - i * 0.06, 0.95], [0, 5.0 - i * 0.07, 1.5], [0.8, 5.15 - i * 0.05, 1.1], [1.15, 5.3 - i * 0.06, 0.62]], 0.022, copper, s0);
    }
    for (let i = 0; i < 7; i++) {
      tube([[1.28 + i * 0.07, 4.8, 0.6], [1.33 + i * 0.05, 3.9, 0.72], [1.38 + i * 0.04, 2.8, 0.76]], 0.022, copper, s0);
    }
    for (let i = 0; i < 4; i++) {
      tube([[0.35 + i * 0.07, 5.5, -0.25], [0.3, 4.2, -0.1], [0.05 + i * 0.1, 2.8, 0.05]], 0.024, copper, s0);
    }
    helix(2.75, 4.4, -0.6, 0.18, 1.2, 8, 0.028, copper, s0);

    // ---------- stage 1: 800 mK plate ----------
    const s1 = stages[1];
    plate(2.8, 2.7, s1);
    ringRods(6, 1.9, 0.39, 2.61, 0.08, 0, s1);
    for (let i = 0; i < 3; i++) cyl(0.07, 0.3, silver, 1.4 + i * 0.13, 2.95, 0.78, s1, 10);
    rod(-0.4, -0.9, 0.39, 2.61, 0.06, copper, s1);
    helix(-0.4, 0.7, -0.9, 0.32, 1.6, 12, 0.04, copper, s1);
    for (let i = 0; i < 18; i++) torus(0.2, 0.045, copper, 2.0, 0.8 + i * 0.09, -0.4, s1);
    cyl(0.27, 0.08, silver, 2.0, 0.7, -0.4, s1);
    cyl(0.27, 0.08, silver, 2.0, 2.45, -0.4, s1);
    for (let i = 0; i < 5; i++) cyl(0.08, 0.5, silver, -0.2 + i * 0.18, 2.3, 1.15, s1, 12);
    for (let i = 0; i < 3; i++) {
      const x = -0.4 - i * 0.12;
      tube([[x, 2.6, 1.4], [x + 0.28, 2.0, 1.45], [x - 0.22, 1.3, 1.4], [x, 0.4, 1.4]], 0.026, copper, s1);
    }
    for (let i = 0; i < 4; i++) {
      const x = 1.05 + i * 0.09;
      tube([[x, 2.6, 0.2], [x, 0.4, 0.2]], 0.024, copper, s1, 8);
    }
    for (let k = 0; k < 3; k++) box(0.42, 0.14, 0.14, steel, 1.19, 2.1 - k * 0.55, 0.2, s1);
    for (let i = 0; i < 4; i++) {
      const m = torus(0.26, 0.02, copper, -1.5 + i * 0.09, 1.5, 0.6, s1, 0);
      m.rotation.y = 0.5;
    }

    // ---------- stage 2: 100 mK plate, mixing chamber ----------
    const s2 = stages[2];
    plate(2.5, 0.3, s2);
    ringRods(6, 1.7, -2.01, 0.21, 0.075, Math.PI / 6, s2);
    cyl(0.5, 0.35, silver, 1.0, -0.1, -0.1, s2, 32);
    cyl(0.6, 0.6, steel, 1.0, -0.6, -0.1, s2, 32);
    for (let i = 0; i < 7; i++) torus(0.62, 0.025, silver, 1.0, -0.86 + i * 0.087, -0.1, s2);
    cyl(0.5, 0.7, silver, 1.0, -1.25, -0.1, s2, 32);
    box(0.16, 0.26, 0.16, steel, 1.62, -0.5, 0.1, s2);
    box(0.16, 0.26, 0.16, steel, 1.62, -0.85, 0.1, s2);
    box(0.9, 0.35, 0.35, steel, -0.1, -0.5, 1.0, s2);
    box(0.9, 0.35, 0.35, steel, -0.1, -0.95, 1.0, s2);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) {
      const m = cyl(0.06, 0.05, silver, -0.4 + i * 0.2, -0.5 - r * 0.45, 1.19, s2, 10);
      m.rotation.x = Math.PI / 2;
    }
    box(0.8, 0.9, 0.6, steel, -1.4, -0.9, 0.1, s2);
    for (let i = 0; i < 6; i++) box(0.03, 0.75, 0.2, silver, -1.65 + i * 0.1, -0.9, 0.45, s2);
    tube([[0.35, -0.5, 1.0], [0.65, -0.45, 0.7], [0.95, -0.4, 0.4]], 0.026, copper, s2);
    tube([[0.35, -0.95, 1.0], [0.7, -0.95, 0.7], [0.95, -1.1, 0.42]], 0.026, copper, s2);
    tube([[0.35, -0.6, 1.05], [0.8, -0.8, 0.75], [1.0, -1.4, 0.4]], 0.026, copper, s2);
    for (let i = 0; i < 5; i++) {
      const x = -0.45 + i * 0.1;
      tube([[x, -1.13, 1.0], [x + 0.05, -1.6, 0.92], [x, -2.0, 0.85]], 0.024, copper, s2);
    }
    tube([[-1.0, -0.7, 0.3], [-0.7, -0.6, 0.8], [-0.55, -0.5, 1.0]], 0.026, copper, s2);
    tube([[-1.0, -1.1, 0.3], [-0.75, -1.0, 0.8], [-0.55, -0.95, 1.0]], 0.026, copper, s2);
    helix(-1.4, -1.95, 0.6, 0.12, 0.45, 6, 0.02, copper, s2);

    // ---------- stage 3: 15 mK plate, shields ----------
    const s3 = stages[3];
    plate(2.3, -2.1, s3);
    for (let i = 0; i < 5; i++) cyl(0.06, 0.26, silver, 0.6 + i * 0.15, -2.36, 0.75, s3, 8);
    cyl(0.95, 0.12, silver, 0.7, -2.3, -0.1, s3, 40);
    cyl(0.85, 3.2, silver, 0.7, -3.95, -0.1, s3, 40);
    for (let i = 0; i < 4; i++) torus(0.86, 0.03, steel, 0.7, -3.0 - i * 0.7, -0.1, s3);
    cyl(0.95, 0.12, silver, 0.7, -5.6, -0.1, s3, 40);
    cyl(0.75, 0.12, steel, -0.95, -2.3, 0.35, s3, 32);
    cyl(0.65, 3.6, steel, -0.95, -4.15, 0.35, s3, 32);
    cyl(0.75, 0.12, steel, -0.95, -6.0, 0.35, s3, 32);
    for (let i = 0; i < 4; i++) { const m = cyl(0.06, 0.12, silver, -1.62, -3.0 - i * 0.8, 0.35, s3, 8); m.rotation.z = Math.PI / 2; }
    const loops = [
      [[1.4, -2.4, 0.7], [2.5, -3.0, 0.9], [2.3, -4.6, 0.5], [1.2, -5.0, 1.0], [0.3, -4.3, 1.1], [0.8, -3.6, 0.95]],
      [[1.25, -2.4, 0.75], [2.3, -3.2, 1.1], [2.1, -4.8, 0.7], [1.0, -5.2, 1.1], [0.2, -4.6, 1.15]],
      [[1.1, -2.4, 0.8], [1.9, -3.5, 1.3], [1.4, -4.9, 1.2], [0.2, -5.1, 1.2], [-0.2, -4.2, 1.0]],
      [[0.95, -2.4, 0.8], [2.6, -3.6, 0.2], [2.0, -5.4, -0.4], [0.6, -5.8, 0.6]],
      [[0.8, -2.4, 0.8], [0.2, -3.0, 1.2], [-0.3, -4.0, 1.25], [0.4, -4.7, 1.1]]
    ];
    loops.forEach((pts) => tube(pts, 0.03, copper, s3, 80));
    tube([[-0.3, -2.3, 0.9], [-0.6, -3.2, 1.25], [-1.1, -4.4, 1.2], [-0.4, -5.0, 1.15], [0.1, -4.1, 1.05]], 0.03, copper, s3, 80);
    [[-1.8, 0.2], [-1.6, -0.5], [-1.95, -0.2]].forEach((p, i) => {
      tube([[p[0], -2.2, p[1]], [p[0] - 0.05, -2.8 - i * 0.15, p[1] + 0.05], [p[0] + 0.05, -3.2 - i * 0.2, p[1]]], 0.015, copper, s3, 16);
      add(new T.SphereGeometry(0.07, 8, 6), silver, p[0] + 0.05, -3.25 - i * 0.2, p[1], s3);
    });

    // ---------- glass enclosure ----------
    this.buildGlass(T, model);
  }
  buildGlass(T, model) {
    const W = 4.6, H = 27, Y0 = -9.2;
    this.G = { W, H, Y0 };
    const grp = new T.Group();
    grp.position.y = Y0;
    grp.visible = false;
    model.add(grp);
    this.glassGroup = grp;

    // glass panes: fresnel rim + reflection streaks + a sheen band
    const paneGeo = new T.BoxGeometry(W * 2, H, W * 2);
    paneGeo.translate(0, H / 2, 0);
    this.paneU = {
      uAlpha: { value: 0 },
      uSheen: { value: -1000 },
      uColor: { value: new T.Color(0x6f8aa8) }
    };
    const pane = new T.Mesh(paneGeo, new T.ShaderMaterial({
      uniforms: this.paneU,
      transparent: true,
      depthWrite: false,
      side: T.DoubleSide,
      blending: T.NormalBlending,
      vertexShader: [
        'varying vec3 vN; varying vec3 vW;',
        'void main(){',
        '  vN = normalize(mat3(modelMatrix) * normal);',
        '  vec4 w = modelMatrix * vec4(position, 1.0);',
        '  vW = w.xyz;',
        '  gl_Position = projectionMatrix * viewMatrix * w;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uAlpha; uniform float uSheen; uniform vec3 uColor;',
        'varying vec3 vN; varying vec3 vW;',
        'void main(){',
        '  vec3 V = normalize(cameraPosition - vW);',
        '  float f = 1.0 - abs(dot(normalize(vN), V));',
        '  f = pow(f, 2.0);',
        '  float st = smoothstep(0.93, 1.0, sin(dot(vW, vec3(0.32, 0.9, 0.28)) * 0.75));',
        '  float st2 = smoothstep(0.97, 1.0, sin(dot(vW, vec3(0.32, 0.9, 0.28)) * 0.75 + 1.3));',
        '  float sh = exp(-pow((vW.y + vW.x * 0.55 - uSheen) / 1.4, 2.0));',
        '  float tint = 0.025 + 0.09 * f + 0.035 * st + 0.025 * st2;',
        '  float hi = 0.75 * sh;',
        '  vec3 col = mix(uColor, vec3(1.0), clamp(hi / (tint + hi + 0.0001), 0.0, 1.0));',
        '  float a = (tint + hi * 0.6) * uAlpha;',
        '  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));',
        '}'
      ].join('\n')
    }));
    pane.renderOrder = 10;
    grp.add(pane);

    // edges: thin glowing rods whose brightness is driven along their length
    const edgeVS = [
      'varying float vU; varying float vF;',
      'void main(){',
      '  vU = uv.y;',
      '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
      '  vec3 n = normalize(normalMatrix * normal);',
      '  vF = abs(dot(n, normalize(-mv.xyz)));',
      '  gl_Position = projectionMatrix * mv;',
      '}'
    ].join('\n');
    const edgeFS = [
      'uniform float uHead; uniform float uSeg; uniform float uTrail; uniform float uBase;',
      'uniform float uFlash; uniform float uGain; uniform float uSym; uniform float uAlpha;',
      'uniform float uComet; uniform vec3 uColor; uniform float uKb; uniform float uSoft;',
      'varying float vU; varying float vF;',
      'void main(){',
      '  float u = uSym > 0.5 ? min(vU, 1.0 - vU) * 2.0 : vU;',
      '  float d = uHead - u;',
      '  float c = d >= 0.0 ? exp(-(d * d) / (uSeg * uSeg)) : 0.0;',
      '  float tr = d >= 0.0 ? uTrail : 0.0;',
      '  float soft = pow(clamp(vF, 0.0, 1.0), uSoft);',
      '  float a = ((uBase + tr) * uKb + (c * uComet + uFlash) * uGain) * uAlpha * soft;',
      '  gl_FragColor = vec4(uColor, clamp(a, 0.0, 1.0));',
      '}'
    ].join('\n');
    this.sealColor = new T.Color(0xffffff);
    this.inkColor = new T.Color(0x0b0f17);
    const Y = new T.Vector3(0, 1, 0);
    const mkEdge = (A, B, sym, group, phase) => {
      const a = new T.Vector3(A[0], A[1], A[2]);
      const b = new T.Vector3(B[0], B[1], B[2]);
      const dir = b.clone().sub(a);
      const len = dir.length();
      dir.normalize();
      const U = {
        uHead: { value: 0 }, uSeg: { value: 0.12 }, uTrail: { value: 0 }, uBase: { value: 0 },
        uFlash: { value: 0 }, uSym: { value: sym ? 1 : 0 }, uAlpha: { value: 1 }, uComet: { value: 1 },
        uColor: { value: this.sealColor }
      };
      // [radius, comet gain, base gain, colour, draw order, softness]
      // one soft dark halo + thin dark outline, then a bright core on top: reads as a lit filament on white
      [
        [0.3, 0.22, 0, this.inkColor, 11, 3.0],
        [0.016, 0.45, 0.75, this.inkColor, 13, 0.0],
        [0.03, 1.0, 0, this.sealColor, 14, 0.6]
      ].forEach(([r, gain, kb, col, ord, sf]) => {
        const m = new T.Mesh(
          new T.CylinderGeometry(r, r, len, 24, 1, true),
          new T.ShaderMaterial({
            uniforms: Object.assign({}, U, { uGain: { value: gain }, uKb: { value: kb }, uColor: { value: col }, uSoft: { value: sf } }),
            vertexShader: edgeVS, fragmentShader: edgeFS,
            transparent: true, depthWrite: false, blending: T.NormalBlending
          })
        );
        m.position.copy(a.clone().add(b).multiplyScalar(0.5));
        m.quaternion.setFromUnitVectors(Y, dir);
        m.renderOrder = ord;
        grp.add(m);
      });
      const e = { U, phase };
      group.push(e);
      return e;
    };
    const b = [[-W, 0, -W], [W, 0, -W], [W, 0, W], [-W, 0, W]];
    const t = b.map((p) => [p[0], H, p[2]]);
    this.eBottom = []; this.eVert = []; this.eTop = [];
    for (let i = 0; i < 4; i++) mkEdge(b[i], b[(i + 1) % 4], false, this.eBottom, i * 0.25);
    for (let i = 0; i < 4; i++) mkEdge(b[i], t[i], false, this.eVert, 0.12 + i * 0.25);
    for (let i = 0; i < 4; i++) mkEdge(t[i], t[(i + 1) % 4], true, this.eTop, 0.6 + i * 0.25);
  }
  glassTick(t) {
    if (!this.glassGroup) return 0;
    const on = this.props.glass ?? true;
    if (!on) { this.glassGroup.visible = false; return 0; }
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const easeOut = (v) => 1 - Math.pow(1 - v, 3);
    const easeIO = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
    const loop = this.props.glassLoop ?? true;
    const C = Math.max(10, this.props.glassCycle ?? 16);
    const gt = loop ? t % C : t;
    const RISE0 = 0.8, RISE1 = 3.6, A1 = 4.3, V1 = 5.0, T1 = 5.6, FL1 = 6.6;
    const OUT0 = C - 1.8, OUT1 = C - 0.4;
    const out = loop ? easeIO(clamp((gt - OUT0) / (OUT1 - OUT0))) : 0;
    const h = easeOut(clamp((gt - RISE0) / (RISE1 - RISE0))) * (1 - out);
    const G = this.G;
    this.glassGroup.visible = h > 0.002;
    this.glassGroup.scale.y = Math.max(0.001, h);
    try { this.sealColor.set(this.props.sealColor || '#ffffff'); } catch (e) {}
    try { this.inkColor.set(this.props.inkColor || '#0b0f17'); } catch (e) {}

    const vis = 1 - out * 0.7;
    this.paneU.uAlpha.value = Math.min(1, h * 1.4) * vis;
    this.paneU.uSheen.value = gt >= T1 && gt < T1 + 1.8 ? G.Y0 - 6 + ((gt - T1) / 1.8) * (G.H + 14) : -1000;

    const rising = gt > RISE0 && gt < RISE1 + 0.5 ? clamp((RISE1 + 0.5 - gt) / 0.5) : 0;
    const pa = easeIO(clamp((gt - RISE1) / (A1 - RISE1)));
    const pv = easeIO(clamp((gt - A1) / (V1 - A1)));
    const pt = easeIO(clamp((gt - V1) / (T1 - V1)));
    const flash = gt >= T1 ? Math.exp(-(gt - T1) * 3.2) * 1.1 * (1 - out) : 0;
    const settle = clamp((gt - T1) / 1.0);
    const orbit = clamp((gt - FL1) / 0.8) * (1 - out);
    const trailBase = 0.55 * (1 - settle);

    const set = (list, prog, extraBase) => {
      list.forEach((e) => {
        const U = e.U;
        U.uAlpha.value = vis;
        U.uFlash.value = flash;
        U.uBase.value = 0.22 * settle + (extraBase || 0);
        if (gt < FL1) {
          U.uHead.value = prog * 1.2;
          U.uSeg.value = 0.14;
          U.uTrail.value = prog > 0 ? trailBase : 0;
          U.uComet.value = 1.2;
        } else {
          U.uHead.value = (((t * 0.16 + e.phase) % 1) * 1.4) - 0.2;
          U.uSeg.value = 0.09;
          U.uTrail.value = 0;
          U.uComet.value = 0.9 * orbit;
        }
      });
    };
    set(this.eBottom, pa, 0);
    set(this.eVert, pv, rising * 0.08);
    set(this.eTop, pt, rising * 1.1);
    return h;
  }
  phase(u) {
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    u = ((u % 1) + 1) % 1;
    if (u < 0.15) return 0;
    if (u < 0.4) return ease((u - 0.15) / 0.25);
    if (u < 0.65) return 1;
    if (u < 0.9) return 1 - ease((u - 0.65) / 0.25);
    return 0;
  }
  tick() {
    const now = performance.now();
    const t = (now - this.t0) / 1000;
    const dt = this.last ? Math.min(0.1, (now - this.last) / 1000) : 0;
    this.last = now;
    const spin = this.props.spin ?? 0.25;
    const strength = this.props.strength ?? 1;
    const explode = this.props.explode ?? true;
    const gap = this.props.gap ?? 1.6;
    const cycle = Math.max(2, this.props.cycle ?? 9);
    const xray = this.props.xray ?? false;

    for (let i = 0; i < this.occluders.length; i++) this.occluders[i].visible = !xray;
    const op = xray ? 0.6 : ((this.props.photo ?? false) ? 1 : 0.95);
    for (const k in this.lineMats) this.lineMats[k].opacity = op;
    const photo = this.props.photo ?? false;
    let pal = this.props.palette ?? 'auto';
    if (pal === 'auto') pal = photo ? 'light' : 'mono';
    if (pal !== this.palNow) {
      this.palNow = pal;
      const P = pal === 'metal'
        ? { gold: 0xa8740a, copper: 0xb8481a, silver: 0x55606e, steel: 0x8c96a3 }
        : pal === 'light'
        ? { gold: 0xfffaf0, copper: 0xffe6cc, silver: 0xffffff, steel: 0xfff6ec }
        : { gold: 0x1a1a1a, copper: 0x3d3d3d, silver: 0x5c5c5c, steel: 0x9a9a9a };
      for (const k in P) this.lineMats[k].color.setHex(P[k]);
      this.gridMats.forEach((m) => m.color.setHex(P.gold));
    }
    if (photo !== this.photoNow) {
      this.photoNow = photo;
      // over the photo the solid parts only hide lines behind them (depth), never paint a colour
      this.occMat.colorWrite = !photo;
      this.occMat.needsUpdate = true;
      if (this.grid) { this.grid.material.opacity = photo ? 0.18 : 1; }
      this.gridMats.forEach((m) => { m.opacity = photo ? 0.5 : 0.22; });
      if (this.paneU) this.paneU.uColor.value.setHex(photo ? 0xfff4ea : 0x6f8aa8);
      this.bgNow = null;
    }
    const bg = this.props.bg ?? '#ffffff';
    if (bg !== this.bgNow) { this.bgNow = bg; try { this.occMat.color.set(bg); } catch (e) {} }

    const tx = this.hover ? this.target.x : 0;
    const ty = this.hover ? this.target.y : 0;
    this.cur.x += (tx - this.cur.x) * 0.06;
    this.cur.y += (ty - this.cur.y) * 0.06;

    let eAvg = 0;
    for (let k = 0; k < 4; k++) {
      const e = explode ? this.phase(t / cycle - k * 0.025) : 0;
      this.stages[k].position.y = (1.5 - k) * gap * e;
      eAvg += e / 4;
    }

    this.yaw = (this.yaw === undefined ? -0.5 : this.yaw) + dt * spin;
    this.model.rotation.y = this.yaw + this.cur.x * 0.8 * strength;
    const gh = this.glassTick(t);
    const elev = 0.16 + this.cur.y * 0.3 * strength;
    const baseDist = 30 + 8 * eAvg * (gap / 1.6);
    const dist = baseDist + (54 - baseDist) * gh;
    const cy = 3.2 + (4.3 - 3.2) * gh;
    this.camera.position.set(0, cy + dist * Math.sin(elev), dist * Math.cos(elev));
    this.camera.lookAt(0, cy, 0);
    this.renderer.render(this.scene, this.camera);
  }
}
