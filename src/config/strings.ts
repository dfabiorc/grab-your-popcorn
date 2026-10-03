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
