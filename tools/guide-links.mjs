// Where each guide lives. Builds always write the production address, so the
// generated site/ that gets pushed never carries a local link. The local
// preview servers swap in the dev address while serving (localizeGuideLinks).
//
// Override any address with an environment variable:
//   GUIDE_PROD_URL_MAIN, GUIDE_PROD_URL_INSPECTION, GUIDE_PROD_URL_CORRESPONDENCE
//   GUIDE_DEV_URL_MAIN,  GUIDE_DEV_URL_INSPECTION,  GUIDE_DEV_URL_CORRESPONDENCE
// GUIDES_ENV=prod makes a local preview keep the production links.
// The Builder guide ships inside the main deployment and shares its address.

const env = process.env
const slash = url => (url.endsWith('/') ? url : `${url}/`)

export const GUIDE_URLS = {
    main: {
        prod: slash(env.GUIDE_PROD_URL_MAIN ?? 'https://kayan-doc-main.onrender.com/'),
        dev: slash(env.GUIDE_DEV_URL_MAIN ?? 'http://127.0.0.1:4321/'),
    },
    inspection: {
        prod: slash(env.GUIDE_PROD_URL_INSPECTION ?? 'https://inspection-guide.onrender.com/'),
        dev: slash(env.GUIDE_DEV_URL_INSPECTION ?? 'http://127.0.0.1:4323/'),
    },
    correspondence: {
        prod: slash(env.GUIDE_PROD_URL_CORRESPONDENCE ?? 'https://correspondence-fwqp.onrender.com/'),
        dev: slash(env.GUIDE_DEV_URL_CORRESPONDENCE ?? 'http://127.0.0.1:4324/'),
    },
}

export const guideUrl = (id, mode = 'prod') => GUIDE_URLS[id === 'builder' ? 'main' : id][mode]

// Used by the local preview servers on each HTML response.
export function localizeGuideLinks(html) {
    if (env.GUIDES_ENV === 'prod') return html
    for (const { prod, dev } of Object.values(GUIDE_URLS)) html = html.replaceAll(`href="${prod}`, `href="${dev}`)
    return html
}
