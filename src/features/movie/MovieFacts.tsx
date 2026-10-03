import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { t } from '../../config/strings'
import { formatCount, formatDate, formatRuntime, formatScore } from '../../lib/format'
import type { MovieDetails } from '../../types/tmdb'

/** Four quiet facts in a hairline band: release, runtime, genres, score. */
export function MovieFacts({ movie }: { movie: MovieDetails }) {
  const score = formatScore(movie.vote_average)

  const genres: ReactNode = movie.genres.length
    ? movie.genres.map((g, i) => (
        <span key={g.id}>
          {i > 0 && ', '}
          <Link to={`/?genre=${g.id}`} className="underline-offset-[3px] hover:underline">
            {g.name}
          </Link>
        </span>
      ))
    : '-'

  const rating: ReactNode = score ? (
    <>
      {score} <span className="text-[13px] font-normal text-muted">{t.movie.outOfTen}</span>
      <span className="block text-[13px] font-normal text-muted">{t.movie.votes(formatCount(movie.vote_count))}</span>
    </>
  ) : (
    <span className="font-normal text-muted">{t.movie.notRated}</span>
  )

  const facts: Array<{ label: string; value: ReactNode }> = [
    { label: t.movie.released, value: formatDate(movie.release_date) ?? '-' },
    { label: t.movie.runtime, value: formatRuntime(movie.runtime) ?? '-' },
    { label: t.movie.genres, value: genres },
    { label: t.movie.score, value: rating },
  ]

  return (
    <dl className="mt-7 grid grid-cols-2 border-t border-line sm:grid-cols-4">
      {facts.map(({ label, value }) => (
        <div key={label} className="border-b border-line py-3.5 pr-4">
          <dt className="text-[13px] text-muted">{label}</dt>
          <dd className="mt-0.5 font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
