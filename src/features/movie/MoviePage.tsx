import { useParams } from 'react-router'

// Phase 1 placeholder. Built in phase 3.
export function MoviePage() {
  const { id } = useParams()
  return (
    <div className="wrap py-12">
      <h1 className="display-serif text-4xl font-medium">Movie {id}</h1>
    </div>
  )
}
