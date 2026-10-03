import { TMDB_IMAGE_BASE } from '../config/app'

export type ImageKind = 'poster' | 'backdrop' | 'profile'

/**
 * Widths available on the TMDB CDN for each image kind (from /configuration).
 * "original" is excluded on purpose: it can be several megabytes.
 */
export const IMAGE_WIDTHS: Record<ImageKind, number[]> = {
  poster: [92, 154, 185, 342, 500, 780],
  backdrop: [300, 780, 1280],
  profile: [45, 185],
}

export function imageUrl(path: string | null | undefined, width: number, base = TMDB_IMAGE_BASE): string | null {
  if (!path) return null
  return `${base}w${width}${path}`
}

/** A width-descriptor srcset so the browser picks the right size for `sizes`. */
export function imageSrcSet(
  path: string | null | undefined,
  kind: ImageKind,
  base = TMDB_IMAGE_BASE,
  maxWidth = Infinity,
): string | undefined {
  if (!path) return undefined
  return IMAGE_WIDTHS[kind]
    .filter((w) => w <= maxWidth)
    .map((w) => `${base}w${w}${path} ${w}w`)
    .join(', ')
}
