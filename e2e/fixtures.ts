/**
 * Synthetic TMDB responses for the e2e suite. Every title and person here is
 * made up: tests stay deterministic, need no API key, and no TMDB data is
 * stored in the repository.
 */
import type { Page, Route } from '@playwright/test'

export const GENRES = [
  { id: 28, name: 'Action' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 99, name: 'Documentary' },
]

const PAGE_SIZE = 20
const TOTAL_PAGES = 3

export const PERSON_ID = 2001
export const PERSON_NAME = 'Ada Marlowe'
export const MISSING_ID = 404404

function movie(id: number, overrides: Record<string, unknown> = {}) {
  // Newer ids are newer films: id 1000 is the latest release.
  const day = new Date(Date.UTC(2026, 8, 30) - (id - 1000) * 86_400_000)
  return {
    id,
    title: `Paper Moon ${id}`,
    original_title: `Paper Moon ${id}`,
    overview: `A quiet story about film number ${id}, told in three acts.`,
    poster_path: `/poster-${id}.jpg`,
    backdrop_path: `/backdrop-${id}.jpg`,
    release_date: day.toISOString().slice(0, 10),
    genre_ids: [id % 2 ? 18 : 28],
    vote_average: 6 + (id % 30) / 10,
    vote_count: 50 + id,
    popularity: 10,
    ...overrides,
  }
}

export const FEATURED_TITLE = 'Paper Moon 1000'

function discover(page: number, genre: string | null) {
  if (genre === '99') return { page: 1, results: [], total_pages: 1, total_results: 0 }
  if (genre === '27') {
    const results = [movie(1900, { title: 'Night Garden', genre_ids: [27] }), movie(1901, { genre_ids: [27] })]
    return { page: 1, results, total_pages: 1, total_results: results.length }
  }
  const start = 1000 + (page - 1) * PAGE_SIZE
  const results = Array.from({ length: PAGE_SIZE }, (_, i) => movie(start + i))
  return { page, results, total_pages: TOTAL_PAGES, total_results: TOTAL_PAGES * PAGE_SIZE }
}

function movieDetails(id: number) {
  const base = movie(id)
  return {
    ...base,
    genres: [GENRES[1]],
    runtime: 119,
    tagline: 'Every frame a letter.',
    status: 'Released',
    imdb_id: null,
    credits: {
      cast: Array.from({ length: 14 }, (_, i) => ({
        id: i === 0 ? PERSON_ID : 3000 + i,
        name: i === 0 ? PERSON_NAME : `Actor ${i}`,
        character: `Role ${i}`,
        profile_path: i % 4 === 3 ? null : `/profile-${i}.jpg`,
        order: i,
        credit_id: `cast-${id}-${i}`,
      })),
      crew: [
        { id: 4001, name: 'Iris Vane', job: 'Director', department: 'Directing', profile_path: null, credit_id: 'd' },
        { id: 4001, name: 'Iris Vane', job: 'Screenplay', department: 'Writing', profile_path: null, credit_id: 's' },
        { id: 4002, name: 'Tom Ash', job: 'Gaffer', department: 'Lighting', profile_path: null, credit_id: 'g' },
      ],
    },
    videos: {
      results: [
        {
          id: 'v1',
          key: 'abc123xyz00',
          name: 'Official Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: true,
          published_at: '',
        },
      ],
    },
    reviews: {
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [
        {
          id: 'r1',
          author: 'Film Club',
          author_details: { rating: 8, avatar_path: null, username: 'filmclub' },
          content: `A **patient** film.\r\n\r\n${'Long thoughts about light and paper. '.repeat(20)}`,
          created_at: '2026-09-01T10:00:00.000Z',
          url: 'https://www.themoviedb.org/review/r1',
        },
      ],
    },
    recommendations: { page: 1, total_pages: 1, total_results: 3, results: [movie(1010), movie(1011), movie(1012)] },
    similar: { page: 1, total_pages: 1, total_results: 0, results: [] },
  }
}

function person(id: number) {
  const credit = (movieId: number, extra: Record<string, unknown>) => ({ ...movie(movieId), ...extra })
  return {
    id,
    name: PERSON_NAME,
    biography: 'Ada Marlowe is a fictional actor used in tests.\n\nShe has never existed.',
    birthday: '1990-04-12',
    deathday: null,
    place_of_birth: 'Nowhere, Test County',
    known_for_department: 'Acting',
    profile_path: '/ada.jpg',
    movie_credits: {
      cast: [
        credit(1000, { character: 'Lead', credit_id: 'c1' }),
        credit(1005, { character: 'Herself', credit_id: 'c2' }),
        credit(1020, { character: 'Friend', credit_id: 'c3' }),
        credit(1030, { character: 'Pilot', credit_id: 'c4', release_date: '' }),
      ],
      crew: [credit(1040, { job: 'Director', department: 'Directing', credit_id: 'k1' })],
    },
  }
}

function search(query: string) {
  if (query.toLowerCase().startsWith('ada')) {
    const results = [
      {
        media_type: 'person',
        id: PERSON_ID,
        name: PERSON_NAME,
        profile_path: '/ada.jpg',
        known_for_department: 'Acting',
        popularity: 5,
        known_for: [{ id: 1000, title: FEATURED_TITLE, media_type: 'movie' }],
      },
      { ...movie(1050, { title: 'Ada and the Lighthouse' }), media_type: 'movie' },
      { media_type: 'tv', id: 77, name: 'A TV show that must not appear' },
    ]
    return { page: 1, results, total_pages: 1, total_results: results.length }
  }
  return { page: 1, results: [], total_pages: 1, total_results: 0 }
}

const IMAGE = `<svg xmlns="http://www.w3.org/2000/svg" width="342" height="513"><rect width="100%" height="100%" fill="#8a7f72"/></svg>`

/**
 * Serves every TMDB, image CDN and YouTube request from the fixtures above.
 * A TMDB endpoint without a fixture answers 501, which the browser logs as a
 * console error, and that fails the test (see e2e/test.ts).
 */
export async function mockTmdb(page: Page) {
  const json = (route: Route, body: unknown, status = 200) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

  await page.route('https://api.themoviedb.org/3/**', (route) => {
    const url = new URL(route.request().url())
    const path = url.pathname.replace(/^\/3/, '')
    const params = url.searchParams

    if (path === '/configuration') return json(route, { images: { secure_base_url: 'https://image.tmdb.org/t/p/' } })
    if (path === '/genre/movie/list') return json(route, { genres: GENRES })
    if (path === '/discover/movie')
      return json(route, discover(Number(params.get('page') ?? 1), params.get('with_genres')))
    if (path === '/search/multi') return json(route, search(params.get('query') ?? ''))

    const movieMatch = /^\/movie\/(\d+)$/.exec(path)
    if (movieMatch) {
      const id = Number(movieMatch[1])
      return id === MISSING_ID
        ? json(route, { status_message: 'The resource you requested could not be found.' }, 404)
        : json(route, movieDetails(id))
    }
    const personMatch = /^\/person\/(\d+)$/.exec(path)
    if (personMatch) {
      const id = Number(personMatch[1])
      return id === MISSING_ID
        ? json(route, { status_message: 'The resource you requested could not be found.' }, 404)
        : json(route, person(id))
    }
    return json(route, { status_message: `No fixture for ${path}` }, 501)
  })

  await page.route(/https:\/\/(image\.tmdb\.org|i\.ytimg\.com)\/.*/, (route) =>
    route.fulfill({ status: 200, contentType: 'image/svg+xml', body: IMAGE }),
  )
  await page.route(/https:\/\/www\.youtube-nocookie\.com\/.*/, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>player</title>' }),
  )
}
