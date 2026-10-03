import { useEffect } from 'react'
import { SITE_NAME } from '../config/app'

/** Sets "<title> · Grab Your Popcorn" while mounted, restoring the previous title after. */
export function useDocumentTitle(title: string | null | undefined) {
  useEffect(() => {
    if (!title) return
    const previous = document.title
    document.title = `${title} · ${SITE_NAME}`
    return () => {
      document.title = previous
    }
  }, [title])
}
