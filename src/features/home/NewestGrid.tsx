import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { queries } from '../../api/queries'
import { MovieCard, MovieCardSkeleton } from '../../components/MovieCard'
import { ErrorState, StatusMessage } from '../../components/ui/StatusMessage'
import { t } from '../../config/strings'
import { useLoadMoreSentinel } from '../../hooks/useLoadMoreSentinel'
import { uniqueById } from '../../lib/movies'

const GRID = 'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-9 lg:grid-cols-6'

interface NewestGridProps {
  genreId: number | undefined
  /** Film already shown as the featured one, so it is not repeated. */
  excludeId?: number
  onClearGenre: () => void
}

export function NewestGrid({ genreId, excludeId, onClearGenre }: NewestGridProps) {
  const query = useInfiniteQuery(queries.newest({ genreId }))
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query

  const movies = useMemo(
    () => uniqueById(query.data?.pages.map((p) => p.results) ?? []).filter((m) => m.id !== excludeId),
    [query.data, excludeId],
  )

  const sentinel = useLoadMoreSentinel<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, query.isSuccess && hasNextPage)

  if (query.isPending) {
    return (
      <div className={GRID} aria-busy="true">
        {Array.from({ length: 12 }, (_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />

  if (movies.length === 0) {
    return (
      <StatusMessage
        title={t.home.emptyTitle}
        action={
          <button type="button" onClick={onClearGenre} className="btn-primary">
            {t.home.showAll}
          </button>
        }
      >
        {t.home.emptyBody}
      </StatusMessage>
    )
  }

  return (
    <>
      <ul className={GRID}>
        {movies.map((movie) => (
          <li key={movie.id}>
            <MovieCard movie={movie} />
          </li>
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 6 }, (_, i) => (
            <li key={`sk-${i}`}>
              <MovieCardSkeleton />
            </li>
          ))}
      </ul>

      <div ref={sentinel} className="mt-10 flex flex-col items-center gap-3 text-sm text-muted">
        {/* Polite live region so screen readers hear progress without losing their place. */}
        <p role="status" aria-live="polite" className={isFetchingNextPage ? '' : 'sr-only'}>
          {isFetchingNextPage ? t.home.loadingMore : t.home.shownCount(movies.length)}
        </p>
        {query.isFetchNextPageError && (
          <button type="button" onClick={() => fetchNextPage()} className="btn-primary">
            {t.errors.retry}
          </button>
        )}
        {hasNextPage && !isFetchingNextPage && !query.isFetchNextPageError && (
          // Keyboard and assistive-tech fallback for the automatic loading.
          <button
            type="button"
            onClick={() => fetchNextPage()}
            className="btn-secondary"
          >
            {t.home.loadMore}
          </button>
        )}
        {!hasNextPage && <p>{t.home.endOfList}</p>}
      </div>
    </>
  )
}
