import type { MovieSummary } from '../types/tmdb'
import { MovieCard } from './MovieCard'

/** Horizontally scrolling row of posters (snaps on touch, wheel/drag on desktop). */
export function MovieRow({ movies }: { movies: MovieSummary[] }) {
  return (
    // The row slides in from the right; clipping here keeps that offset from
    // widening the page (on phones it would zoom the whole layout out).
    <div className="-mx-4 overflow-x-clip md:mx-0">
      <ul className="reveal-slide grid snap-x snap-mandatory scroll-px-4 auto-cols-[140px] grid-flow-col gap-5 overflow-x-auto px-4 pb-3 sm:auto-cols-[160px] md:scroll-px-0 md:px-0">
        {movies.map((movie) => (
          <li key={movie.id} className="snap-start">
            <MovieCard movie={movie} sizes="160px" />
          </li>
        ))}
      </ul>
    </div>
  )
}
