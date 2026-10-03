import type { Genre } from '../types/tmdb'

/**
 * Flattens paginated results and drops repeats. TMDB lists are live, so an
 * item can shift from page N to page N+1 between requests and show up twice.
 */
export function uniqueById<T extends { id: number }>(pages: T[][]): T[] {
  const seen = new Set<number>()
  const out: T[] = []
  for (const page of pages) {
    for (const item of page) {
      if (!seen.has(item.id)) {
        seen.add(item.id)
        out.push(item)
      }
    }
  }
  return out
}

export function genreNames(ids: number[], genres: Genre[] | undefined): string[] {
  if (!genres) return []
  const byId = new Map(genres.map((g) => [g.id, g.name]))
  return ids.map((id) => byId.get(id)).filter((name): name is string => Boolean(name))
}

/** Parses the ?genre= search param; anything that is not a positive integer means "all". */
export function parseGenreParam(value: string | null): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined
  const id = Number(value)
  return id > 0 ? id : undefined
}
