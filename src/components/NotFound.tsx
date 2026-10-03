import { Link, isRouteErrorResponse, useRouteError } from 'react-router'
import { t } from '../config/strings'
import { StatusMessage } from './ui/StatusMessage'

export function NotFound() {
  return (
    <StatusMessage
      title={t.errors.notFoundTitle}
      action={
        <Link to="/" className="btn-primary">
          {t.errors.backHome}
        </Link>
      }
    >
      {t.errors.notFoundBody}
    </StatusMessage>
  )
}

/** Route-level error boundary: unknown routes render NotFound, crashes render a generic message. */
export function RouteError() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />
  return (
    <StatusMessage
      title={t.errors.title}
      action={
        <Link to="/" className="btn-primary">
          {t.errors.backHome}
        </Link>
      }
    >
      {t.errors.generic}
    </StatusMessage>
  )
}
