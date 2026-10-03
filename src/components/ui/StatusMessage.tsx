import type { ReactNode } from 'react'
import { MissingApiKeyError } from '../../api/client'
import { t } from '../../config/strings'

interface StatusMessageProps {
  title: string
  children?: ReactNode
  action?: ReactNode
}

/** Shared layout for empty, error and not-found states: serif heading, one sentence, one action. */
export function StatusMessage({ title, children, action }: StatusMessageProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <h2 className="font-serif text-[28px] leading-tight font-medium tracking-[-0.015em]">{title}</h2>
      {children && <p className="mt-3 text-muted">{children}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  if (error instanceof MissingApiKeyError) {
    return <StatusMessage title={t.errors.missingKeyTitle}>{t.errors.missingKeyBody}</StatusMessage>
  }
  return (
    <StatusMessage
      title={t.errors.title}
      action={
        onRetry && (
          <button type="button" onClick={onRetry} className="btn-primary">
            {t.errors.retry}
          </button>
        )
      }
    >
      {t.errors.generic}
    </StatusMessage>
  )
}
