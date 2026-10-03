import { createHashRouter } from 'react-router'
import { Layout } from './components/Layout'
import { NotFound, RouteError } from './components/NotFound'
import { HomePage } from './features/home/HomePage'
import { MoviePage } from './features/movie/MoviePage'
import { PersonPage } from './features/person/PersonPage'
import { SearchPage } from './features/search/SearchPage'

// Hash routing: GitHub Pages only serves files, so /movie/123 would 404 on reload.
// With #/movie/123 the server always serves index.html (see docs/DECISIONS.md).
export const router = createHashRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movie/:id', element: <MoviePage /> },
      { path: 'person/:id', element: <PersonPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
