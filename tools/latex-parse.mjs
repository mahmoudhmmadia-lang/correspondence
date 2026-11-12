// Parses the LaTeX subset used by the guide into a simple document model
// that the DOCX renderer consumes. It understands only the macros and
// environments defined in preamble.tex; anything else keeps its text content.

import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------- helpers

export function stripComments(src) {
  return src
    .split('\n')
    .map((line) => {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '%' && line[i - 1] !== '\\') return line.slice(0, i);
      }
      return line;
    })
    .join('\n');
}

// Reads a balanced {...} group starting at src[i] === '{'. Returns [content, endIndex].
export function readGroup(src, i) {
  if (src[i] !== '{') return null;
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (c === '\\') { j++; continue; }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return [src.slice(i + 1, j), j + 1];
    }
  }
  throw new Error(`Unbalanced group near: ${src.slice(i, i + 60)}`);
}

function readOptional(src, i) {
  let j = skipSpaces(src, i);
  if (src[j] !== '[') return [null, i];
  let depth = 0;
  for (let k = j; k < src.length; k++) {
    if (src[k] === '{') depth++;
    else if (src[k] === '}') depth--;
    else if (src[k] === ']' && depth === 0) return [src.slice(j + 1, k), k + 1];
  }
  return [null, i];
}

function skipSpaces(src, i) {
  while (i < src.length && /\s/.test(src[i])) i++;
  return i;
}

function readArg(src, i) {
  const j = skipSpaces(src, i);
  if (src[j] === '{') return readGroup(src, j);
  // single-token argument
  if (src[j] === '\\') {
    const m = /^\\([A-Za-z]+|.)/.exec(src.slice(j));
    return [m[0], j + m[0].length];
  }
  return [src[j] ?? '', j + 1];
}

function readCommandName(src, i) {
  // src[i] === '\\'
  const m = /^\\([A-Za-z@]+\*?|.)/s.exec(src.slice(i));  return [m[1], i + m[0].length];
}

// Splits on a separator at brace depth 0 (separator is a literal string).
export function splitTop(src, sep) {
  const parts = [];
  let depth = 0;
  let last = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '\\' && src.startsWith(sep, i) && depth === 0) {
      parts.push(src.slice(last, i));
      i += sep.length - 1;
      last = i + 1;
      continue;
    }
    if (c === '\\') { i++; continue; }
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (depth === 0 && src.startsWith(sep, i)) {
      parts.push(src.slice(last, i));
      i += sep.length - 1;
      last = i + 1;
    }
  }
  parts.push(src.slice(last));
  return parts;
}

// Finds the matching \end{env} for a \begin{env} whose body starts at i.
function findEnd(src, env, i) {
  const open = `\\begin{${env}}`;
  const close = `\\end{${env}}`;
  let depth = 1;
  let j = i;
  while (j < src.length) {
    const o = src.indexOf(open, j);
    const c = src.indexOf(close, j);
    if (c < 0) throw new Error(`Missing ${close}`);
    if (o >= 0 && o < c) { depth++; j = o + open.length; continue; }
    depth--;
    if (depth === 0) return [src.slice(i, c), c + close.length];
    j = c + close.length;
  }
  throw new Error(`Missing ${close}`);
}

// ---------------------------------------------------------------- inline

const BADGES = {
  req: { text: 'إلزامي تقنياً', fill: '00696D' },
  rec: { text: 'موصى به', fill: '4FB8AE' },
  opt: { text: 'اختياري', fill: '94A8A6' },
  gen: { text: 'يولّده النظام', fill: '4A6364' },
};
const IGNORE0 = new Set(['small', 'footnotesize', 'scriptsize', 'large', 'Large', 'normalsize',
  'bfseries', 'ttfamily', 'centering', 'selectfont', 'par', 'noindent', 'rcZebra',
  'rcHeaderRow', 'raggedleft', 'raggedright', 'arraybackslash', 'hline', 'smallskip',
  'medskip', 'bigskip', 'relax', 'rclegend', 'hiderowcolors']);
const IGNORE1 = new Set(['label', 'color', 'vspace', 'hspace', 'rowcolor', 'vspace*']);

// Returns an array of runs: {text, bold, latin, color, badge, mono, br}
export function parseInline(src, ctx, fmt = {}) {
  const runs = [];
  let buf = '';
  const flush = () => { if (buf) { runs.push({ ...fmt, text: buf }); buf = ''; } };
  const push = (r) => { flush(); runs.push(r); };
  const sub = (s, extra) => { flush(); runs.push(...parseInline(s, ctx, { ...fmt, ...extra })); };
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') {
      const [name, j] = readCommandName(src, i);
      i = j;
      if (name === '\\') { [, i] = readOptional(src, i); push({ br: true }); continue; }
      if (name === ',' || name === ' ' || name === ';') { buf += ' '; continue; }
      if ('_&%#${}'.includes(name)) { buf += name; continue; }
      const eatEmpty = () => { if (src.startsWith('{}', i)) i += 2; };
      switch (name) {
        case 'textbf': { const [a, k] = readArg(src, i); i = k; sub(a, { bold: true }); break; }
        case 'textit': case 'emph': { const [a, k] = readArg(src, i); i = k; sub(a, {}); break; }
        case 'en': case 'textenglish': case 'url': { const [a, k] = readArg(src, i); i = k; sub(a, { latin: true }); break; }
        case 'key': { const [a, k] = readArg(src, i); i = k; sub(a, { latin: true, color: '00696D' }); break; }
        case 'RL': case 'LR': case 'mbox': { const [a, k] = readArg(src, i); i = k; sub(a, {}); break; }
        case 'thh': { const [a, k] = readArg(src, i); i = k; sub(a, { bold: true, color: 'FFFFFF' }); break; }
        case 'textcolor': {
          const [col, k] = readArg(src, i); const [a, k2] = readArg(src, k); i = k2;
          sub(a, { color: ctx.colors[col] ?? fmt.color }); break;
        }
        case 'ref': { const [a, k] = readArg(src, i); i = k; push({ ...fmt, text: ctx.labels.get(a) ?? '??', latin: true, ref: a }); break; }
        case 'kos': eatEmpty(); push({ ...fmt, text: 'KayanOS', latin: true }); break;
        case 'dep': eatEmpty(); push({ ...fmt, text: ' ← ', symbol: true, color: '00696D' }); break;
        case 'req': case 'rec': case 'opt': case 'gen': eatEmpty(); push({ badge: { ...BADGES[name], key: name } }); break;
        case 'newline': push({ br: true }); break;
        case 'quad': case 'qquad': buf += '  '; break;
        case 'fontsize': { [, i] = readArg(src, i); [, i] = readArg(src, i); break; }
        case 'srcs': {
          const [a, k] = readArg(src, i); i = k;
          splitTop(a, '\\\\').forEach((line, n) => {
            if (n) push({ br: true });
            sub(line.trim(), { latin: true, mono: true });
          });
          break;
        }
        default:
          if (IGNORE0.has(name)) { eatEmpty(); break; }
          if (IGNORE1.has(name)) { [, i] = readArg(src, i); break; }
          // Unknown macro with a group: keep its text.
          if (src[skipSpaces(src, i)] === '{') { const [a, k] = readArg(src, i); i = k; sub(a, {}); }
      }
      continue;
    }
    if (c === '{') { const [a, k] = readGroup(src, i); i = k; sub(a, {}); continue; }
    if (c === '}') { i++; continue; }
    if (c === '~') { buf += ' '; i++; continue; }
    if (c === '\n' || c === '\t') { buf += ' '; i++; continue; }
    if (src.startsWith('---', i)) { buf += '—'; i += 3; continue; }
    if (src.startsWith('--', i)) { buf += '–'; i += 2; continue; }
    buf += c; i++;
  }
  flush();
  // collapse whitespace across runs
  const out = [];
  for (const r of runs) {
    if (r.text != null) r.text = r.text.replace(/\s+/g, ' ');
    out.push(r);
  }
  if (out.length && out[0].text) out[0].text = out[0].text.replace(/^\s+/, '');
  const last = out[out.length - 1];
  if (last && last.text) last.text = last.text.replace(/\s+$/, '');
  return out.filter((r) => r.br || r.badge || r.text);
}

// ---------------------------------------------------------------- blocks

// Block types:
//  {type:'chapter', title, number, kicker}
//  {type:'heading', level:2|3, title, number}
//  {type:'para', src, align?}
//  {type:'list', kind:'bullet'|'number'|'check', items:[src]}
//  {type:'box', kind:'note'|'warn'|'check', title, blocks}
//  {type:'table', caption, number, cols:[{width|null}], rows:[{header, cells:[src]}]}
//  {type:'figure', caption, number, image?, imageWidth?, tikz?, note?}
//  {type:'pagebreak'}

const ENV_BOX = { rcnote: 'note', rcwarn: 'warn', rcchecklist: 'check' };
const BOX_DEFAULT_TITLE = { note: 'ملاحظة', warn: 'تنبيه', check: 'قائمة تحقق' };

function parseColSpec(spec) {
  const cols = [];
  let i = 0;
  while (i < spec.length) {
    const c = spec[i];
    if (c === '>' || c === '<' || c === '@' || c === '!') { i++; [, i] = readGroup(spec, skipSpaces(spec, i)); continue; }
    if (c === 'p' || c === 'R' || c === 'm' || c === 'b') {
      const [w, k] = readGroup(spec, skipSpaces(spec, i + 1)); i = k;
      const m = /([\d.]+)\s*cm/.exec(w);
      cols.push({ width: m ? Number(m[1]) : null }); continue;
    }
    if ('XYlcr'.includes(c)) { cols.push({ width: null }); i++; continue; }
    if (c === '*') { // *{n}{spec}
      const [n, k] = readGroup(spec, i + 1); const [s, k2] = readGroup(spec, k);
      for (let r = 0; r < Number(n); r++) cols.push(...parseColSpec(s));
      i = k2; continue;
    }
    i++;
  }
  return cols;
}

function parseTableBody(body) {
  // Drop the repeated longtable head (between \endfirsthead and \endhead).
  if (body.includes('\\endfirsthead')) {
    const a = body.indexOf('\\endfirsthead');
    const b = body.indexOf('\\endhead');
    body = body.slice(0, a) + body.slice(b + '\\endhead'.length);
  }
  body = body.replace(/\\endhead|\\endfirsthead|\\endfoot|\\endlastfoot/g, '');
  const rows = [];
  for (let raw of splitTop(body, '\\\\')) {
    raw = raw.trim();
    if (!raw) continue;
    let header = false;
    raw = raw.replace(/^\\rcHeaderRow/, () => { header = true; return ''; })
      .replace(/^\s*\\rowcolor\{[^}]*\}/, '').trim();
    if (!raw) continue;
    rows.push({ header, cells: splitTop(raw, '&').map((s) => s.trim()) });
  }
  return rows;
}

// Splits a shotnote into its description and the numbered key (① … ⑳) that
// explains the markers drawn on the screenshot.
export function splitNote(note) {
  const parts = note.split(/([①-⑳])/)
  const keys = []
  for (let i = 1; i < parts.length; i += 2) {
    const text = parts[i + 1].trim()
    if (text) keys.push({ n: parts[i].charCodeAt(0) - 0x245f, text })
  }
  return { noteText: parts[0].trim(), noteKeys: keys }
}

function parseFloat_(env, body, opts) {
  const out = { type: env === 'table' ? 'table' : 'figure', caption: null, label: null };
  const cap = /\\caption(?:of\{table\})?\{/.exec(body);
  if (cap) out.caption = readGroup(body, cap.index + cap[0].length - 1)[0];
  const lab = /\\label\{([^}]*)\}/.exec(body);
  if (lab) out.label = lab[1];
  // \shotnote{..}: the explanation printed directly under the image or diagram.
  const note = /\\shotnote\{/.exec(body);
  if (note) {
    out.note = readGroup(body, note.index + note[0].length - 1)[0].trim();
    Object.assign(out, splitNote(out.note));
  }
  const tab = /\\begin\{(tabularx|tabular|longtable)\}/.exec(body);
  if (tab) {
    let i = tab.index + tab[0].length;
    if (tab[1] === 'tabularx') [, i] = readGroup(body, skipSpaces(body, i));
    const [spec, k] = readGroup(body, skipSpaces(body, i));
    const [inner] = findEnd(body, tab[1], k);
    out.type = 'table';
    out.cols = parseColSpec(spec);
    out.rows = parseTableBody(inner);
  }
  const img = /\\includegraphics(\[[^\]]*\])?\{([^}]*)\}/.exec(body);
  if (img) {
    out.image = img[2];
    const w = /width=([\d.]+)\\linewidth/.exec(img[1] ?? '');
    out.imageWidth = w ? Number(w[1]) : 1;
  }
  const tz = /\\begin\{tikzpicture\}/.exec(body);
  if (tz && !tab) {
    const [inner, end] = findEnd(body, 'tikzpicture', tz.index + tz[0].length);
    out.tikz = body.slice(tz.index, end) + (body.includes('\\rclegend') ? '\n\n\\rclegend' : '');
  }
  return out;
}

export function parseBlocks(src) {
  const blocks = [];
  let i = 0;
  let para = '';
  let pendingCaption = null; // from {\centering\captionof{table}{..}\label{..}\par}
  const flushPara = () => {
    const t = para.trim();
    if (t) blocks.push({ type: 'para', src: t });
    para = '';
  };
  while (i < src.length) {
    // blank line ends a paragraph
    if (src[i] === '\n') {
      const m = /^\n[ \t]*\n/.exec(src.slice(i));
      if (m) { flushPara(); i += m[0].length; continue; }
      para += ' '; i++; continue;
    }
    if (src.startsWith('\\begin{', i)) {
      const [env, k] = readGroup(src, i + 6);
      const envName = env;
      let j = k;
      let opt = null;
      if (src[j] === '[') [opt, j] = readOptional(src, j);
      // tabularx width / longtable spec are handled inside parseFloat_
      const [body, end] = findEnd(src, envName, j);
      flushPara();
      i = end;
      if (ENV_BOX[envName]) {
        const kind = ENV_BOX[envName];
        blocks.push({ type: 'box', kind, title: opt ?? BOX_DEFAULT_TITLE[kind], blocks: parseBlocks(body) });
      } else if (['itemize', 'enumerate', 'checklist'].includes(envName)) {
        const items = splitTop(body, '\\item').slice(1).map((s) => s.trim());
        blocks.push({ type: 'list', kind: { itemize: 'bullet', enumerate: 'number', checklist: 'check' }[envName], items });
      } else if (envName === 'table' || envName === 'figure') {
        blocks.push(parseFloat_(envName, body, opt));
      } else if (envName === 'longtable' || envName === 'tabularx' || envName === 'tabular') {
        const t = parseFloat_('table', `\\begin{${envName}}${src.slice(k, end)}`, null);
        if (pendingCaption) { t.caption = pendingCaption.caption; t.label = pendingCaption.label; pendingCaption = null; }
        blocks.push(t);
      } else if (envName === 'tikzpicture') {
        blocks.push({ type: 'figure', tikz: `\\begin{tikzpicture}${body}\\end{tikzpicture}` });
      } else if (envName === 'center') {
        blocks.push(...parseBlocks(body).map((b) => (b.type === 'para' ? { ...b, align: 'center' } : b)));
      } else {
        blocks.push(...parseBlocks(body));
      }
      continue;
    }
    if (src[i] === '\\') {
      const [name, k] = readCommandName(src, i);
      if (['chapter', 'section', 'subsection', 'chapter*', 'section*', 'subsection*'].includes(name)) {
        flushPara();
        const [title, e] = readArg(src, k);
        const level = name.startsWith('chapter') ? 1 : name.startsWith('section') ? 2 : 3;
        blocks.push({ type: level === 1 ? 'chapter' : 'heading', level, title, starred: name.endsWith('*') });
        i = e; continue;
      }
      if (name === 'label') {
        const [lab, e] = readArg(src, k);
        const last = blocks[blocks.length - 1];
        if (last && !para.trim()) last.label = lab; else para += '';
        i = e; continue;
      }
      if (name === 'newcommand' || name === 'renewcommand') {
        let [, e] = readArg(src, k);
        [, e] = readOptional(src, e);
        [, e] = readArg(src, e);
        i = e; continue;
      }
      if (name === 'addtocounter' || name === 'setcounter') {
        let [, e] = readArg(src, k); [, e] = readArg(src, e); i = e; continue;
      }
      if (name === 'appendix') { flushPara(); blocks.push({ type: 'appendix' }); i = k; continue; }
      if (name === 'input') { flushPara(); const [f, e] = readArg(src, k); blocks.push({ type: 'input', file: f }); i = e; continue; }
      if (['clearpage', 'newpage'].includes(name)) { flushPara(); blocks.push({ type: 'pagebreak' }); i = k; continue; }
      if (['rcZebra', 'centering', 'par', 'tableofcontents'].includes(name)) { i = k; continue; }
    }
    if (src[i] === '{' && /^\{\s*\\(centering|renewcommand|rcZebra)/.test(src.slice(i))) {
      // A layout group: caption holder or wrapper around a longtable.
      const [inner, e] = readGroup(src, i);
      flushPara();
      const cap = /\\captionof\{table\}\{/.exec(inner);
      if (cap && !/\\begin\{longtable\}/.test(inner)) {
        pendingCaption = { caption: readGroup(inner, cap.index + cap[0].length - 1)[0], label: (/\\label\{([^}]*)\}/.exec(inner) || [])[1] };
      } else {
        const sub = parseBlocks(inner);
        for (const b of sub) {
          if (b.type === 'table' && pendingCaption && !b.caption) { b.caption = pendingCaption.caption; b.label = pendingCaption.label; pendingCaption = null; }
          blocks.push(b);
        }
      }
      i = e; continue;
    }
    para += src[i]; i++;
  }
  flushPara();
  // Attach a pending caption to the next table if it came before it at this level.
  for (let n = 0; n < blocks.length; n++) {
    if (blocks[n].type === 'table' && !blocks[n].caption && pendingCaption) {
      blocks[n].caption = pendingCaption.caption; blocks[n].label = pendingCaption.label; pendingCaption = null;
    }
  }
  return blocks;
}

// ---------------------------------------------------------------- document

const APPENDIX_LETTERS = { ar: ['أ', 'ب', 'ج', 'د', 'هـ'], en: ['A', 'B', 'C', 'D', 'E'] };
const KICKERS = { ar: { chapter: 'الفصل', appendix: 'الملحق' }, en: { chapter: 'Chapter', appendix: 'Appendix' } };

// Reads main.tex, expands \input chapters, numbers everything, collects labels.
// `lang` only changes appendix letters and chapter kickers (Arabic by default;
// the English sources of the HTML guide live in i18n/en/).
export function loadDocument(root, { lang = 'ar' } = {}) {
  const main = stripComments(fs.readFileSync(path.join(root, 'main.tex'), 'utf8'));
  const body = main.slice(main.indexOf('\\begin{document}') + 16, main.indexOf('\\end{document}'));
  const cover = /\\makecover\{/.exec(body);
  let coverArgs = null;
  let rest = body;
  if (cover) {
    coverArgs = [];
    let i = cover.index + cover[0].length - 1;
    for (let n = 0; n < 6; n++) { const [a, e] = readArg(body, i); coverArgs.push(a); i = e; }
    rest = body.slice(0, cover.index) + body.slice(i);
  }
  const top = parseBlocks(rest);
  const blocks = [];
  for (const b of top) {
    if (b.type === 'input') {
      const file = path.join(root, b.file.endsWith('.tex') ? b.file : `${b.file}.tex`);
      blocks.push(...parseBlocks(stripComments(fs.readFileSync(file, 'utf8'))));
    } else blocks.push(b);
  }
  // numbering
  const labels = new Map();
  let chapter = 0, appendix = false, sec = 0, sub = 0, tab = 0, fig = 0;
  const chapNo = () => (appendix ? APPENDIX_LETTERS[lang][chapter - 1] : String(chapter));
  const numbered = (n) => (appendix ? String(n) : `${chapNo()}.${n}`);
  for (const b of blocks) {
    if (b.type === 'appendix') { appendix = true; chapter = 0; continue; }
    if (b.type === 'chapter') {
      chapter++; sec = sub = tab = fig = 0;
      b.number = chapNo(); b.kicker = `${KICKERS[lang][appendix ? 'appendix' : 'chapter']} ${b.number}`;
    } else if (b.type === 'heading' && !b.starred) {
      if (b.level === 2) { sec++; sub = 0; b.number = numbered(sec); }
      else { sub++; b.number = `${appendix ? '' : `${chapNo()}.`}${sec}.${sub}`; }
    } else if (b.type === 'table' && b.caption) { tab++; b.number = numbered(tab); }
    else if (b.type === 'figure' && b.caption) { fig++; b.number = numbered(fig); }
    if (b.label) labels.set(b.label, b.number ?? '');
    // labels inside boxes are not numbered
  }
  return { coverArgs, blocks, labels };
}
