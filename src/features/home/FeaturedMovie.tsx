import { ArrowRightIcon, StarIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { TmdbImage } from '../../components/ui/TmdbImage'
import { t } from '../../config/strings'
import { formatDate, formatScore } from '../../lib/format'
import type { MovieSummary } from '../../types/tmdb'

interface FeaturedMovieProps {
  movie: MovieSummary
  genres: string[]
}

export function FeaturedMovie({ movie, genres }: FeaturedMovieProps) {
  const date = formatDate(movie.release_date)
  const score = formatScore(movie.vote_average)

  return (
    <section
      aria-labelledby="featured-title"
      className="grid gap-7 border-b border-line pt-8 pb-12 lg:grid-cols-[1.65fr_1fr] lg:items-end lg:gap-12 lg:pt-12 lg:pb-14"
    >
      <Link
        to={`/movie/${movie.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="block aspect-video overflow-hidden rounded-md bg-line shadow-soft"
      >
        <TmdbImage
          path={movie.backdrop_path}
          kind="backdrop"
          width={1280}
          height={720}
          sizes="(min-width: 1280px) 740px, (min-width: 1024px) 58vw, 100vw"
          alt=""
          loading="eager"
          fetchPriority="high"
          className="size-full object-cover"
        />
      </Link>

      <div>
        <p className="mb-2.5 text-[13px] font-medium text-accent">{t.home.featuredKicker}</p>
        <h1 id="featured-title" className="display-serif text-[clamp(40px,5vw,64px)] leading-[1.02] font-medium">
          <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
        </h1>
        <p className="mt-4 mb-4 flex flex-wrap gap-x-[18px] gap-y-1.5 text-sm text-muted">
          {date && <span>{date}</span>}
          {genres.length > 0 && <span>{genres.join(', ')}</span>}
          {score && (
            <span className="inline-flex items-center gap-1 font-medium text-ink">
              <StarIcon aria-hidden="true" className="size-3.5" />
              <span className="sr-only">{t.movie.score}:</span> {score}
            </span>
          )}
        </p>
        {movie.overview && (
          <p className="line-clamp-4 max-w-[46ch] font-serif text-lg leading-[1.55]">{movie.overview}</p>
        )}
        <Link to={`/movie/${movie.id}`} className="mt-6 btn-primary">
          {t.home.viewFilm}
          <ArrowRightIcon aria-hidden="true" className="btn-arrow size-4" />
        </Link>
      </div>
    </section>
  )
}

export function FeaturedMovieSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-7 border-b border-line pt-8 pb-12 lg:grid-cols-[1.65fr_1fr] lg:items-end lg:gap-12 lg:pt-12 lg:pb-14"
    >
      <div className="aspect-video skeleton rounded-md" />
      <div>
        <div className="h-3 w-24 skeleton rounded-sm" />
        <div className="mt-4 h-14 w-4/5 skeleton rounded-sm" />
        <div className="mt-5 h-3 w-3/5 skeleton rounded-sm" />
        <div className="mt-6 h-20 w-full skeleton rounded-sm" />
        <div className="mt-6 h-11 w-32 skeleton rounded-full" />
      </div>
    </div>
  )
}
