import { useParams } from 'react-router'

// Phase 1 placeholder. Built in phase 4.
export function PersonPage() {
  const { id } = useParams()
  return (
    <div className="wrap py-12">
      <h1 className="display-serif text-4xl font-medium">Person {id}</h1>
    </div>
  )
}
