import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { queries } from '../../api/queries'
import { MovieCard, MovieCardSkeleton } from '../../components/MovieCard'
import { PersonCard } from '../../components/PersonCard'
import { Section } from '../../components/ui/Section'
import { ErrorState, StatusMessage } from '../../components/ui/StatusMessage'
import { t } from '../../config/strings'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { uniqueById } from '../../lib/movies'
import type { SearchMovieResult, SearchPersonResult } from '../../types/tmdb'

const GRID = 'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6'

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const urlQuery = params.get('q') ?? ''
  const [input, setInput] = useState(urlQuery)
  const query = useDebouncedValue(input.trim(), 300)

  // Keep the URL shareable (#/search?q=nolan) without a history entry per keystroke.
  useEffect(() => {
    if (query !== urlQuery.trim()) setParams(query ? { q: query } : {}, { replace: true })
  }, [query, urlQuery, setParams])

  useDocumentTitle(query ? t.search.pageTitle(query) : t.search.title)

  return (
    <div className="wrap pt-10 pb-20 md:pt-14">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-[720px]">
        <h1 className="display-serif text-[clamp(36px,4.6vw,56px)] leading-[1.05] font-medium">
          <label htmlFor="search-input">{t.search.title}</label>
        </h1>
        <div className="mt-5 flex h-14 items-center gap-3 rounded-full border border-line bg-surface px-5 text-muted focus-within:border-ink focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
          <MagnifyingGlassIcon aria-hidden="true" className="size-5 shrink-0" />
          <input
            id="search-input"
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.search.placeholder}
            autoFocus={!urlQuery}
            autoComplete="off"
            spellCheck={false}
            className="w-full min-w-0 bg-transparent text-lg text-ink outline-none placeholder:text-muted"
          />
        </div>
      </form>

      {query ? (
        <SearchResults query={query} typing={input.trim() !== query} />
      ) : (
        <StatusMessage title={t.search.promptTitle}>{t.search.promptBody}</StatusMessage>
      )}
    </div>
  )
}

function SearchResults({ query, typing }: { query: string; typing: boolean }) {
  const search = useInfiniteQuery(queries.search(query))

  const { people, films } = useMemo(() => {
    const all = uniqueById(search.data?.pages.map((p) => p.results) ?? [])
    return {
      people: all.filter((r): r is SearchPersonResult => r.media_type === 'person'),
      films: all.filter((r): r is SearchMovieResult => r.media_type === 'movie'),
    }
  }, [search.data])

  if (search.isError) return <ErrorState error={search.error} onRetry={() => search.refetch()} />

  if (search.isPending) {
    return (
      <div className={`${GRID} mt-12`} aria-busy="true">
        {Array.from({ length: 12 }, (_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const busy = typing || search.isFetching
  const status = busy ? t.search.searching : t.search.resultsCount(films.length, people.length)

  if (!busy && people.length === 0 && films.length === 0) {
    return (
      <>
        <p role="status" className="sr-only">
          {t.search.noResultsTitle}
        </p>
        <StatusMessage title={t.search.noResultsTitle}>{t.search.noResultsBody(query)}</StatusMessage>
      </>
    )
  }

  return (
    <div>
      <p role="status" aria-live="polite" className="mt-4 text-sm text-muted">
        {status}
      </p>

      {people.length > 0 && (
        <Section title={t.search.people} className="mt-10!">
          <ul className={GRID}>
            {people.map((person) => (
              <li key={person.id}>
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {films.length > 0 && (
        <Section title={t.search.films}>
          <ul className={GRID}>
            {films.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {search.hasNextPage && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => search.fetchNextPage()}
            disabled={search.isFetchingNextPage}
            className="btn-secondary disabled:opacity-60"
          >
            {search.isFetchingNextPage ? t.search.searching : t.search.loadMore}
          </button>
        </div>
      )}
    </div>
  )
}
