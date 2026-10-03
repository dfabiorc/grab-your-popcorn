import { LANGUAGE, TMDB_API_BASE } from '../config/app'

export class TmdbError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'TmdbError'
    this.status = status
  }
}

export class MissingApiKeyError extends Error {
  constructor() {
    super('VITE_TMDB_API_KEY is not set')
    this.name = 'MissingApiKeyError'
  }
}

type Params = Record<string, string | number | boolean | undefined>

/**
 * Minimal GET client for TMDB v3.
 *
 * The key travels as the `api_key` query parameter instead of an
 * Authorization header: a custom header would force a CORS preflight on every
 * request. Being a static site, the key is visible to anyone either way
 * (see docs/DECISIONS.md).
 */
export async function tmdbGet<T>(path: string, params: Params = {}, signal?: AbortSignal): Promise<T> {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  if (!apiKey) throw new MissingApiKeyError()

  const url = new URL(TMDB_API_BASE + path)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('language', LANGUAGE)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }

  const response = await fetch(url, { signal })
  if (!response.ok) {
    let message = response.statusText
    try {
      const body = (await response.json()) as { status_message?: string }
      message = body.status_message ?? message
    } catch {
      // Non-JSON error body; keep the status text.
    }
    throw new TmdbError(response.status, message)
  }
  return (await response.json()) as T
}

/** Client errors (bad id, bad key) will not fix themselves; do not retry them. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof MissingApiKeyError) return false
  if (error instanceof TmdbError && error.status >= 400 && error.status < 500 && error.status !== 429) {
    return false
  }
  return failureCount < 2
}
