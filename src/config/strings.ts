import { LANGUAGE } from './app'

const en = {
  tagline: 'Find your next film',
  nav: {
    home: 'Home',
    searchLabel: 'Search movies and people',
    searchPlaceholder: 'Search movies or people',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    skipToContent: 'Skip to content',
  },
  home: {
    featuredKicker: 'Latest release',
    viewFilm: 'View film',
    newReleases: 'New releases',
    newReleasesNote: 'Newest first, updated daily',
    genreFilterLabel: 'Filter by genre',
    allGenres: 'All',
    loadMore: 'Load more films',
    loadingMore: 'Loading more films…',
    endOfList: 'You have reached the end of the list.',
    emptyTitle: 'No films here yet',
    emptyBody: 'There are no recent releases in this genre. Try another one.',
    showAll: 'Show all genres',
    shownCount: (n: number) => `${n} films shown`,
  },
  movie: {
    back: 'Back',
    posterAlt: (title: string) => `Poster for ${title}`,
    released: 'Released',
    runtime: 'Runtime',
    genres: 'Genres',
    score: 'TMDB score',
    outOfTen: '/ 10',
    votes: (n: string) => `${n} votes`,
    notRated: 'Not rated yet',
    overview: 'Overview',
    noOverview: 'No synopsis available yet.',
    trailer: 'Trailer',
    playTrailer: (name: string) => `Play ${name}`,
    cast: 'Cast',
    as: 'as',
    showAllCast: (n: number) => `Show all ${n}`,
    showLessCast: 'Show fewer',
    noCast: 'No cast information yet.',
    reviews: 'Reviews',
    noReviews: 'No reviews on TMDB yet.',
    readMore: 'Read more',
    readLess: 'Show less',
    readOnTmdb: 'Read on TMDB',
    allReviews: (n: number) => `All ${n} reviews on TMDB`,
    ratedBy: (rating: number) => `${rating} / 10`,
    moreLikeThis: 'More like this',
    notFoundTitle: 'Film not found',
    notFoundBody: 'This film does not exist on TMDB, or it was removed.',
  },
  footer: {
    attribution:
      'This product uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.',
    tmdbAlt: 'The Movie Database (TMDB)',
  },
  errors: {
    title: 'Something went wrong',
    generic: 'We could not load this right now. Please try again in a moment.',
    retry: 'Try again',
    notFoundTitle: 'Page not found',
    notFoundBody: 'The page you were looking for does not exist or has moved.',
    backHome: 'Back to home',
    missingKeyTitle: 'TMDB API key missing',
    missingKeyBody:
      'Add VITE_TMDB_API_KEY to a .env.local file (see .env.example) and restart the dev server.',
  },
} as const

export type Strings = typeof en

// Add more locales here (e.g. `es`) and they are picked up from LANGUAGE.
const catalog: Record<string, Strings> = { en }

export const t: Strings = catalog[LANGUAGE.split('-')[0]] ?? en
