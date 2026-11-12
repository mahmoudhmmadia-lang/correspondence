// Turns the guide's TikZ diagrams into themed, animated inline SVG for the
// HTML guide. It reads only what the diagrams use (see README → Authoring
// rules): \node[style,...] (id) {label}; \draw[arrow] (a...) ... (b...);
// and \foreach \a/\b in {x/y,...} \draw[arrow] (\a) -- (\b);
// Layout follows the guide's rule: a vertical tree, root on top, children
// below, siblings ordered right to left in Arabic (left to right in English)
// in the order their arrows are drawn.

const NODE_STYLES = new Set(['entity', 'entityOpt', 'entityGen', 'stepBox']);
const ARROW_STYLES = new Set(['dependsOn', 'dependsOnOpt', 'flowsTo']);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function cleanLabel(raw) {
  return raw
    .split(/\\\\/)
    .map((line) => line
      .replace(/\\(RL|LR|textbf|en|mbox)\s*\{/g, '{')
      .replace(/\\(small|footnotesize|bfseries)\b/g, '')
      .replace(/[{}]/g, '')
      .replace(/~/g, ' ')
      .replace(/\s+/g, ' ')
      .trim())
    .filter(Boolean);
}

// Reads a balanced {...} group at src[i].
function group(src, i) {
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    if (src[j] === '\\') { j++; continue; }
    if (src[j] === '{') depth++;
    else if (src[j] === '}' && --depth === 0) return [src.slice(i + 1, j), j + 1];
  }
  throw new Error(`Unbalanced TikZ group: ${src.slice(i, i + 40)}`);
}

export function parseTikz(tikz) {
  const nodes = [];
  const byId = new Map();
  const edges = [];
  const re = /\\node\s*\[([^\]]*)\]\s*\(([^)]+)\)\s*(?:at\s*\([^)]*\)\s*)?\{/g;
  let m;
  while ((m = re.exec(tikz))) {
    const [label] = group(tikz, m.index + m[0].length - 1);
    const style = m[1].split(',').map((s) => s.trim()).find((s) => NODE_STYLES.has(s)) ?? 'entity';
    const node = { id: m[2].trim(), style, lines: cleanLabel(label), children: [], parents: [] };
    nodes.push(node);
    byId.set(node.id, node);
  }
  const addEdge = (style, from, to) => {
    const a = byId.get(from), b = byId.get(to);
    if (!a || !b) throw new Error(`TikZ edge to unknown node: ${from} -> ${to}`);
    edges.push({ style, from: a, to: b });
    a.children.push(b); b.parents.push(a);
  };
  // \foreach \a/\b in {s1/s2,...} \draw[style] (\a) -- (\b);
  const fe = /\\foreach\s*\\(\w+)\/\\(\w+)\s*in\s*\{([^}]*)\}\s*\\draw\s*\[([^\]]*)\]/g;
  while ((m = fe.exec(tikz))) {
    const style = m[4].split(',').map((s) => s.trim()).find((s) => ARROW_STYLES.has(s)) ?? 'flowsTo';
    for (const pair of m[3].split(',')) {
      const [a, b] = pair.split('/').map((s) => s.trim());
      addEdge(style, a, b);
    }
  }
  const withoutForeach = tikz.replace(fe, '');
  const dr = /\\draw\s*\[([^\]]*)\]([^;]*);/g;
  while ((m = dr.exec(withoutForeach))) {
    const style = m[1].split(',').map((s) => s.trim()).find((s) => ARROW_STYLES.has(s));
    if (!style) continue;
    const ids = [...m[2].matchAll(/\(\s*([A-Za-z][\w]*)(?:\.[a-z ]+)?\s*\)/g)].map((x) => x[1]).filter((id) => byId.has(id));
    if (ids.length >= 2) addEdge(style, ids[0], ids[ids.length - 1]);
  }
  return { nodes, edges };
}

// ---------------------------------------------------------------- layout

const NODE_W = 216;
const STEP_W = 260;
const LINE_H = 22;
const PAD_Y = 14;
const GAP_X = 28;
const GAP_Y = 46;

export function renderDiagram(tikz, { dir = 'rtl', id = 'd' } = {}) {
  const { nodes, edges } = parseTikz(tikz);
  if (!nodes.length) return '';
  const isChain = nodes.every((n) => n.style === 'stepBox');
  const gapY = isChain ? 24 : GAP_Y;
  const w = isChain ? STEP_W : NODE_W;
  for (const n of nodes) n.h = PAD_Y * 2 + n.lines.length * LINE_H;

  // Depth = longest path from a root, so every arrow points downwards.
  const depth = new Map();
  const visit = (n, d) => {
    if ((depth.get(n) ?? -1) >= d) return;
    depth.set(n, d);
    n.children.forEach((c) => visit(c, d + 1));
  };
  nodes.filter((n) => !n.parents.length).forEach((r) => visit(r, 0));
  nodes.forEach((n) => { if (!depth.has(n)) depth.set(n, 0); });

  // Tidy tree: leaves take consecutive slots, parents sit over their children.
  // Slot order is the drawing order; Arabic places the first sibling on the right.
  let slot = 0;
  const placed = new Set();
  const place = (n) => {
    if (placed.has(n)) return n.x;
    placed.add(n);
    const kids = n.children.filter((c) => c.parents[0] === n);
    if (!kids.length) { n.x = slot++; return n.x; }
    const xs = kids.map(place);
    n.x = (Math.min(...xs) + Math.max(...xs)) / 2;
    return n.x;
  };
  nodes.filter((n) => !n.parents.length).forEach(place);
  const slots = Math.max(1, slot);
  const levels = Math.max(...depth.values()) + 1;
  const rowH = [];
  for (const n of nodes) { const d = depth.get(n); rowH[d] = Math.max(rowH[d] ?? 0, n.h); }
  const rowY = [];
  let y = 8;
  for (let d = 0; d < levels; d++) { rowY[d] = y; y += rowH[d] + gapY; }
  const height = y - gapY + 8;
  const width = slots * w + (slots - 1) * GAP_X + 16;
  for (const n of nodes) {
    const k = dir === 'rtl' ? slots - 1 - n.x : n.x;
    n.cx = 8 + k * (w + GAP_X) + w / 2;
    n.top = rowY[depth.get(n)] + (rowH[depth.get(n)] - n.h) / 2;
  }

  // Connectors: straight down for a single child, elbow (down, across, down) for siblings.
  const paths = edges.map((e, i) => {
    const x1 = e.from.cx, y1 = e.from.top + e.from.h;
    const x2 = e.to.cx, y2 = e.to.top;
    const mid = y1 + (y2 - y1) / 2;
    const d = Math.abs(x1 - x2) < 1
      ? `M${x1} ${y1} V${y2 - 3}`
      : `M${x1} ${y1} V${mid} H${x2} V${y2 - 3}`;
    const len = Math.abs(y2 - y1) + Math.abs(x2 - x1);
    return `<path class="dg-edge dg-${e.style}" d="${d}" style="--i:${i};--len:${Math.ceil(len)}" marker-end="url(#${id}-${e.style})"/>`;
  });

  const boxes = nodes.map((n, i) => {
    const x = n.cx - w / 2;
    const textY = n.top + PAD_Y + LINE_H / 2;
    const tspans = n.lines.map((line, k) => `<tspan x="${n.cx}" y="${textY + k * LINE_H}">${esc(line)}</tspan>`).join('');
    const step = n.style === 'stepBox' && isChain
      ? `<circle class="dg-step-no" cx="${dir === 'rtl' ? x + w - 22 : x + 22}" cy="${n.top + n.h / 2}" r="12"/><text class="dg-step-no-t" x="${dir === 'rtl' ? x + w - 22 : x + 22}" y="${n.top + n.h / 2}">${i + 1}</text>`
      : '';
    return `<g class="dg-node dg-${n.style}" style="--i:${i}"><rect x="${x}" y="${n.top}" width="${w}" height="${n.h}" rx="12"/>${step}<text class="dg-label" direction="${dir}">${tspans}</text></g>`;
  });

  const marker = (name, open) => `<marker id="${id}-${name}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9 ${open ? '' : 'Z'}" class="dg-head dg-head-${name}"/></marker>`;
  return `<svg class="diagram" data-layout="${isChain ? 'flow' : 'tree'}" viewBox="0 0 ${width} ${height}" width="${width}" style="max-width:${width}px" role="img" xmlns="http://www.w3.org/2000/svg">
<defs>${marker('dependsOn', false)}${marker('dependsOnOpt', false)}${marker('flowsTo', true)}</defs>
${paths.join('\n')}
${boxes.join('\n')}
</svg>`;
}

// Arrow kinds a diagram uses, so its legend lists only what appears.
export function arrowKinds(tikz) {
  return [...new Set(parseTikz(tikz).edges.map((e) => e.style))];
}
