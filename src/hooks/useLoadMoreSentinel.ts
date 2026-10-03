import { useEffect, useRef } from 'react'

/**
 * Calls `onVisible` when the returned element gets near the viewport.
 * IntersectionObserver instead of scroll listeners: no work on every frame.
 * The margin starts the next request about one screen before the end.
 */
export function useLoadMoreSentinel<T extends Element>(onVisible: () => void, enabled: boolean) {
  const ref = useRef<T>(null)
  const callback = useRef(onVisible)

  useEffect(() => {
    callback.current = onVisible
  }, [onVisible])

  useEffect(() => {
    const node = ref.current
    if (!node || !enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) callback.current()
      },
      { rootMargin: '0px 0px 800px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled])

  return ref
}
