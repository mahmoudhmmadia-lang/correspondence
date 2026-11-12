import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// Bundled renderer and theme keep standalone deployments independent of sibling repositories.
import { loadDocument } from './latex-parse.mjs'
import { renderSite, UI } from './html-render.mjs'
import { loadVideos, attachVideos, copyVideos } from './guide-videos.mjs'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const WEB = path.join(ROOT, 'web')
export const STORE = 'correspondence-walkthrough-progress-v1'
const TITLE = 'المراسلات خطوة بخطوة'

// `root` lets Guide Studio build an isolated draft copy; use the bundled theme.
export function buildHtml(root = ROOT) {
    const site = path.join(root, 'site')
    fs.rmSync(path.join(site, 'ar'), { recursive: true, force: true })
    fs.mkdirSync(path.join(site, 'ar'), { recursive: true })
    fs.mkdirSync(path.join(site, 'assets/screens'), { recursive: true })
    for (const name of ['guide.css', 'guide.js', 'kayanos-mark.svg', 'favicon.svg']) {
        fs.copyFileSync(path.join(WEB, name), path.join(site, 'assets', name))
    }
    const doc = loadDocument(root, { lang: 'ar' })
    copyVideos(root, site, attachVideos(doc.blocks, loadVideos(root), 'ar'))
    const original = { ...UI.ar }
    let pages
    try {
        Object.assign(UI.ar, {
            brand: TITLE,
            start: 'ابدأ التطبيق خطوة بخطوة',
            helpWork:
                'يحفظ زر «تحديد كمنجزة» تقدّم قراءتك في هذا المتصفح فقط، ولا يغيّر شيئاً في كيان.',
        })
        pages = renderSite(doc, { lang: 'ar', guide: { store: STORE, id: 'correspondence', readingHelp: { title: 'كيف تستخدم الدليل؟', blocks: 2 } } })
    } finally {
        Object.assign(UI.ar, original)
    }
    for (const [name, source] of Object.entries(pages)) {
        // Arabic is the only authored language. Fail visibly if the shared shell changes.
        if (!source.includes('class="lang-btn"')) throw new Error('Shared language-switch markup changed')
        const html = source
            .replace(/<a class="lang-btn"[^>]*>[\s\S]*?<\/a>/, '')
            .replace(/<link rel="alternate" hreflang="en"[^>]*>/, '')
        fs.writeFileSync(path.join(site, 'ar', name), html)
    }
    const usedImages = new Set()
    const copyImages = (blocks) =>
        blocks.forEach((block) => {
            if (block.image) {
                usedImages.add(path.basename(block.image))
                fs.copyFileSync(path.join(root, block.image), path.join(site, 'assets/screens', path.basename(block.image)))
            }
            if (block.blocks) copyImages(block.blocks)
        })
    copyImages(doc.blocks)
    // This directory is generated: do not ship screenshots from removed chapters.
    for (const entry of fs.readdirSync(path.join(site, 'assets/screens'), { withFileTypes: true })) {
        if (entry.isFile() && !usedImages.has(entry.name)) fs.unlinkSync(path.join(site, 'assets/screens', entry.name))
    }
    fs.writeFileSync(
        path.join(site, 'index.html'),
        `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=ar/index.html"><title>${TITLE}</title><a href="ar/index.html">افتح ${TITLE}</a></html>`
    )
    return pages
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    console.log(`Built ${Object.keys(buildHtml()).length} Arabic pages.`)
}
