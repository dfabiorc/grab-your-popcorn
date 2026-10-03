// Subset of the TMDB v3 response shapes the app actually reads.
// https://developer.themoviedb.org/reference

export interface Paged<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface ImageConfiguration {
  images: {
    secure_base_url: string
    backdrop_sizes: string[]
    poster_sizes: string[]
    profile_sizes: string[]
    still_sizes: string[]
  }
}

export interface MovieSummary {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string // YYYY-MM-DD, may be ""
  genre_ids: number[]
  vote_average: number
  vote_count: number
  popularity: number
}

export interface CastCredit {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
  credit_id: string
}

export interface CrewCredit {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
  credit_id: string
}

export interface Video {
  id: string
  key: string
  name: string
  site: string // "YouTube" | "Vimeo"
  type: string // "Trailer" | "Teaser" | "Clip" | ...
  official: boolean
  published_at: string
}

export interface Review {
  id: string
  author: string
  author_details: { rating: number | null; avatar_path: string | null; username: string }
  content: string
  created_at: string
  url: string
}

export interface MovieDetails extends Omit<MovieSummary, 'genre_ids'> {
  genres: Genre[]
  runtime: number | null
  tagline: string | null
  status: string
  imdb_id: string | null
  credits: { cast: CastCredit[]; crew: CrewCredit[] }
  videos: { results: Video[] }
  reviews: Paged<Review>
  similar: Paged<MovieSummary>
}

export interface PersonMovieCast extends MovieSummary {
  character: string
  credit_id: string
}

export interface PersonMovieCrew extends MovieSummary {
  job: string
  department: string
  credit_id: string
}

export interface PersonDetails {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  known_for_department: string
  profile_path: string | null
  movie_credits: { cast: PersonMovieCast[]; crew: PersonMovieCrew[] }
}

export interface SearchMovieResult extends MovieSummary {
  media_type: 'movie'
}

export interface SearchPersonResult {
  media_type: 'person'
  id: number
  name: string
  profile_path: string | null
  known_for_department: string
  popularity: number
  known_for: Array<{ id: number; title?: string; name?: string; media_type: string }>
}

export interface SearchTvResult {
  media_type: 'tv'
  id: number
}

export type SearchMultiResult = SearchMovieResult | SearchPersonResult | SearchTvResult
