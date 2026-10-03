import { useQuery } from '@tanstack/react-query'
import { queries } from '../../api/queries'
import { ErrorState } from '../../components/ui/StatusMessage'
import { t } from '../../config/strings'

// Phase 1 placeholder: proves the data layer end to end. Replaced in phase 2.
export function HomePage() {
  const genres = useQuery(queries.genres())

  if (genres.isError) return <ErrorState error={genres.error} onRetry={() => genres.refetch()} />

  return (
    <div className="wrap py-12">
      <h1 className="display-serif text-5xl font-medium">{t.tagline}</h1>
      <p className="mt-4 text-muted">
        {genres.isPending ? 'Loading genres…' : `${genres.data.length} genres available.`}
      </p>
    </div>
  )
}
