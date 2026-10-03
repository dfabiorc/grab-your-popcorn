import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { queries } from '../../api/queries'
import { ErrorState } from '../../components/ui/StatusMessage'
import { t } from '../../config/strings'
import { genreNames, parseGenreParam } from '../../lib/movies'
import { FeaturedMovie, FeaturedMovieSkeleton } from './FeaturedMovie'
import { GenreFilter } from './GenreFilter'
import { NewestGrid } from './NewestGrid'

export function HomePage() {
  const [params, setParams] = useSearchParams()
  const genreId = parseGenreParam(params.get('genre'))
  const genres = useQuery(queries.genres())

  // The featured film always comes from the unfiltered feed, so changing the
  // genre below never swaps the content above the filter. Same query key as the
  // "All" grid, so it costs no extra request.
  const latest = useInfiniteQuery(queries.newest({}))
  const featured = latest.data?.pages[0]?.results.find((m) => m.backdrop_path && m.overview)
  const hasHero = latest.isPending || Boolean(featured)

  function selectGenre(id: number | undefined) {
    // Shareable (#/?genre=28) without piling up history entries.
    setParams(id ? { genre: String(id) } : {}, { replace: true, preventScrollReset: true })
  }

  if (latest.isError) {
    return (
      <div className="wrap">
        <ErrorState error={latest.error} onRetry={() => latest.refetch()} />
      </div>
    )
  }

  return (
    <>
      {latest.isPending && <FeaturedMovieSkeleton />}
      {featured && <FeaturedMovie movie={featured} genres={genreNames(featured.genre_ids, genres.data)} />}

      {/* With a hero above, this is the sheet that slides over it while scrolling. */}
      <section aria-labelledby="listing-title" className={`bg-paper ${hasHero ? 'hero-follow' : ''}`}>
        <div className="wrap pt-14 pb-20 md:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h2
              id="listing-title"
              className="reveal-mask display-serif text-[clamp(40px,5.5vw,72px)] leading-[1] font-medium"
            >
              {t.home.newReleases}
            </h2>
            <p className="reveal pb-2 text-sm text-muted">{t.home.newReleasesNote}</p>
          </div>
          <div className="reveal">
            <GenreFilter genres={genres.data} selected={genreId} onSelect={selectGenre} />
          </div>
          <NewestGrid
            genreId={genreId}
            excludeId={genreId ? undefined : featured?.id}
            onClearGenre={() => selectGenre(undefined)}
          />
        </div>
      </section>
    </>
  )
}
