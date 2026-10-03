import { TMDB_IMAGE_BASE } from '../config/app'

export type ImageKind = 'poster' | 'backdrop' | 'profile'

interface ImageSize {
  /** Path segment on the CDN, e.g. "w342" or "h632". */
  token: string
  /** Rendered width in pixels, for the srcset `w` descriptor. */
  width: number
}

const w = (width: number): ImageSize => ({ token: `w${width}`, width })

/**
 * Sizes available on the TMDB CDN for each kind (from /configuration).
 * Profiles jump from w185 to h632, a height-based size (~421px wide at 2:3).
 * "original" is excluded on purpose: it can be several megabytes.
 */
export const IMAGE_SIZES: Record<ImageKind, ImageSize[]> = {
  poster: [w(92), w(154), w(185), w(342), w(500), w(780)],
  backdrop: [w(300), w(780), w(1280)],
  profile: [w(45), w(185), { token: 'h632', width: 421 }],
}

/** Smallest CDN size at least `width` wide (or the largest available). */
function sizeFor(kind: ImageKind, width: number): ImageSize {
  const sizes = IMAGE_SIZES[kind]
  return sizes.find((s) => s.width >= width) ?? sizes[sizes.length - 1]
}

export function imageUrl(
  path: string | null | undefined,
  width: number,
  base = TMDB_IMAGE_BASE,
  kind: ImageKind = 'poster',
): string | null {
  if (!path) return null
  return `${base}${sizeFor(kind, width).token}${path}`
}

/** A width-descriptor srcset so the browser picks the right size for `sizes`. */
export function imageSrcSet(
  path: string | null | undefined,
  kind: ImageKind,
  base = TMDB_IMAGE_BASE,
  maxWidth = Infinity,
): string | undefined {
  if (!path) return undefined
  return IMAGE_SIZES[kind]
    .filter((s) => s.width <= maxWidth)
    .map((s) => `${base}${s.token}${path} ${s.width}w`)
    .join(', ')
}
