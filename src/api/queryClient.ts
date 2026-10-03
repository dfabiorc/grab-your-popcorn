import { QueryClient } from '@tanstack/react-query'
import { shouldRetry } from './client'

// Everything is cached in memory for the session: TMDB data changes slowly and
// re-visiting a film or going back to the home feed should not hit the API again.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
  },
})
