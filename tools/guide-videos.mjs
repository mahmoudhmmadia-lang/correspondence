// Recorded videos shown under section headings of the HTML guide.
// Guide Studio writes review/videos.json: { "<section label>": [{ file, title: { ar, en } }] }.
// Videos exist only in the HTML guide; the LaTeX sources, PDF and Word outputs are unchanged.
import fs from 'node:fs'
import path from 'node:path'

export function loadVideos(root) {
    try {
        return JSON.parse(fs.readFileSync(path.join(root, 'review/videos.json'), 'utf8'))
    } catch {
        return {}
    }
}

// Inserts a video block directly after each section heading that has one. Returns the files used.
export function attachVideos(blocks, videos, lang) {
    const used = new Set()
    for (let i = blocks.length - 1; i >= 0; i--) {
        const b = blocks[i]
        const list = b.type === 'heading' && b.level === 2 && b.label ? videos[b.label] : null
        if (!list?.length) continue
        const items = list
            .filter((v) => /^assets\/videos\/[A-Za-z0-9._-]+\.(mp4|webm)$/.test(v.file ?? ''))
            .map((v) => ({ type: 'video', file: v.file, title: v.title?.[lang] || v.title?.ar || v.title?.en || '' }))
        items.forEach((v) => used.add(v.file))
        blocks.splice(i + 1, 0, ...items)
    }
    return used
}

// Copies the used videos into site/assets/videos and removes videos no page shows any more.
export function copyVideos(root, site, used) {
    const out = path.join(site, 'assets/videos')
    if (!used.size) return fs.rmSync(out, { recursive: true, force: true })
    fs.mkdirSync(out, { recursive: true })
    const names = new Set([...used].map((f) => path.basename(f)))
    for (const file of used) fs.copyFileSync(path.join(root, file), path.join(out, path.basename(file)))
    for (const name of fs.readdirSync(out)) if (!names.has(name)) fs.unlinkSync(path.join(out, name))
}
