import { ArrowLeftIcon } from '@phosphor-icons/react'
import { Link, useLocation, useNavigate } from 'react-router'
import { t } from '../config/strings'

/**
 * Goes back in history when the user came from inside the app (so the home
 * feed keeps its scroll and filter), or to home when they landed here
 * directly from a shared link.
 */
export function BackLink() {
  const navigate = useNavigate()
  const location = useLocation()
  const hasHistory = location.key !== 'default'

  return (
    <Link
      to="/"
      onClick={(e) => {
        if (!hasHistory || e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        navigate(-1)
      }}
      className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
    >
      <ArrowLeftIcon aria-hidden="true" className="size-3.5" />
      {t.movie.back}
    </Link>
  )
}
