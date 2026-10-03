import { useEffect, useState } from 'react'
import { useNavigation } from 'react-router'

/**
 * A hairline under the header while a navigation waits for data. It only
 * appears after 150 ms, so instant navigations (cached data) show nothing.
 */
export function NavigationProgress() {
  const loading = useNavigation().state === 'loading'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!loading) return
    const id = setTimeout(() => setVisible(true), 150)
    return () => {
      clearTimeout(id)
      setVisible(false)
    }
  }, [loading])

  if (!loading || !visible) return null
  return (
    <div role="progressbar" aria-label="Loading" className="fixed inset-x-0 top-0 z-30 h-0.5 overflow-hidden">
      <div className="nav-progress h-full w-1/3 bg-accent" />
    </div>
  )
}
