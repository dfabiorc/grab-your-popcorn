import { FilmSlateIcon, UserIcon } from '@phosphor-icons/react'
import { useCallback, useState, type ImgHTMLAttributes } from 'react'
import { useImageBase } from '../../hooks/useImageBase'
import { imageSrcSet, imageUrl, type ImageKind } from '../../lib/images'

interface TmdbImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  path: string | null | undefined
  kind: ImageKind
  /** Fallback `src` width for browsers that ignore srcset. */
  width: number
  height: number
  sizes: string
  alt: string
  /** Cap the srcset (e.g. 780 for a backdrop that is never wider than that). */
  maxWidth?: number
}

/**
 * Sized, lazy TMDB image that fades in once loaded. Width/height attributes
 * reserve the box so nothing shifts while it loads. Missing images render a
 * quiet placeholder with the same footprint.
 */
export function TmdbImage({
  path,
  kind,
  width,
  height,
  sizes,
  alt,
  maxWidth,
  className = '',
  ...rest
}: TmdbImageProps) {
  const base = useImageBase()
  const [loaded, setLoaded] = useState(false)

  // An image already in the cache (e.g. after going back) is complete at mount.
  // Show it instantly: set the attribute before paint so it never re-fades,
  // and sync state so React keeps it. Network loads still fade via onLoad.
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) {
      img.dataset.loaded = 'true'
      setLoaded(true)
    }
  }, [])

  const src = imageUrl(path, width, base, kind)
  if (!src) {
    const Icon = kind === 'profile' ? UserIcon : FilmSlateIcon
    // Same contract as <img alt="">: an empty alt means decorative, so hide it.
    const a11y = alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true }
    return (
      <div {...a11y} className={`grid place-items-center bg-line text-muted ${className}`}>
        <Icon aria-hidden="true" className="size-1/4 max-h-10 max-w-10 opacity-70" />
      </div>
    )
  }

  return (
    <img
      ref={ref}
      src={src}
      srcSet={imageSrcSet(path, kind, base, maxWidth)}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading="lazy"
      decoding="async"
      data-loaded={loaded}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={`bg-line fade-in-image ${className}`}
      {...rest}
    />
  )
}
