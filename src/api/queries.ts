import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query'
import { MAX_PAGES } from '../config/app'
import type { MovieSummary, Paged } from '../types/tmdb'
import {
  discoverNewestMovies,
  getConfiguration,
  getMovie,
  getMovieGenres,
  getPerson,
  searchMulti,
  type DiscoverFilters,
} from './endpoints'

const HOUR = 60 * 60 * 1000

/** Next page number, or undefined when TMDB has nothing more to give. */
export function nextPageParam<T>(lastPage: Paged<T>): number | undefined {
  const last = Math.min(lastPage.total_pages, MAX_PAGES)
  return lastPage.page < last ? lastPage.page + 1 : undefined
}

export const queries = {
  configuration: () =>
    queryOptions({
      queryKey: ['configuration'],
      queryFn: ({ signal }) => getConfiguration(signal),
      staleTime: 24 * HOUR,
      gcTime: Infinity,
    }),

  genres: () =>
    queryOptions({
      queryKey: ['genres'],
      queryFn: ({ signal }) => getMovieGenres(signal),
      staleTime: 24 * HOUR,
      gcTime: Infinity,
    }),

  newest: (filters: DiscoverFilters) =>
    infiniteQueryOptions({
      queryKey: ['movies', 'newest', filters],
      queryFn: ({ pageParam, signal }) => discoverNewestMovies(pageParam, filters, signal),
      initialPageParam: 1,
      getNextPageParam: (lastPage: Paged<MovieSummary>) => nextPageParam(lastPage),
    }),

  movie: (id: number) =>
    queryOptions({
      queryKey: ['movie', id],
      queryFn: ({ signal }) => getMovie(id, signal),
    }),

  person: (id: number) =>
    queryOptions({
      queryKey: ['person', id],
      queryFn: ({ signal }) => getPerson(id, signal),
    }),

  search: (query: string) =>
    infiniteQueryOptions({
      queryKey: ['search', query],
      queryFn: ({ pageParam, signal }) => searchMulti(query, pageParam, signal),
      initialPageParam: 1,
      getNextPageParam: nextPageParam,
      enabled: query.trim().length > 0,
      placeholderData: keepPreviousData,
    }),
}
