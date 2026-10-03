import { ArrowRightIcon, StarIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Link, useViewTransitionState } from 'react-router'
import { TmdbImage } from '../../components/ui/TmdbImage'
import { t } from '../../config/strings'
import { formatDate, formatScore } from '../../lib/format'
import type { MovieSummary } from '../../types/tmdb'

interface FeaturedMovieProps {
  movie: MovieSummary
  genres: string[]
}

/**
 * Full-bleed hero. Where scroll-driven animations are supported, it pins while
 * the image shrinks into a rounded card and the copy drifts up and fades; the
 * feed below then slides over it (see .hero-* in styles/motion.css).
 * Text sits on a dark scrim, so it uses fixed light colours in both themes.
 */
export function FeaturedMovie({ movie, genres }: FeaturedMovieProps) {
  const date = formatDate(movie.release_date)
  const score = formatScore(movie.vote_average)
  // While opening this film, the hero image becomes the film page's backdrop.
  const opening = useViewTransitionState(`/movie/${movie.id}`)

  return (
    <HeroFrame
      labelledBy="featured-title"
      transitionName={opening ? 'film-backdrop' : undefined}
      media={
        <TmdbImage
          path={movie.backdrop_path}
          kind="backdrop"
          width={1280}
          height={720}
          sizes="100vw"
          alt=""
          loading="eager"
          fetchPriority="high"
          className="size-full object-cover object-[center_25%]"
        />
      }
    >
      <p className="mb-3 text-sm font-medium tracking-[0.01em] text-[#F0A27C]">{t.home.featuredKicker}</p>
      <h1
        id="featured-title"
        className="max-w-[14ch] pb-1 display-serif text-[clamp(52px,9vw,132px)] leading-[0.95] font-medium text-balance"
      >
        <Link to={`/movie/${movie.id}`} viewTransition>
          {movie.title}
        </Link>
      </h1>
      <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[15px] text-[#F6F1E8]/80">
        {date && <span>{date}</span>}
        {genres.length > 0 && <span>{genres.join(', ')}</span>}
        {score && (
          <span className="inline-flex items-center gap-1 font-medium text-[#F6F1E8]">
            <StarIcon aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{t.movie.score}:</span> {score}
          </span>
        )}
      </p>
      {movie.overview && (
        <p className="mt-4 line-clamp-3 max-w-[52ch] font-serif text-lg leading-[1.55] text-[#F6F1E8]/90 md:text-xl">
          {movie.overview}
        </p>
      )}
      <Link
        to={`/movie/${movie.id}`}
        viewTransition
        className="mt-7 inline-flex h-12 button-motion items-center gap-2 rounded-full bg-[#F6F1E8] px-6 text-[15px] font-medium text-[#1F1A14]"
      >
        {t.home.viewFilm}
        <ArrowRightIcon aria-hidden="true" className="btn-arrow size-4" />
      </Link>
    </HeroFrame>
  )
}

export function FeaturedMovieSkeleton() {
  return (
    <HeroFrame media={null} busy>
      <div className="h-4 w-28 rounded-sm bg-white/15" />
      <div className="mt-5 h-[clamp(52px,9vw,132px)] w-3/5 rounded-md bg-white/15" />
      <div className="mt-6 h-4 w-2/5 rounded-sm bg-white/15" />
      <div className="mt-6 h-12 w-36 rounded-full bg-white/15" />
    </HeroFrame>
  )
}

interface HeroFrameProps {
  media: ReactNode
  transitionName?: string
  children: ReactNode
  labelledBy?: string
  busy?: boolean
}

/** Shared structure, so the skeleton and the loaded hero have the same footprint. */
function HeroFrame({ media, children, labelledBy, busy, transitionName }: HeroFrameProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      aria-busy={busy || undefined}
      aria-hidden={busy || undefined}
      // Starts under the translucent header, so the image runs to the top edge.
      className="hero-track -mt-16"
    >
      <div className="hero-stage">
        <div
          className="hero-media absolute inset-0 overflow-hidden bg-[#2a241e]"
          style={transitionName ? { viewTransitionName: transitionName } : undefined}
        >
          {media}
          {/* Legibility scrim: darker at the bottom-left, where the copy sits. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgb(18_14_10/0.88)_0%,rgb(18_14_10/0.55)_38%,rgb(18_14_10/0)_70%),linear-gradient(to_right,rgb(18_14_10/0.5),rgb(18_14_10/0)_60%)]"
          />
          {/* Extra dimming that fades in as the hero is scrolled away. */}
          <div aria-hidden="true" className="hero-scrim absolute inset-0 bg-[rgb(18_14_10/0.55)] opacity-0" />
        </div>
        <div className="hero-copy absolute inset-x-0 bottom-0 text-[#F6F1E8]">
          <div className="wrap pb-14 md:pb-20">{children}</div>
        </div>
      </div>
    </section>
  )
}
