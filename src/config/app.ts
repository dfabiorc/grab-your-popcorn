/**
 * Single place to configure the app.
 *
 * LANGUAGE drives both the UI copy (see ./strings.ts) and the `language`
 * parameter sent to TMDB, so titles, overviews and genres come back translated.
 */
export const LANGUAGE = 'en-US'

export const TMDB_API_BASE = 'https://api.themoviedb.org/3'

/** Fallback used until /configuration resolves (and if it ever fails). */
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/'

/**
 * Minimum vote count for a film to appear in the "newest" feed. Sorting by
 * release date alone surfaces thousands of entries with no poster, no
 * overview and no votes; a small threshold keeps the feed useful.
 */
export const MIN_VOTE_COUNT = 20

/** TMDB never serves more than 500 pages for list endpoints. */
export const MAX_PAGES = 500

export const SITE_NAME = 'Grab Your Popcorn'
