import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { TmdbError } from '../../api/client'
import { queries } from '../../api/queries'
import { BackLink } from '../../components/BackLink'
import { MovieRow } from '../../components/MovieRow'
import { Section } from '../../components/ui/Section'
import { ErrorState, StatusMessage } from '../../components/ui/StatusMessage'
import { TmdbImage } from '../../components/ui/TmdbImage'
import { t } from '../../config/strings'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { keyCrew, pickTrailer } from '../../lib/credits'
import { releaseYear } from '../../lib/format'
import type { MovieDetails } from '../../types/tmdb'
import { CastList } from './CastList'
import { MovieFacts } from './MovieFacts'
import { MoviePageSkeleton } from './MoviePageSkeleton'
import { ReviewList } from './ReviewList'
import { TrailerPlayer } from './TrailerPlayer'

export function MoviePage() {
  const id = Number(useParams().id)
  const valid = Number.isInteger(id) && id > 0
  const query = useQuery({ ...queries.movie(id), enabled: valid })

  const movie = query.data
  const year = releaseYear(movie?.release_date)
  useDocumentTitle(movie ? (year ? `${movie.title} (${year})` : movie.title) : null)

  if (!valid || (query.error instanceof TmdbError && query.error.status === 404)) {
    return (
      <StatusMessage
        title={t.movie.notFoundTitle}
        action={
          <Link to="/" className="btn-primary">
            {t.errors.backHome}
          </Link>
        }
      >
        {t.movie.notFoundBody}
      </StatusMessage>
    )
  }
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />
  if (!movie) return <MoviePageSkeleton />

  return <MovieView movie={movie} />
}

function MovieView({ movie }: { movie: MovieDetails }) {
  const crew = keyCrew(movie.credits.crew)
  const trailer = pickTrailer(movie.videos.results)
  const related = movie.recommendations.results.length ? movie.recommendations.results : movie.similar.results

  return (
    <article>
      {/*
        Backdrop band, starting under the translucent header. While scrolling it
        drifts slower than the page and dissolves into the paper (parallax-* in
        styles/motion.css). Decorative: the poster carries the alt text.
      */}
      <div
        className="relative -mt-16 h-[clamp(360px,56vw,760px)] overflow-hidden bg-line"
        style={{ viewTransitionName: 'film-backdrop' }}
      >
        <div className="parallax-backdrop absolute inset-0">
          {movie.backdrop_path && (
            <TmdbImage
              path={movie.backdrop_path}
              kind="backdrop"
              width={1280}
              height={720}
              sizes="100vw"
              alt=""
              loading="eager"
              fetchPriority="high"
              className="size-full object-cover object-[center_30%]"
            />
          )}
        </div>
        <div aria-hidden="true" className="parallax-dim absolute inset-0 bg-paper opacity-0" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-paper md:from-40%"
        />
      </div>

      <div className="relative wrap -mt-24 grid grid-cols-[minmax(0,1fr)] gap-8 pb-20 md:-mt-56 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
        <div className="w-40 md:sticky md:top-24 md:w-auto md:self-start">
          {/* Destination of the poster that travels here from the home grid. */}
          <div
            className="aspect-[2/3] overflow-hidden rounded-sm bg-line shadow-lift"
            style={{ viewTransitionName: 'film-poster' }}
          >
            <TmdbImage
              path={movie.poster_path}
              kind="poster"
              width={500}
              height={750}
              sizes="(min-width: 1024px) 280px, (min-width: 768px) 240px, 160px"
              alt={t.movie.posterAlt(movie.title)}
              loading="eager"
              className="size-full object-cover"
            />
          </div>
        </div>

        <div className="min-w-0 md:pt-44">
          <BackLink />
          <h1 className="display-serif text-[clamp(44px,6.4vw,96px)] leading-[0.98] font-medium text-balance">
            {movie.title}
          </h1>
          {movie.tagline && <p className="mt-2.5 font-serif text-xl leading-snug text-muted italic">{movie.tagline}</p>}

          <MovieFacts movie={movie} />

          <Section title={t.movie.overview} hideTitle className="mt-9!">
            <p className="reveal max-w-[62ch] font-serif text-[19px] leading-[1.65]">
              {movie.overview || t.movie.noOverview}
            </p>
            {crew.length > 0 && (
              <dl className="reveal mt-6 flex flex-wrap gap-x-12 gap-y-3">
                {crew.map((person) => (
                  <div key={person.id}>
                    <dt className="text-[13px] text-muted">{person.jobs.join(', ')}</dt>
                    <dd className="font-medium">
                      <Link to={`/person/${person.id}`} className="underline-offset-[3px] hover:underline">
                        {person.name}
                      </Link>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </Section>

          {trailer && (
            <Section title={t.movie.trailer}>
              <div className="reveal-zoom">
                <TrailerPlayer video={trailer} />
              </div>
            </Section>
          )}

          <Section title={t.movie.cast}>
            <CastList cast={movie.credits.cast} />
          </Section>

          <Section title={t.movie.reviews}>
            <ReviewList reviews={movie.reviews} movieId={movie.id} />
          </Section>

          {related.length > 0 && (
            <Section title={t.movie.moreLikeThis}>
              <MovieRow movies={related} />
            </Section>
          )}
        </div>
      </div>
    </article>
  )
}
