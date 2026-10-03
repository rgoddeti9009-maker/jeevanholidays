/** Netlify Image CDN URL for an asset in /public/img */
export const cdn = (file: string, w: number) => `/.netlify/images?url=/img/${file}&w=${w}&fm=webp&q=72`
