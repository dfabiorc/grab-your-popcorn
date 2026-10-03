import { createHashRouter, type LoaderFunctionArgs } from 'react-router'
import { queries } from './api/queries'
import { queryClient } from './api/queryClient'
import { Header } from './components/Header'
import { Layout } from './components/Layout'
import { NotFound, RouteError } from './components/NotFound'
import { HomePage } from './features/home/HomePage'
import { isAppReady, loadMoviePage, settleWithin } from './lib/navigation'
import { parseGenreParam } from './lib/movies'

/**
 * Loaders *start* the requests so data downloads in parallel with the page's
 * code chunk. On the first load they never wait (the page shows its skeleton
 * at once). For in-app navigations to a film they wait up to 600 ms, so the
 * poster can travel straight into the finished page (see MovieCard).
 */
const MAX_WAIT_MS = 600

function prefetchHome({ request }: LoaderFunctionArgs) {
  const genreId = parseGenreParam(new URL(request.url).searchParams.get('genre'))
  void queryClient.prefetchInfiniteQuery(queries.newest({}))
  if (genreId) void queryClient.prefetchInfiniteQuery(queries.newest({ genreId }))
  void queryClient.prefetchQuery(queries.genres())
  return null
}

const validId = (value: string | undefined) => {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

async function prefetchMovie({ params }: LoaderFunctionArgs) {
  const id = validId(params.id)
  if (!id) return null
  const ready = queryClient.prefetchQuery(queries.movie(id))
  if (isAppReady()) await settleWithin(ready, MAX_WAIT_MS)
  return null
}

function prefetchPerson({ params }: LoaderFunctionArgs) {
  const id = validId(params.id)
  if (id) void queryClient.prefetchQuery(queries.person(id))
  return null
}

// Hash routing: GitHub Pages only serves files, so /movie/123 would 404 on reload.
// With #/movie/123 the server always serves index.html (see docs/DECISIONS.md).
// Home ships in the main bundle; the other pages are separate chunks.
export const router = createHashRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    // Shown for the instant before the first loader settles; matches the static shell in index.html.
    hydrateFallbackElement: <Header />,
    children: [
      { index: true, element: <HomePage />, loader: prefetchHome },
      {
        path: 'movie/:id',
        loader: prefetchMovie,
        lazy: () => loadMoviePage().then((m) => ({ Component: m.MoviePage })),
      },
      {
        path: 'person/:id',
        loader: prefetchPerson,
        lazy: () => import('./features/person/PersonPage').then((m) => ({ Component: m.PersonPage })),
      },
      {
        path: 'search',
        lazy: () => import('./features/search/SearchPage').then((m) => ({ Component: m.SearchPage })),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
