import { useSearchParams } from 'react-router'

// Phase 1 placeholder. Built in phase 4.
export function SearchPage() {
  const [params] = useSearchParams()
  return (
    <div className="wrap py-12">
      <h1 className="display-serif text-4xl font-medium">Results for “{params.get('q')}”</h1>
    </div>
  )
}
