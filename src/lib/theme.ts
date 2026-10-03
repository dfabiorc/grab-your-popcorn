import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'gyp-theme' // also read by the inline script in index.html
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

function currentTheme(): Theme {
  const explicit = document.documentElement.dataset.theme
  if (explicit === 'light' || explicit === 'dark') return explicit
  return darkQuery().matches ? 'dark' : 'light'
}

function subscribe(onChange: () => void) {
  const query = darkQuery()
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  query.addEventListener('change', onChange)
  return () => {
    observer.disconnect()
    query.removeEventListener('change', onChange)
  }
}

/** Follows the system theme until the user picks one; the choice is remembered. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => 'light' as Theme)

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  }, [])

  return { theme, toggle }
}
