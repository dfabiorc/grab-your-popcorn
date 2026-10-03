import { afterEach, describe, expect, it, vi } from 'vitest'
import { MissingApiKeyError, TmdbError, shouldRetry, tmdbGet } from './client'
import { nextPageParam } from './queries'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('tmdbGet', () => {
  it('fails fast without an API key', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', '')
    await expect(tmdbGet('/genre/movie/list')).rejects.toBeInstanceOf(MissingApiKeyError)
  })

  it('sends key, language and non-empty params', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'test-key')
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })))
    vi.stubGlobal('fetch', fetchMock)

    await tmdbGet('/discover/movie', { page: 2, with_genres: undefined, include_adult: false })

    const url = new URL(fetchMock.mock.calls[0][0])
    expect(url.pathname).toBe('/3/discover/movie')
    expect(url.searchParams.get('api_key')).toBe('test-key')
    expect(url.searchParams.get('language')).toBe('en-US')
    expect(url.searchParams.get('page')).toBe('2')
    expect(url.searchParams.get('include_adult')).toBe('false')
    expect(url.searchParams.has('with_genres')).toBe(false)
  })

  it('surfaces TMDB status messages', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', 'test-key')
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ status_message: 'The resource could not be found.' }), { status: 404 }),
        ),
    )
    const error = await tmdbGet('/movie/0').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(TmdbError)
    expect(error).toMatchObject({ status: 404, message: 'The resource could not be found.' })
  })
})

describe('shouldRetry', () => {
  it('does not retry client errors or a missing key', () => {
    expect(shouldRetry(0, new TmdbError(404, 'nope'))).toBe(false)
    expect(shouldRetry(0, new MissingApiKeyError())).toBe(false)
  })

  it('retries rate limits and server errors twice', () => {
    expect(shouldRetry(0, new TmdbError(429, 'slow down'))).toBe(true)
    expect(shouldRetry(1, new TmdbError(503, 'down'))).toBe(true)
    expect(shouldRetry(2, new TmdbError(503, 'down'))).toBe(false)
  })
})

describe('nextPageParam', () => {
  const page = (n: number, total: number) => ({ page: n, total_pages: total, total_results: 0, results: [] })

  it('advances until the last page', () => {
    expect(nextPageParam(page(1, 3))).toBe(2)
    expect(nextPageParam(page(3, 3))).toBeUndefined()
  })

  it('stops at the TMDB 500-page cap', () => {
    expect(nextPageParam(page(500, 9000))).toBeUndefined()
  })
})
