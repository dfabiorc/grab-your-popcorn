import { MIN_VOTE_COUNT } from '../config/app'
import { toIsoDate } from '../lib/format'
import type {
  Genre,
  ImageConfiguration,
  MovieDetails,
  MovieSummary,
  Paged,
  PersonDetails,
  SearchMultiResult,
} from '../types/tmdb'
import { tmdbGet } from './client'

export function getConfiguration(signal?: AbortSignal) {
  return tmdbGet<ImageConfiguration>('/configuration', {}, signal)
}

export async function getMovieGenres(signal?: AbortSignal) {
  const data = await tmdbGet<{ genres: Genre[] }>('/genre/movie/list', {}, signal)
  return data.genres
}

export interface DiscoverFilters {
  genreId?: number
}

/** Newest released films first, optionally narrowed to one genre. */
export function discoverNewestMovies(page: number, filters: DiscoverFilters = {}, signal?: AbortSignal) {
  return tmdbGet<Paged<MovieSummary>>(
    '/discover/movie',
    {
      page,
      sort_by: 'primary_release_date.desc',
      'primary_release_date.lte': toIsoDate(new Date()),
      'vote_count.gte': MIN_VOTE_COUNT,
      include_adult: false,
      include_video: false,
      with_genres: filters.genreId,
    },
    signal,
  )
}

export function getMovie(id: number, signal?: AbortSignal) {
  return tmdbGet<MovieDetails>(
    `/movie/${id}`,
    { append_to_response: 'credits,videos,reviews,recommendations,similar' },
    signal,
  )
}

export function getPerson(id: number, signal?: AbortSignal) {
  return tmdbGet<PersonDetails>(`/person/${id}`, { append_to_response: 'movie_credits' }, signal)
}

export function searchMulti(query: string, page: number, signal?: AbortSignal) {
  return tmdbGet<Paged<SearchMultiResult>>('/search/multi', { query, page, include_adult: false }, signal)
}
