// Renders the parsed guide (latex-parse.mjs) as a small HTML site per
// language, in the KayanOS website theme (web/guide.css, web/guide.js):
// index.html (home: chapter cards), chapter pages (c1.html …), and dedicated
// HR feature pages (hr-nodes.html …), all built from the same LaTeX sources.
// Every chapter section becomes a "step" with a stable, language-independent
// id (c2-s3); the route map places feature sections on their own pages so links,
// progress and the language switch keep your place.

import { renderDiagram } from './html-diagram.mjs'
import { parseInline } from './latex-parse.mjs'
import { renderChapterOverview } from './chapter-overviews.mjs'
import { guideUrl } from './guide-links.mjs'

// A count with its noun in correct Arabic agreement (1, 2, 3–10, 11+) or English plural.
const COUNT_WORDS = {
    ar: { section: ['قسم واحد', 'قسمان', 'أقسام', 'قسماً'], step: ['خطوة واحدة', 'خطوتان', 'خطوات', 'خطوة'] },
    en: { section: ['section', 'sections'], step: ['step', 'steps'] },
}
export function countLabel(n, lang, kind) {
    const w = (COUNT_WORDS[lang] ?? COUNT_WORDS.en)[kind]
    if (lang !== 'ar') return `${n} ${n === 1 ? w[0] : w[1]}`
    if (n === 1) return w[0]
    if (n === 2) return w[1]
    const mod = n % 100
    return `${n} ${mod >= 3 && mod <= 10 ? w[2] : w[3]}`
}

export const UI = {
    ar: {
        dir: 'rtl',
        help: 'استخدام الدليل',
        helpTitle: 'كيف تستخدم هذا الدليل؟',
        helpFieldsTitle: 'أكمل البيانات المطلوبة',
        helpDiagramsTitle: 'افهم العلاقات والخطوات',
        helpWorkTitle: 'احفظ تقدمك في القراءة',
        helpFields: 'الحقول ذات النجمة (*) إلزامية. أكملها قبل الحفظ.',
        helpDiagrams: 'اقرأ المخططات من الأعلى إلى الأسفل. في مخطط الاعتماد، جهّز السجلات المطلوبة قبل السجل الذي يعتمد عليها. سهم الخطوة التالية يوضح الترتيب؛ ولا يعني تنفيذًا آليًا إلا إذا ذُكر ذلك.',
        helpWork: 'حدّث حالة العمل عند إنجازه. وفي الدليل، استخدم «تحديد كمنجزة» لحفظ تقدّمك في هذا المتصفح.',
        other: 'en',
        otherName: 'English',
        otherShort: 'EN',
        brand: 'دليل KayanOS',
        contents: 'المحتويات',
        search: 'ابحث في الدليل…',
        searchShort: 'بحث',
        start: 'ابدأ الدليل',
        continue: 'تابع من حيث توقفت',
        paths: 'اختر الفصل',
        chapters: 'فصول',
        steps: 'خطوة',
        minutes: 'دقيقة قراءة',
        progress: 'تقدّمك',
        done: 'أنهيت هذه الخطوة',
        markDone: 'تحديد كمنجزة',
        copyLink: 'نسخ رابط الخطوة',
        copied: 'نُسخ الرابط',
        prev: 'السابق',
        next: 'التالي',
        nextChapter: 'الفصل التالي',
        prevChapter: 'الفصل السابق',
        prevPage: 'الصفحة السابقة',
        nextPage: 'الصفحة التالية',
        appPages: 'كل صفحات التطبيق',
        firstPage: 'ابدأ بالصفحات',
        openPage: 'افتح الصفحة',
        table: 'جدول',
        figure: 'شكل',
        theme: 'تبديل المظهر',
        short: 'الأمثلة والصور فقط',
        shortEmpty: 'لا يحتوي هذا القسم على مثال أو صورة. أوقف «الأمثلة والصور فقط» لقراءة الشرح.',
        lang: 'English',
        top: 'إلى الأعلى',
        noResults: 'لا نتائج. جرّب كلمة أخرى.',
        navHint: 'للتنقل',
        openHint: 'للفتح',
        closeHint: 'للإغلاق',
        reset: 'إعادة ضبط التقدّم',
        resetConfirm: 'هل تريد مسح تقدّمك في هذا الدليل؟',
        resetDescription: 'ستُمسح الخطوات المنجزة وعلامات التحقق وموضع المتابعة في هذا المتصفح. لن يتأثر تقدّمك في الأدلة الأخرى. لا يمكن التراجع عن هذا الإجراء.',
        cancel: 'إلغاء',
        resetAction: 'مسح التقدّم',
        legend: { dependsOn: 'يحتاج أولاً (إلزامي)', dependsOnOpt: 'ربط اختياري', flowsTo: 'الخطوة التالية' },
        badges: { req: 'إلزامي تقنياً', rec: 'موصى به', opt: 'اختياري', gen: 'يولّده النظام' },
        boxes: { note: 'ملاحظة', warn: 'تنبيه', check: 'قائمة تحقق' },
        zoom: 'تكبير الصورة',
        original: 'فتح الصورة الأصلية',
        keyTitle: 'مفتاح الأرقام',
        close: 'إغلاق',
        menu: 'القائمة',
        of: 'من',
        stepLabel: 'الخطوة',
        chapterDone: 'أكملت هذا الفصل',
        print: 'طباعة',
        home: 'الدليل',
        moreSteps: 'خطوات أخرى',
        chapterNav: 'فصول الدليل',
        open: 'افتح الفصل',
        openGuide: 'افتح',
        mainGuide: 'الدليل الرئيسي',
    },
    en: {
        dir: 'ltr',
        help: 'Guide help',
        helpTitle: 'How to use this guide',
        helpFieldsTitle: 'Complete required fields',
        helpDiagramsTitle: 'Understand relationships and steps',
        helpWorkTitle: 'Keep your reading progress',
        helpFields: 'Fields marked with an asterisk (*) are required. Complete them before saving.',
        helpDiagrams: 'Read diagrams from top to bottom. For dependencies, prepare the required records before the record that needs them. Next-step arrows show order; they imply automation only when explicitly stated.',
        helpWork: 'Update work status when finished. In this guide, use “Mark as done” to save your reading progress in this browser.',
        other: 'ar',
        otherName: 'العربية',
        otherShort: 'ع',
        brand: 'KayanOS Guide',
        contents: 'Contents',
        search: 'Search the guide…',
        searchShort: 'Search',
        start: 'Start the guide',
        continue: 'Continue where you left off',
        paths: 'Pick a chapter',
        chapters: 'chapters',
        steps: 'steps',
        minutes: 'min read',
        progress: 'Your progress',
        done: 'Step completed',
        markDone: 'Mark as done',
        copyLink: 'Copy link to this step',
        copied: 'Link copied',
        prev: 'Previous',
        next: 'Next',
        nextChapter: 'Next chapter',
        prevChapter: 'Previous chapter',
        prevPage: 'Previous page',
        nextPage: 'Next page',
        appPages: 'All app pages',
        firstPage: 'Start with the pages',
        openPage: 'Open page',
        table: 'Table',
        figure: 'Figure',
        theme: 'Toggle theme',
        short: 'Examples and pictures only',
        shortEmpty: 'This section has no example or picture. Turn off “Examples and pictures only” to read the explanation.',
        lang: 'العربية',
        top: 'Back to top',
        noResults: 'No results. Try another word.',
        navHint: 'to navigate',
        openHint: 'to open',
        closeHint: 'to close',
        reset: 'Reset progress',
        resetConfirm: 'Clear your progress in this guide?',
        resetDescription: 'This clears completed steps, checkmarks and your reading position in this browser. Progress in other guides stays unchanged. This cannot be undone.',
        cancel: 'Cancel',
        resetAction: 'Clear progress',
        legend: { dependsOn: 'Needs this first (required)', dependsOnOpt: 'Optional link', flowsTo: 'Next step' },
        badges: { req: 'Required', rec: 'Recommended', opt: 'Optional', gen: 'System-generated' },
        boxes: { note: 'Note', warn: 'Caution', check: 'Checklist' },
        zoom: 'Enlarge image',
        original: 'Open original image',
        keyTitle: 'Numbered key',
        close: 'Close',
        menu: 'Menu',
        of: 'of',
        stepLabel: 'Step',
        chapterDone: 'You completed this chapter',
        print: 'Print',
        home: 'Guide',
        moreSteps: 'more steps',
        chapterNav: 'Guide chapters',
        open: 'Open chapter',
        openGuide: 'Open the',
        mainGuide: 'Main guide',
    },
}

const esc = (s) =>
    String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

const ICONS = {
    note: '<path d="M12 8h.01M11 12h1v4h1"/><circle cx="12" cy="12" r="9"/>',
    warn: '<path d="M12 9v4m0 4h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    check: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    tick: '<path d="M20 6 9 17l-5-5"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>',
}
const icon = (name, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`

// ---------------------------------------------------------------- structure

// Groups the flat block list into chapters → sections, assigns stable ids and
// a label → id map for \ref links.
export function structure(doc, prefix = 'c') {
    // Keep saved links/progress attached to the same content after removing
    // Chapter 2's duplicated HR walkthroughs. Display numbers remain sequential.
    const stableIds = {
        'sec:setup-check': 'c2-s8',
        'sec:setup-errors': 'c2-s9',
        'sec:setup-next': 'c2-s10',
        'tab:setup-errors': 'c2-t6',
    }
    const chapters = []
    let appendix = false
    let ch = null,
        sec = null,
        sub = 0
    const ids = new Map()
    for (const b of doc.blocks) {
        if (b.type === 'appendix') {
            appendix = true
            continue
        }
        if (b.type === 'chapter') {
            ch = { ...b, appendix, id: `${prefix}${chapters.length + 1}`, intro: [], sections: [], tables: 0, figures: 0 }
            chapters.push(ch)
            sec = null
            sub = 0
            if (b.label) ids.set(b.label, ch.id)
            continue
        }
        if (!ch) continue
        if (b.type === 'heading' && b.level === 2) {
            sec = { ...b, id: stableIds[b.label] ?? `${ch.id}-s${ch.sections.length + 1}`, blocks: [] }
            ch.sections.push(sec)
            sub = 0
            if (b.label) ids.set(b.label, sec.id)
            continue
        }
        const target = sec ? sec.blocks : ch.intro
        if (b.type === 'heading') {
            b.id = `${sec ? sec.id : ch.id}-${++sub}`
            if (b.label) ids.set(b.label, b.id)
        }
        if (b.type === 'pagebreak') continue
        target.push(b)
    }
    // Number-carrying floats get ids too (c1-t2, c1-f1).
    for (const c of chapters) {
        const all = [...c.intro, ...c.sections.flatMap((s) => s.blocks)]
        const walk = (bs) =>
            bs.forEach((b) => {
                if (b.type === 'table' && b.caption) {
                    b.id = stableIds[b.label] ?? `${c.id}-t${c.tables + 1}`
                    c.tables++
                    if (b.label) ids.set(b.label, b.id)
                }
                if (b.type === 'figure' && b.caption) {
                    b.id = `${c.id}-f${++c.figures}`
                    if (b.label) ids.set(b.label, b.id)
                }
                if (b.blocks) walk(b.blocks)
            })
        walk(all)
    }
    return { chapters, ids }
}

// ---------------------------------------------------------------- links

// Every id starts with its chapter id (c2, c2-s4, c2-t1), which names its page.
export const pageOf = (id) => `${id.split('-')[0]}.html`
const link = (id, page, routes = {}) => {
    const target = routes[id] ?? pageOf(id)
    if (target === page) return `#${id}`
    return id.includes('-') ? `${target}#${id}` : target
}

// ---------------------------------------------------------------- inline

function inline(src, ctx) {
    const runs = parseInline(src, ctx)
    return runs
        .map((r) => {
            if (r.br) return '<br>'
            if (r.badge) return `<span class="badge badge-${r.badge.key}">${esc(ctx.ui.badges[r.badge.key])}</span>`
            let t = esc(r.text)
            if (r.symbol) return `<span class="dep" aria-hidden="true">${ctx.lang === 'ar' ? '←' : '→'}</span>`
            if (r.ref) {
                const id = ctx.ids.get(r.ref)
                if (!id || ctx.nolink) return `<span dir="ltr">${t}</span>` // nolink: titles inside navigation links
                return `<a class="xref" href="${link(id, ctx.page, ctx.routes)}" dir="ltr">${t}</a>`
            }
            if (r.mono) t = `<code>${t}</code>`
            else if (r.color === '00696D') t = `<code class="key">${t}</code>`
            else if (r.latin && ctx.lang === 'ar') t = `<span dir="ltr">${t}</span>`
            if (r.bold) t = `<strong>${t}</strong>`
            return t
        })
        .join('')
}

// Plain text for the search and step index, which the browser escapes itself.
const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
const text = (src, ctx) => decode(plain(src, ctx))

const plain = (src, ctx) =>
    inline(src, ctx)
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()

// ---------------------------------------------------------------- blocks

let diagramSeq = 0

function renderList(b, ctx) {
    if (b.kind === 'number') {
        return `<ol class="steps">${b.items.map((it, i) => `<li class="reveal" style="--d:${i}"><span class="steps-no">${i + 1}</span><div class="steps-body">${inline(it, ctx)}</div></li>`).join('')}</ol>`
    }
    if (b.kind === 'check') {
        return `<ul class="checks">${b.items
            .map((it, i) => {
                const key = `${ctx.sectionId}-k${i + 1}`
                return `<li><label class="check"><input type="checkbox" data-check="${key}"><span class="check-box">${icon('tick')}</span><span class="check-text">${inline(it, ctx)}</span></label></li>`
            })
            .join('')}</ul>`
    }
    return `<ul class="bullets">${b.items.map((it) => `<li>${inline(it, ctx)}</li>`).join('')}</ul>`
}

function renderTable(b, ctx) {
    const head = b.rows.find((r) => r.header) ?? null
    const body = b.rows.filter((r) => !r.header)
    const labels = head ? head.cells.map((c) => plain(c, ctx)) : []
    const caption = b.caption
        ? `<figcaption><span class="cap-no">${ctx.ui.table} ${esc(b.number)}</span>${inline(b.caption, ctx)}</figcaption>`
        : ''
    const thead = head
        ? `<thead><tr>${head.cells.map((c) => `<th scope="col">${inline(c, ctx)}</th>`).join('')}</tr></thead>`
        : ''
    // A page directory (first cell "Page — Section") becomes a grid of buttons
    // that open each dedicated feature page, numbered in reading order.
    const featureOf = (cell) => {
        const name = plain(cell, ctx).split(' — ')[0].trim()
        const own = ctx.features?.filter(f => f.id.split('-')[0] === ctx.sectionId?.split('-')[0]) ?? []
        const i = own.findIndex((f) => plain(f.title, ctx) === name)
        return i < 0 ? null : { feature: own[i], no: i + 1, section: plain(cell, ctx).split(' — ')[1] ?? '' }
    }
    // A directory of another guide's chapters (tab:guide-<name>-chapters) becomes
    // chapter cards that open that guide, in row order, plus a button to its home.
    const other = /^tab:guide-(\w+)-chapters/.exec(b.label ?? '')?.[1]
    const linked = other && ctx.linked?.[other]
    if (linked && body.length === linked.chapters.length) {
        const nav = { ...ctx, nolink: true }
        return `<figure class="page-cards reveal"${b.id ? ` id="${b.id}"` : ''}>${caption}<ol class="page-grid">${body
            .map((r, i) => {
                const x = linked.chapters[i]
                return `<li><a class="page-card" href="${x.page}"><span class="page-card-top"><span class="page-card-no" dir="ltr">${esc(x.number)}</span><span class="page-card-sec">${esc(countLabel(x.count, ctx.ui.steps === 'steps' ? 'en' : 'ar', 'step'))}</span></span><span class="page-card-title">${inline(r.cells[0], nav)}</span><span class="page-card-desc">${inline(r.cells[1] ?? '', nav)}</span><span class="page-card-go">${esc(ctx.ui.open)} ${ARROW}</span></a></li>`
            })
            .join('')}</ol><p class="guide-open"><a class="btn btn-primary" href="${linked.home}">${esc(ctx.ui.openGuide)} ${esc(linked.title)} ${ARROW}</a></p></figure>`
    }
    const cards = /^tab:(hr|tasks|projects|builder|correspondence|settings)-pages-/.test(b.label ?? '') ? body.map((r) => featureOf(r.cells[0])) : []
    if (cards.length && cards.every(Boolean)) {
        const nav = { ...ctx, nolink: true }
        return `<figure class="page-cards reveal"${b.id ? ` id="${b.id}"` : ''}>${caption}<ol class="page-grid">${cards
            .map(({ feature, no, section }, row) => `<li><a class="page-card" href="${link(feature.id, ctx.page, ctx.routes)}" data-toc="${feature.id}"><span class="page-card-top"><span class="page-card-no" dir="ltr">${no}</span><span class="page-card-sec">${section}</span><span class="toc-dot" aria-hidden="true"></span></span><span class="page-card-title">${inline(feature.title, nav)}</span><span class="page-card-desc">${inline(body[row].cells[1] ?? '', nav)}</span><span class="page-card-go">${esc(ctx.ui.openPage)} ${ARROW}</span></a></li>`)
            .join('')}</ol></figure>`
    }
    const tbody = `<tbody>${body.map((r) => `<tr>${r.cells.map((c, i) => `<td data-label="${esc(labels[i] ?? '')}">${inline(c, ctx)}</td>`).join('')}</tr>`).join('')}</tbody>`
    const cls = labels.length >= 2 && labels.length <= 3 ? 'stackable' : ''
    return `<figure class="table-card reveal"${b.id ? ` id="${b.id}"` : ''}>${caption}<div class="table-scroll"><table class="${cls}">${thead}${tbody}</table></div></figure>`
}

// The description and the numbered key are shown apart: a short paragraph,
// then the markers in their order on the screenshot. A marker whose label says
// enough is one compact line; only "label: explanation" keys get a second line.
function renderNote(b, ctx) {
    if (!b.note) return ''
    const text = b.noteText ? `<p class="fig-desc">${inline(b.noteText, ctx)}</p>` : ''
    if (!b.noteKeys?.length) return `<div class="fig-note">${text}</div>`
    const rows = b.noteKeys.map(({ n, text: key }) => {
        const m = /^(.{1,60}?):\s+(.+)$/s.exec(key)
        const body = m
            ? `<strong class="fig-key-term">${inline(m[1], ctx)}</strong><span class="fig-key-text">${inline(m[2], ctx)}</span>`
            : key.length > 48
                ? `<span class="fig-key-text">${inline(key, ctx)}</span>`
                : `<span class="fig-key-term">${inline(key.replace(/[.。]\s*$/, ''), ctx)}</span>`
        return `<li class="${m ? 'is-explained' : key.length > 48 ? 'is-note' : 'is-label'}"><span class="fig-key-no" dir="ltr">${n}</span><span class="fig-key-body">${body}</span></li>`
    }).join('')
    return `<div class="fig-note">${text}<div class="fig-keys"><p class="fig-keys-title">${esc(ctx.ui.keyTitle)}</p><ol>${rows}</ol></div></div>`
}

function renderFigure(b, ctx) {
    const cap = b.caption
        ? `<figcaption><span class="cap-no">${ctx.ui.figure} ${esc(b.number)}</span>${inline(b.caption, ctx)}</figcaption>`
        : ''
    const id = b.id ? ` id="${b.id}"` : ''
    const note = renderNote(b, ctx)
    if (b.image) {
        const file = b.image.split('/').pop()
        const alt = b.caption ? plain(b.caption, ctx) : ''
        return `<figure class="shot reveal"${id}><button class="shot-btn" type="button" data-zoom aria-label="${esc(ctx.ui.zoom)}"><img src="../assets/screens/${esc(file)}" alt="${esc(alt)}" loading="lazy" decoding="async" style="--w:${Math.round((b.imageWidth ?? 1) * 100)}%"><span class="shot-zoom">${icon('zoom')}</span></button>${cap}${note}<a class="shot-original" href="../assets/screens/${esc(file)}" target="_blank" rel="noopener">${esc(ctx.ui.original)}</a></figure>`
    }
    if (b.tikz) {
        const svg = renderDiagram(b.tikz, { dir: ctx.ui.dir, id: `dg${++diagramSeq}` })
        return `<figure class="diagram-card reveal"${id}><div class="diagram-wrap">${svg}</div>${cap}${note}</figure>`
    }
    return ''
}

// Examples stay visible in short mode: callouts titled «مثال…»/«تطبيق المثال»/«Example…»
// and paragraphs that open with a bold «تطبيق المثال:».
const EXAMPLE = /^\s*(?:\\textbf\{)?\s*(?:تطبيق المثال|مثال|Example|Applying the example)/

function renderBlock(b, ctx) {
    switch (b.type) {
        case 'para':
            return EXAMPLE.test(b.src) ? `<p class="is-example">${inline(b.src, ctx)}</p>` : `<p>${inline(b.src, ctx)}</p>`
        case 'heading':
            return `<h3 id="${b.id}" class="sub">${inline(b.title, ctx)}</h3>`
        case 'list':
            return renderList(b, ctx)
        case 'table':
            return renderTable(b, ctx)
        case 'figure':
            return renderFigure(b, ctx)
        case 'video':
            // A recorded walkthrough placed under its section heading (tools/guide-videos.mjs).
            return `<figure class="guide-video reveal"><video controls preload="metadata" playsinline src="../assets/videos/${esc(b.file.split('/').pop())}"></video>${b.title ? `<figcaption>${esc(b.title)}</figcaption>` : ''}</figure>`
        case 'box': {
            const title = b.title ? inline(b.title, ctx) : esc(ctx.ui.boxes[b.kind])
            return `<aside class="callout callout-${b.kind}${EXAMPLE.test(b.title ?? '') ? ' is-example' : ''} reveal"><div class="callout-head">${icon(b.kind)}<span>${title}</span></div><div class="callout-body">${b.blocks.map((x) => renderBlock(x, ctx)).join('')}</div></aside>`
        }
        default:
            return ''
    }
}

// ---------------------------------------------------------------- pages

const words = (html) =>
    html
        .replace(/<[^>]+>/g, ' ')
        .split(/\s+/)
        .filter(Boolean).length
const ARROW = '<svg class="ic flip" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
const ring = (id) =>
    `<span class="toc-ring" data-ring="${id}" aria-hidden="true"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/><circle class="ring-val" cx="10" cy="10" r="8" pathLength="100"/></svg></span>`

// The guides as apps. The two reference guides explain every page; each
// practical app builds one real workflow and names the parts of Kayan it makes
// clearer. Addresses come from guide-links.mjs.
const APPS_UI = {
    ar: { title: 'تطبيقات الدليل', heading: 'اختر ما تريد أن تفهمه', here: 'أنت هنا', soon: 'قريباً', deepens: 'يعمّق فهمك لـ', groups: { reference: ['المرجع', 'يشرح كل صفحة في كيان'], practice: ['تطبيقات عملية', 'تفهم الأدوات وأنت تبني بها مساراً كاملاً'] } },
    en: { title: 'Guide apps', heading: 'Choose what you want to understand', here: 'You are here', soon: 'Coming soon', deepens: 'Deepens', groups: { reference: ['Reference', 'Explains every page in Kayan'], practice: ['Practical apps', 'Understand the tools by building a full workflow with them'] } },
}
const GUIDE_APPS = [
    { id: 'main', group: 'reference', icon: '<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10M9 8h5"/>',
      ar: ['الدليل الرئيسي', 'المرجع الكامل لتطبيقات كيان: الموارد البشرية والمهام والمشاريع والمراسلات والإعدادات.'],
      en: ['Main guide', 'The full reference for Kayan apps: HR, tasks, projects, correspondence and settings.'] },
    { id: 'builder', group: 'reference', icon: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/><path d="M16.5 4v7M13 7.5h7M7.5 13v7M4 16.5h7"/>',
      ar: ['أدوات البناء', 'كل أداة بناء صفحةً صفحة: الكيانات والنماذج والخدمات والإجراءات ولوحات المعلومات.'],
      en: ['Builder', 'Every builder tool page by page: entities, forms, services, SOPs and dashboards.'] },
    { id: 'inspection', group: 'practice', icon: '<path d="M9 4h6l1 2h3v14H5V6h3z"/><path d="m9 13 2 2 4-4"/>',
      ar: ['الكشف على المنشآت', 'تبني مسار كشف كاملاً من الصفر، فترى أدوات البناء وهي تعمل معاً.', ['الكيانات', 'النماذج', 'لوحات المعلومات']],
      en: ['Inspection', 'Build a full inspection workflow from scratch and see the builder tools work together.', ['Entities', 'Forms', 'Dashboards']] },
    { id: 'correspondence', group: 'practice', icon: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="m3 8 9 6 9-6"/>',
      ar: ['المراسلات', 'تتابع دورة كتاب رسمي من إنشائه إلى أرشفته: الوارد والإحالة والرد والصادر.', ['المراسلات الرسمية', 'الموارد البشرية']],
      en: ['Correspondence', 'Follow an official letter from drafting to archive: incoming, referral, reply and outgoing.', ['Official correspondence', 'HR']] },
]
function guideApps(lang, currentId, home) {
    const t = APPS_UI[lang]
    return Object.entries(t.groups).map(([group, [title, hint]]) => `<section class="apps-group"><h3>${esc(title)}<small>${esc(hint)}</small></h3><div class="apps-grid">${GUIDE_APPS.filter(a => a.group === group).map(app => {
        const [name, desc, deepens] = app[lang]
        const current = currentId === app.id
        // The two walkthroughs are written in Arabic only.
        const target = `${guideUrl(app.id)}${app.group === 'reference' ? lang : 'ar'}/${app.id === 'builder' ? 'builder' : 'index'}.html`
        const badge = current ? `<small class="app-badge app-here">${esc(t.here)}</small>` : app.soon ? `<small class="app-badge">${esc(t.soon)}</small>` : ''
        return `<a class="app-tile" data-app="${app.id}" href="${current ? home : target}"${current ? ' aria-current="page"' : ''}><span class="app-icon" aria-hidden="true"><svg class="ic" viewBox="0 0 24 24">${app.icon}</svg></span><span class="app-body"><span class="app-name">${esc(name)}${badge}</span><span class="app-desc">${esc(desc)}</span>${deepens ? `<span class="app-deepens"><span>${esc(t.deepens)}</span>${deepens.map(d => `<b>${esc(d)}</b>`).join('')}</span>` : ''}</span></a>`
    }).join('')}</div></section>`).join('')
}

// Head, top bar, search palette, lightbox and data shared by every page.
function shell({ ui, lang, page, home = 'index.html', title, description, body, data, assetsVersion }) {
    return `<!doctype html>
<html lang="${lang}" dir="${ui.dir}" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="dark light">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="alternate" hreflang="${ui.other}" href="../${ui.other}/${page}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&family=Cairo:wght@400;500;700;800&display=swap">
<script>try{var t=localStorage.getItem('kos-guide-theme');if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t;if(localStorage.getItem('kos-guide-short')==='on')document.documentElement.dataset.short='on';localStorage.setItem('kos-guide-lang','${lang}')}catch(e){}</script>
<link rel="stylesheet" href="../assets/guide.css${assetsVersion}">
</head>
<body class="${page === home ? 'page-home' : 'page-chapter'}">
<a class="skip" href="#main">${esc(ui.start)}</a>
<div class="read-progress" aria-hidden="true"><span></span></div>
<header class="topbar">
  <div class="topbar-in">
    ${page === home ? '' : `<button class="icon-btn menu-btn" type="button" data-open-toc aria-label="${esc(ui.menu)}"><svg class="ic" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>`}
    <a class="brand" href="${home}" aria-label="${esc(ui.brand)}"><img src="../assets/kayanos-mark.svg" alt="" width="34" height="23"><span class="brand-name">Kayan<b>OS</b></span><span class="brand-sep"></span><span class="brand-sub">${esc(ui.brand)}</span></a>
    <button class="apps-btn" type="button" data-open-apps aria-haspopup="dialog" aria-controls="guide-apps" aria-label="${esc(APPS_UI[lang].title)}" title="${esc(APPS_UI[lang].title)}"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg><span>${esc(APPS_UI[lang].title)}</span></button>
    <button class="search-btn" type="button" data-open-search><svg class="ic" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><span>${esc(ui.search)}</span><kbd dir="ltr">Ctrl K</kbd></button>
    <button class="guide-help-link" type="button" data-open-help aria-haspopup="dialog" aria-controls="guide-help" aria-label="${esc(ui.help)}" title="${esc(ui.help)}"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 2-2.5 3.5M12 16h.01"/></svg><span>${esc(ui.help)}</span></button>
    <a class="lang-btn" href="../${ui.other}/${page}" data-lang-switch="${ui.other}" hreflang="${ui.other}" lang="${ui.other}">${esc(ui.otherName)}</a>
    <button class="icon-btn short-btn" type="button" data-short-toggle aria-pressed="false" aria-label="${esc(ui.short)}" title="${esc(ui.short)}"><svg class="ic" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="m3 13 5-4 4 3 3-2 6 4M8 20h8"/></svg><span class="short-label">${esc(ui.short)}</span></button>
    <button class="icon-btn theme-btn" type="button" data-theme-toggle aria-label="${esc(ui.theme)}" title="${esc(ui.theme)}"><svg class="ic sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="ic moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
  </div>
</header>
${body}
<dialog class="help-dialog apps-dialog" id="guide-apps" aria-labelledby="apps-title">
  <header class="help-dialog-head"><div><span class="help-eyebrow">${esc(APPS_UI[lang].title)}</span><h2 id="apps-title">${esc(APPS_UI[lang].heading)}</h2></div><form method="dialog"><button class="icon-btn" aria-label="${esc(ui.close)}" autofocus><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></form></header>
  <div class="help-dialog-body">${guideApps(lang, data.guideId, home)}</div>
</dialog>
<dialog class="help-dialog" id="guide-help" aria-labelledby="help-title">
  <header class="help-dialog-head"><div><span class="help-eyebrow">${esc(ui.help)}</span><h2 id="help-title">${esc(ui.helpTitle)}</h2></div><form method="dialog"><button class="icon-btn" aria-label="${esc(ui.close)}" autofocus><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></form></header>
  <div class="help-dialog-body">
    ${data.readingHelp || ''}
    <section class="help-card"><span class="help-card-no" aria-hidden="true">01</span><div><h3>${esc(ui.helpFieldsTitle)}</h3><p>${esc(ui.helpFields)}</p></div></section>
    <section class="help-card"><span class="help-card-no" aria-hidden="true">02</span><div><h3>${esc(ui.helpDiagramsTitle)}</h3><p>${esc(ui.helpDiagrams)}</p><ul class="legend">${Object.entries(ui.legend).map(([kind, label]) => `<li><svg viewBox="0 0 36 10" aria-hidden="true"><line class="dg-edge dg-${kind} static" x1="2" y1="5" x2="30" y2="5"/><path class="dg-head dg-head-${kind}" d="${kind === 'flowsTo' ? 'M27 1 L34 5 L27 9' : 'M27 1 L34 5 L27 9 Z'}"/></svg>${esc(label)}</li>`).join('')}</ul></div></section>
    <section class="help-card"><span class="help-card-no" aria-hidden="true">03</span><div><h3>${esc(ui.helpWorkTitle)}</h3><p>${esc(ui.helpWork)}</p></div></section>
  </div>
  <form method="dialog" class="help-dialog-foot"><button class="btn btn-primary">${esc(ui.close)}</button></form>
</dialog>
<div class="palette" role="dialog" aria-modal="true" aria-label="${esc(ui.searchShort)}" hidden>
  <div class="palette-box">
    <div class="palette-input"><svg class="ic" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><input type="search" placeholder="${esc(ui.search)}" autocomplete="off" spellcheck="false" aria-label="${esc(ui.search)}"><kbd>Esc</kbd></div>
    <ul class="palette-list" role="listbox"></ul>
    <div class="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> ${esc(ui.navHint)}</span><span><kbd>Enter</kbd> ${esc(ui.openHint)}</span><span><kbd>Esc</kbd> ${esc(ui.closeHint)}</span></div>
  </div>
</div>
<div class="lightbox" hidden><button class="icon-btn lightbox-close" type="button" aria-label="${esc(ui.close)}"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><img alt=""></div>
<dialog class="reset-dialog" aria-labelledby="reset-title" aria-describedby="reset-description">
  <div class="reset-dialog-icon" aria-hidden="true"><svg class="ic" viewBox="0 0 24 24"><path d="M3 10a9 9 0 1 1 2.7 8.4M3 4v6h6"/></svg></div>
  <h2 id="reset-title">${esc(ui.resetConfirm)}</h2>
  <p id="reset-description">${esc(ui.resetDescription)}</p>
  <form method="dialog" class="reset-dialog-actions">
    <button class="btn btn-ghost" value="cancel" autofocus>${esc(ui.cancel)}</button>
    <button class="btn reset-confirm" value="reset">${esc(ui.resetAction)}</button>
  </form>
</dialog>
<div class="toast" role="status" aria-live="polite"></div>
<script id="guide-data" type="application/json">${JSON.stringify({ ...data, page }).replace(/</g, '\\u003c')}</script>
<script src="../assets/guide.js${assetsVersion}" defer></script>
</body>
</html>
`
}

// Old chapter-page anchors whose content moved to a dedicated page. HR once
// held nine walkthrough steps on c3.html; each now lives on its feature page.
const LEGACY = {
    'c2.html#c2-s5': 'fig:hr-models',
    'c2.html#c2-s6': 'sec:hr-feature-members',
    'c2.html#c2-s6-1': 'sec:hr-feature-locations',
    'c2.html#c2-s6-2': 'sec:hr-feature-assignments',
    'c2.html#c2-s6-3': 'sec:hr-pages',
    'c2.html#c2-s6-4': 'sec:hr-feature-members',
    'c2.html#c2-s7': 'ch:hr',
    'c2.html#c2-f3': 'fig:hr-models',
    'c2.html#c2-f4': 'fig:hr-feature-locations-screen',
    'c2.html#c2-f5': 'fig:hr-feature-nodes-screen',
    'c2.html#c2-f6': 'fig:hr-feature-positions-screen',
    'c2.html#c2-f7': 'fig:hr-feature-members-screen',
    'c2.html#c2-f8': 'fig:hr-feature-assignments-screen',
    'c2.html#c2-f9': 'sec:hr-pages',
    'c2.html#c2-t4': 'sec:hr-pages',
    'c2.html#c2-t5': 'ch:hr',
    'c1.html#c1-s6': 'tab:intro-app-map',
    'c1.html#c1-s7': 'sec:setup-minute',
    'c3.html#c3-s3': 'sec:hr-feature-assignments',
    'c3.html#c3-s4': 'sec:hr-shifts',
    'c3.html#c3-s5': 'sec:hr-shift-inheritance',
    'c3.html#c3-s6': 'sec:hr-feature-my-attendance',
    'c3.html#c3-s7': 'sec:hr-feature-leaves',
    'c3.html#c3-s8': 'sec:hr-feature-payroll-inputs',
    'c3.html#c3-s9': 'sec:hr-feature-salary-slips',
    'c3.html#c3-s10': 'sec:hr-pages',
    'c3.html#c3-s11': 'ch:hr',
}

// Returns { 'index.html': html, 'c1.html': html, … } for one language.
// `guide` renders a companion guide in the same folder (the Builder guide:
// home builder.html, chapters b1.html …) with its own ids, progress and home,
// a link back to the main guide, and search across both guides (`extra`).
// `linked` gives another guide's chapters to tab:guide-<name>-chapters tables;
// `out` receives this guide's search entries, routes and chapters.
export function renderSite(doc, { lang, assetsVersion = '', guide = {} }) {
    const { home = 'index.html', prefix = 'c', store = 'kos-guide-progress', parent = null, linked = {}, extra = null, out = null } = guide
    const ui = { ...UI[lang] }
    const { chapters, ids } = structure(doc, prefix)
    // Keep authored reading advice in the help dialog, outside the lesson and its search index.
    const readingBlocks = []
    if (guide.readingHelp) for (const chapter of chapters) for (const section of chapter.sections) {
        const at = section.blocks.findIndex(b => b.type === 'heading' && b.title === guide.readingHelp.title)
        if (at >= 0) readingBlocks.push(...section.blocks.splice(at, guide.readingHelp.blocks + 1))
    }
    const features = chapters.flatMap(c => c.sections).filter(s => /^sec:(hr|tasks|projects|builder|correspondence|settings)-feature-/.test(s.label ?? ''))
    const routes = {}
    for (const s of features) {
        const [, app, slug] = s.label.match(/^sec:(hr|tasks|projects|builder|correspondence|settings)-feature-(.+)$/)
        const page = `${app}-${slug}.html`
        routes[s.id] = page
        const visit = blocks => blocks.forEach(b => { if (b.id) routes[b.id] = page; if (b.blocks) visit(b.blocks) })
        visit(s.blocks)
    }
    const pageOf = id => routes[id] ?? `${id.split('-')[0]}.html`
    // A reference may point into the other guide: its ids, numbers and pages resolve the link.
    const base = {
        ui,
        lang,
        ids: new Map([...(extra?.ids ?? []), ...ids]),
        routes: { ...extra?.routes, ...routes },
        features,
        linked,
        labels: new Map([...(extra?.labels ?? []), ...doc.labels]),
        colors: { rcPrimary: '00696D' },
    }
    // A companion guide is named by its own cover title (the top bar, page titles, crumbs).
    if (parent && doc.coverArgs?.[1]) ui.brand = plain(doc.coverArgs[1], base)
    diagramSeq = 0

    // Render every chapter body first: it gives the step list, search index and word count.
    let totalWords = 0
    const steps = []
    const search = []
    const sectionBodies = new Map()
    const bodies = chapters.map((c) => {
        const page = pageOf(c.id)
        const intro = c.intro.map((b) => renderBlock(b, { ...base, page, sectionId: c.id })).join('')
        search.push({ id: c.id, p: page, c: '', t: text(c.title, base), n: c.kicker, x: '', chapter: true })
        const sections = c.sections
            .map((s) => {
                const page = pageOf(s.id)
                const ctx = { ...base, page, sectionId: s.id }
                const body = s.blocks.map((b) => renderBlock(b, ctx)).join('')
                totalWords += words(body)
                steps.push({ id: s.id, p: page, c: c.id, t: text(s.title, ctx), n: s.number ?? '' })
                search.push({
                    id: s.id,
                    p: page,
                    c: text(c.title, base),
                    t: text(s.title, ctx),
                    n: s.number ?? '',
                    x: body
                        .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim()
                        .replace(/&(lt|gt|quot|#39|amp);/g, (m) => decode(m))
                        .slice(0, 1600),
                })
                for (const b of s.blocks)
                    if (b.type === 'heading')
                        search.push({
                            id: b.id,
                            p: page,
                            c: text(c.title, base),
                            t: text(b.title, ctx),
                            n: b.number ?? '',
                            x: '',
                            sub: true,
                        })
                const rendered = `<section class="step reveal-step" id="${s.id}" data-chapter="${c.id}" aria-labelledby="${s.id}-h">
<header class="step-head">
  <span class="step-no" dir="ltr">${esc(s.number ?? '')}</span>
  <h2 id="${s.id}-h">${inline(s.title, ctx)}</h2>
  <div class="step-tools">
    <button class="icon-btn copy-link" type="button" data-copy="${s.id}" title="${esc(ui.copyLink)}" aria-label="${esc(ui.copyLink)}">${icon('link')}</button>
  </div>
</header>
<div class="step-body" data-short-empty="${esc(ctx.ui.shortEmpty)}">${body}</div>
<footer class="step-foot"><button class="done-btn" type="button" data-done="${s.id}" aria-pressed="false"><span class="done-box">${icon('tick')}</span><span class="done-off">${esc(ui.markDone)}</span><span class="done-on">${esc(ui.done)}</span></button></footer>
</section>`
                sectionBodies.set(s.id, rendered)
                return routes[s.id] ? '' : rendered
            })
            .join('\n')
        return { intro, sections }
    })

    // The other guide's entries make search span both guides; its routes open them.
    if (out) Object.assign(out, { search, routes, ids, labels: doc.labels, chapters: chapters.map((c) => ({ id: c.id, page: pageOf(c.id), number: c.number, count: c.sections.length })) })
    const data = {
        guideId: guide.id ?? (parent ? 'builder' : 'main'),
        readingHelp: readingBlocks.length ? `<section class="reading-help">${readingBlocks.map(b => renderBlock(b, { ...base, page: home })).join('')}</section>` : '',
        lang,
        home,
        store,
        routes: base.routes,
        ui: { copied: ui.copied, noResults: ui.noResults, resetConfirm: ui.resetConfirm, chapterDone: ui.chapterDone },
        chapters: chapters.map((c) => ({ id: c.id, p: pageOf(c.id) })),
        legacy: Object.fromEntries(
            Object.entries(LEGACY)
                .map(([old, label]) => [old, ids.get(label)])
                .filter(([, id]) => id)
                .map(([old, id]) => [old, `${pageOf(id)}#${id}`])
        ),
        steps,
        search: [...search, ...(extra?.search ?? [])],
    }
    const title = plain(doc.coverArgs?.[1] ?? ui.brand, base)
    const description = plain(doc.coverArgs?.[2] ?? '', base)
    if (out) out.title = text(doc.coverArgs?.[1] ?? ui.brand, base)
    const pages = {}

    // ---- home
    const [kicker, coverTitle, subtitle, date, version, org] = (doc.coverArgs ?? []).map((a) => inline(a, base))
    const minutes = Math.max(1, Math.round(totalWords / 180))
    const cards = chapters
        .map((c, i) => {
            const page = pageOf(c.id)
            const shown = c.sections.slice(0, 4)
            const more = c.sections.length - shown.length
            return `<article class="path-card reveal" style="--d:${i}">
<a class="path-link" href="${page}"><span class="path-no">${esc(c.kicker)}</span>${ring(c.id)}
<span class="path-title">${inline(c.title, { ...base, nolink: true })}</span></a>
<ol class="path-steps">${shown.map((s) => `<li><a href="${link(s.id, home, routes)}" data-toc="${s.id}"><span class="toc-dot" aria-hidden="true"></span><span>${inline(s.title, { ...base, page: home, nolink: true })}</span></a></li>`).join('')}${more > 0 ? `<li class="path-more"><a href="${page}">+${more} ${esc(ui.moreSteps)}</a></li>` : ''}</ol>
<div class="path-foot"><span class="path-meta">${esc(countLabel(c.sections.length, ui.steps === 'steps' ? 'en' : 'ar', 'step'))}</span><a class="path-open" href="${page}">${esc(ui.open)} ${ARROW}</a></div>
<span class="path-bar" aria-hidden="true"><span data-chapter-bar="${c.id}"></span></span>
</article>`
        })
        .join('')
    pages[home] = shell({
        ui,
        lang,
        page: home,
        home,
        title,
        description,
        data,
        assetsVersion,
        body: `
<main id="main">
<section class="hero">
  <div class="hero-bg" aria-hidden="true"><span class="orb o1"></span><span class="orb o2"></span><span class="orb o3"></span><span class="grid"></span></div>
  <div class="hero-in">
    <p class="eyebrow reveal">${kicker ?? ''}</p>
    <h1 class="hero-title reveal"><span class="grad">${coverTitle ?? ''}</span></h1>
    <p class="hero-sub reveal">${subtitle ?? ''}</p>
    <div class="hero-cta reveal">
      <a class="btn btn-primary" href="${link(steps[0]?.id ?? `${prefix}1`, home)}" data-continue><span class="cta-start">${esc(ui.start)}</span><span class="cta-cont">${esc(ui.continue)}</span>${ARROW}</a>
      <button class="btn btn-ghost" type="button" data-open-search>${esc(ui.searchShort)} <kbd dir="ltr">Ctrl K</kbd></button>${parent ? `<a class="btn btn-ghost" href="index.html">${esc(ui.mainGuide)}</a>` : ''}
    </div>
  </div>
  <div class="paths">
    <h2 class="paths-title reveal">${esc(ui.paths)}</h2>
    <div class="paths-grid">${cards}</div>
    <button class="reset-btn home-reset" type="button" data-reset>${esc(ui.reset)}</button>
  </div>
  <div class="paths apps-home">
    <h2 class="paths-title reveal">${esc(APPS_UI[lang].title)}</h2>
    ${guideApps(lang, data.guideId, home)}
  </div>
</section>
</main>`,
    })

    // Keep the authored directory groups as a real chapter → section → page tree.
    // A directory row "Page — Section" names the section that holds the page in
    // Kayan's own navigation, so those pages are grouped by that section (kind
    // 'app'). Tables without it (records opened inside another record) keep their
    // caption as the group (kind 'topic'). Match titles exactly as renderTable
    // does; keep each page once, in source order.
    const chapterGroups = new Map(chapters.map(c => {
        const groups = [], assigned = new Set()
        const overview = c.sections.filter(s => !routes[s.id])
        if (overview.length) groups.push({ title: lang === 'ar' ? 'نظرة عامة' : 'Overview', kind: 'overview', pages: overview })
        const visit = blocks => blocks.forEach(b => {
            if (/^tab:(hr|tasks|projects|builder|correspondence|settings)-pages-/.test(b.label ?? '')) {
                const topic = { title: b.caption, kind: 'topic', pages: [] }
                ;(b.rows ?? []).filter(r => !r.header).forEach(r => {
                    const [name, section] = plain(r.cells[0], base).split(' — ').map(x => x.trim())
                    const s = c.sections.find(s => routes[s.id] && plain(s.title, base) === name)
                    if (!s || assigned.has(s.id)) return
                    assigned.add(s.id)
                    if (!section) return topic.pages.push(s)
                    let group = groups.find(g => g.kind === 'app' && g.title === section)
                    if (!group) groups.push(group = { title: section, kind: 'app', html: true, pages: [] })
                    group.pages.push(s)
                })
                if (topic.pages.length) groups.push(topic)
            }
            if (b.blocks) visit(b.blocks)
        })
        visit([...c.intro, ...overview.flatMap(s => s.blocks)])
        const remaining = c.sections.filter(s => routes[s.id] && !assigned.has(s.id))
        if (remaining.length) groups.push({ title: lang === 'ar' ? 'صفحات الفصل' : 'Chapter pages', kind: 'topic', pages: remaining })
        return [c.id, groups]
    }))
    // App-section titles come from plain(), already escaped HTML.
    const groupTitle = (group, nav) => group.html ? group.title : inline(group.title, nav)
    const groupIcon = {
        overview: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
        app: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
        topic: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    }
    // Before the first "inside records" group, a quiet label explains the change.
    const tocGroups = (groups, here, feature, page, nav) => groups.map((group, gi) => {
        const divider = group.kind === 'topic' && gi > 0 && groups[gi - 1].kind !== 'topic' && groups.some(g => g.kind === 'app')
            ? `<li class="toc-divider" aria-hidden="true">${lang === 'ar' ? 'سجلات تُفتح من داخل غيرها' : 'Records opened inside others'}</li>` : ''
        const open = here && (feature ? group.pages.includes(feature) : gi === 0)
        return `${divider}<li><details class="toc-section is-${group.kind}"${open ? ' open' : ''}><summary><svg class="ic toc-sec-icon" viewBox="0 0 24 24" aria-hidden="true">${groupIcon[group.kind]}</svg><span class="toc-sec-title">${groupTitle(group, nav)}</span><span class="section-count" dir="ltr" data-section-count>${group.pages.length}</span><svg class="ic toc-sec-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><ol class="toc-secs">${group.pages.map(s => `<li><a href="${link(s.id, page, routes)}" data-toc="${s.id}"${feature === s ? ' aria-current="page"' : ''}><span class="toc-dot" aria-hidden="true"></span><span>${inline(s.title, nav)}</span></a></li>`).join('')}</ol></details></li>`
    }).join('')

    // ---- one page per chapter
    const views = chapters.flatMap((c, ci) => [{c, ci}, ...c.sections.filter(s => routes[s.id]).map(feature => ({c, ci, feature}))])
    views.forEach(({c, ci, feature}) => {
        const page = feature ? pageOf(feature.id) : pageOf(c.id)
        const ctx = { ...base, page }
        const nav = { ...ctx, nolink: true }
        const toc = chapters
            .map((x) => {
                const here = x === c
                return `<li class="toc-ch${here ? ' current' : ''}">
<a class="toc-ch-link" href="${here && !feature ? `#${x.id}` : pageOf(x.id)}"${here && !feature ? ' aria-current="page"' : ''}><span class="toc-ch-no">${esc(x.number)}</span><span class="toc-ch-title">${inline(x.title, nav)}</span>${ring(x.id)}</a>
<details class="toc-chapters${chapterGroups.get(x.id).length < 2 ? ' is-single' : ''}"${here ? ' open' : ''}><summary><span>${lang === 'ar' ? 'أقسام الفصل' : 'Chapter sections'}</span><span class="toc-chapters-count" dir="ltr">${chapterGroups.get(x.id).length}</span><svg class="ic toc-sec-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><ol class="toc-groups">${tocGroups(chapterGroups.get(x.id), here, feature, page, nav)}</ol></details>
</li>`
            })
            .join('')
        const tabs = chapters
            .map(
                (x) =>
                    `<a class="ch-tab${x === c ? ' current' : ''}" href="${x === c && !feature ? `#${x.id}` : pageOf(x.id)}"${x === c && !feature ? ' aria-current="page"' : ''} title="${esc(plain(x.title, ctx))}"><span dir="ltr">${esc(x.number)}</span><span class="ch-tab-t">${inline(x.title, nav)}</span></a>`
            )
            .join('')
        const currentGroup = feature && chapterGroups.get(c.id).find(group => group.pages.includes(feature))
        const prev = chapters[ci - 1],
            next = chapters[ci + 1]
        const pager = `<nav class="chapter-pager">${prev ? `<a class="pager-card prev" href="${pageOf(prev.id)}"><small>${esc(ui.prevChapter)} · ${esc(prev.kicker)}</small><span>${inline(prev.title, nav)}</span></a>` : `<a class="pager-card prev" href="${home}"><small>${esc(ui.home)}</small><span>${title}</span></a>`}${next ? `<a class="pager-card next" href="${pageOf(next.id)}"><small>${esc(ui.nextChapter)} · ${esc(next.kicker)}</small><span>${inline(next.title, nav)}</span></a>` : ''}</nav>`
        // Feature pages: previous/next page of the same app, then the chapter
        // overview or the next chapter at the edges. An app overview offers its
        // first page and the next chapter.
        const own = c.sections.filter((s) => routes[s.id])
        const card = (cls, href, small, label) => `<a class="pager-card ${cls}" href="${href}"><small>${small}</small><span>${label}</span></a>`
        const nextChapter = next ? card('next', pageOf(next.id), `${esc(ui.nextChapter)} · ${esc(next.kicker)}`, inline(next.title, nav)) : ''
        let pagerHtml = pager
        if (feature) {
            const i = own.indexOf(feature)
            const before = own[i - 1],
                after = own[i + 1]
            pagerHtml = `<nav class="chapter-pager">${before ? card('prev', link(before.id, page, routes), esc(ui.prevPage), inline(before.title, nav)) : card('prev', pageOf(c.id), esc(ui.appPages), inline(c.title, nav))}${after ? card('next', link(after.id, page, routes), esc(ui.nextPage), inline(after.title, nav)) : nextChapter || card('next', pageOf(c.id), esc(ui.appPages), inline(c.title, nav))}</nav>`
        } else if (own.length) {
            pagerHtml = `<nav class="chapter-pager has-start">${card('start', link(own[0].id, page, routes), `${esc(ui.firstPage)} · ${own[0].number ?? ''}`, inline(own[0].title, nav))}${nextChapter}</nav>`
        }
        const intro = feature ? '' : bodies[ci].intro
        const sections = feature ? sectionBodies.get(feature.id) : bodies[ci].sections
        pages[page] = shell({
            ui,
            lang,
            page,
            home,
            title: `${text(feature?.title ?? c.title, ctx)} · ${ui.brand}`,
            description,
            data,
            assetsVersion,
            body: `
<div class="layout" id="main">
  <aside class="toc" id="toc" aria-label="${esc(ui.contents)}">
    <div class="toc-head"><span>${esc(ui.contents)}</span><span class="toc-total" dir="ltr" data-total-count>0/${steps.length}</span><button class="icon-btn toc-close" type="button" data-close-toc aria-label="${esc(ui.close)}"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
    <div class="toc-bar" aria-hidden="true"><span data-total-bar></span></div>
    <ol class="toc-list">${toc}</ol>
    <button class="reset-btn" type="button" data-reset>${esc(ui.reset)}</button>
  </aside>
  <div class="toc-scrim" data-close-toc></div>
  <main class="content">
    <article class="chapter${c.appendix ? ' appendix' : ''}" id="${c.id}" aria-labelledby="${c.id}-h">
      <header class="chapter-head">
        <nav class="crumbs reveal" aria-label="${esc(ui.home)}"><a href="index.html">${esc(parent ? ui.mainGuide : ui.home)}</a><span aria-hidden="true">/</span>${parent ? `<a href="${home}">${esc(ui.brand)}</a><span aria-hidden="true">/</span>` : ''}<a href="${pageOf(c.id)}">${inline(c.title, nav)}</a>${feature ? `<span aria-hidden="true">/</span><span>${inline(feature.title, nav)}</span>` : ''}</nav>
        <details class="chapter-picker reveal">
          <summary><span class="chapter-picker-icon" aria-hidden="true"><svg class="ic" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg></span><span class="chapter-picker-label"><span>${esc(ui.chapterNav)}</span><strong>${inline(c.title, nav)}</strong></span><span class="chapter-picker-count" dir="ltr">${ci + 1} / ${chapters.length}</span><svg class="ic chapter-picker-chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></summary>
          <nav class="ch-tabs" aria-label="${esc(ui.chapterNav)}">${tabs}</nav>
        </details>
        <div class="chapter-kicker reveal"><span class="chip">${esc(c.kicker)}</span>${currentGroup ? `<span class="section-context">${groupTitle(currentGroup, nav)}</span>` : `<span class="chapter-meta">${esc(countLabel(chapterGroups.get(c.id).length, lang, 'section'))} · ${esc(countLabel(c.sections.length, lang, 'step'))}</span>`}</div>
        <h1 id="${c.id}-h" class="chapter-title reveal">${inline(feature?.title ?? c.title, ctx)}</h1>
        <div class="chapter-progress" aria-hidden="true"><span data-chapter-bar="${c.id}"></span></div>
      </header>
      ${!feature && prefix === 'c' ? renderChapterOverview(c.label, lang, label => {
          const id = ids.get(label)
          if (!id) throw new Error(`Missing chapter overview target: ${label}`)
          return link(id, page, routes)
      }, esc) : ''}
      ${intro ? `<div class="chapter-intro">${intro}</div>` : ''}
      ${sections}
      ${pagerHtml}
    </article>
  </main>
</div>
<nav class="stepper" aria-label="${esc(ui.stepLabel)}">
  <button class="icon-btn" type="button" data-step-prev aria-label="${esc(ui.prev)}" title="${esc(ui.prev)} ( [ )"><svg class="ic flip" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>
  <button class="stepper-mid" type="button" data-open-toc-mobile><span class="stepper-count" dir="ltr" data-step-count></span><span class="stepper-title" data-step-title></span></button>
  <button class="icon-btn" type="button" data-step-next aria-label="${esc(ui.next)}" title="${esc(ui.next)} ( ] )"><svg class="ic flip" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>
</nav>`,
        })
    })
    return pages
}
