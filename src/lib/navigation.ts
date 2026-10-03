import { queries } from '../api/queries'
import { queryClient } from '../api/queryClient'

/**
 * True once the first page has rendered. Loaders use it to tell the initial
 * load (never wait: render the skeleton as soon as possible) from in-app
 * navigations (wait briefly for data, so the page transition can morph into
 * the finished page instead of a skeleton).
 */
let appReady = false

export function markAppReady() {
  appReady = true
}

export function isAppReady() {
  return appReady
}

/** Resolves when `promise` settles or after `ms`, whichever comes first. */
export function settleWithin(promise: Promise<unknown>, ms: number): Promise<void> {
  return Promise.race([promise.then(() => undefined), new Promise<void>((resolve) => setTimeout(resolve, ms))])
}

const loadMoviePage = () => import('../features/movie/MoviePage')

/** Warm up a film page on hover / touch start: its data and its code chunk. */
export function prefetchMoviePage(id: number) {
  void queryClient.prefetchQuery(queries.movie(id))
  void loadMoviePage()
}

export { loadMoviePage }
