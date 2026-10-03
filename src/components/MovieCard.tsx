import { Link, useViewTransitionState } from 'react-router'
import { releaseYear } from '../lib/format'
import { prefetchMoviePage } from '../lib/navigation'
import type { MovieSummary } from '../types/tmdb'
import { TmdbImage } from './ui/TmdbImage'

interface MovieCardProps {
  movie: Pick<MovieSummary, 'id' | 'title' | 'poster_path' | 'release_date'>
  /** Optional second line under the title (defaults to the release year). */
  subtitle?: string | null
  sizes?: string
  /**
   * Let the poster travel into the film page when opened. Off for cards shown
   * on a film page itself, whose own poster already owns the transition name.
   */
  morph?: boolean
}

export function MovieCard({
  movie,
  subtitle,
  sizes = '(min-width: 1280px) 185px, (min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw',
  morph = false,
}: MovieCardProps) {
  const to = `/movie/${movie.id}`
  // Only the card being opened gets the shared name, and only during the transition.
  const opening = useViewTransitionState(to)
  const meta = subtitle ?? releaseYear(movie.release_date)
  const warmUp = () => prefetchMoviePage(movie.id)

  return (
    <Link
      to={to}
      viewTransition
      className="group block"
      onPointerEnter={warmUp}
      onPointerDown={warmUp}
      onFocus={warmUp}
    >
      <div
        className="aspect-[2/3] overflow-hidden rounded-sm bg-line shadow-soft"
        style={morph && opening ? { viewTransitionName: 'film-poster' } : undefined}
      >
        <TmdbImage
          path={movie.poster_path}
          kind="poster"
          width={342}
          height={513}
          sizes={sizes}
          alt=""
          className="size-full poster-zoom object-cover"
        />
      </div>
      <h3 className="mt-3 font-serif text-[17px] leading-[1.25] font-medium tracking-[-0.005em] decoration-1 underline-offset-[3px] group-hover:underline">
        {movie.title}
      </h3>
      {meta && <p className="mt-0.5 text-[13px] text-muted">{meta}</p>}
    </Link>
  )
}

export function MovieCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-[2/3] skeleton rounded-sm" />
      <div className="mt-3 h-4 w-3/4 skeleton rounded-sm" />
      <div className="mt-2 h-3 w-1/4 skeleton rounded-sm" />
    </div>
  )
}
