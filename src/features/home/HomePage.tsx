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

  function selectGenre(id: number | undefined) {
    // Shareable (#/?genre=28) without piling up history entries.
    setParams(id ? { genre: String(id) } : {}, { replace: true, preventScrollReset: true })
  }

  return (
    <div className="wrap">
      {latest.isPending && <FeaturedMovieSkeleton />}
      {latest.isError && <ErrorState error={latest.error} onRetry={() => latest.refetch()} />}
      {featured && <FeaturedMovie movie={featured} genres={genreNames(featured.genre_ids, genres.data)} />}

      {!latest.isError && (
        <section aria-labelledby="listing-title" className="pt-12 pb-20">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id="listing-title" className="font-serif text-[34px] leading-[1.1] font-medium tracking-[-0.02em]">
              {t.home.newReleases}
            </h2>
            <p className="text-sm text-muted">{t.home.newReleasesNote}</p>
          </div>
          <GenreFilter genres={genres.data} selected={genreId} onSelect={selectGenre} />
          <NewestGrid
            genreId={genreId}
            excludeId={genreId ? undefined : featured?.id}
            onClearGenre={() => selectGenre(undefined)}
          />
        </section>
      )}
    </div>
  )
}
