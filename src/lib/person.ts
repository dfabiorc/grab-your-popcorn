import type { MovieSummary, PersonDetails } from '../types/tmdb'
import { parseTmdbDate } from './format'

export const ACTING = 'Acting'

export interface FilmographyEntry {
  movie: MovieSummary
  /** Character(s) for acting credits, job(s) for crew credits. */
  roles: string[]
}

// Talk shows, award ceremonies and making-ofs where someone "plays" themself.
const SELF = /^(self|himself|herself|themselves)\b/i

function isSelf(character: string | undefined) {
  return Boolean(character && SELF.test(character.trim()))
}

/** The credits that match what the person is known for (cast for actors, that crew department otherwise). */
function primaryCredits(person: PersonDetails): MovieSummary[] {
  const { cast, crew } = person.movie_credits
  if (person.known_for_department === ACTING || crew.length === 0) {
    return cast.filter((c) => !isSelf(c.character))
  }
  const inDepartment = crew.filter((c) => c.department === person.known_for_department)
  return inDepartment.length ? inDepartment : cast.filter((c) => !isSelf(c.character))
}

/** Most-voted films in their main line of work, without duplicates. */
export function knownFor(person: PersonDetails, limit = 8): MovieSummary[] {
  const seen = new Set<number>()
  return primaryCredits(person)
    .filter((m) => m.poster_path && m.vote_count > 0)
    .sort((a, b) => b.vote_count - a.vote_count)
    .filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)))
    .slice(0, limit)
}

/**
 * Credits grouped by department ("Acting", "Directing", "Writing"…), one row
 * per film with every role merged, newest first. Films without a date are
 * usually announced projects, so they go on top.
 */
export function filmography(person: PersonDetails): Map<string, FilmographyEntry[]> {
  const groups = new Map<string, Map<number, FilmographyEntry>>()

  const add = (department: string, movie: MovieSummary, role: string) => {
    const group = groups.get(department) ?? new Map<number, FilmographyEntry>()
    groups.set(department, group)
    const entry = group.get(movie.id)
    if (entry) {
      if (role && !entry.roles.includes(role)) entry.roles.push(role)
    } else {
      group.set(movie.id, { movie, roles: role ? [role] : [] })
    }
  }

  for (const credit of person.movie_credits.cast) add(ACTING, credit, credit.character)
  for (const credit of person.movie_credits.crew) add(credit.department, credit, credit.job)

  const sortTime = (e: FilmographyEntry) => parseTmdbDate(e.movie.release_date)?.getTime() ?? Infinity
  const sorted = [...groups.entries()].map(
    ([department, entries]) => [department, [...entries.values()].sort((a, b) => sortTime(b) - sortTime(a))] as const,
  )

  // Their main department first, then the rest by number of credits.
  sorted.sort(([a, ea], [b, eb]) => {
    if (a === person.known_for_department) return -1
    if (b === person.known_for_department) return 1
    return eb.length - ea.length
  })
  return new Map(sorted)
}

/** Age in whole years at `on` (today by default), or at death. */
export function ageInYears(birthday: string | null, on: Date = new Date()): number | null {
  const birth = parseTmdbDate(birthday)
  if (!birth) return null
  let age = on.getFullYear() - birth.getFullYear()
  const beforeBirthday =
    on.getMonth() < birth.getMonth() || (on.getMonth() === birth.getMonth() && on.getDate() < birth.getDate())
  if (beforeBirthday) age -= 1
  return age
}

export function bioParagraphs(biography: string): string[] {
  return biography
    .replace(/\u00a0/g, ' ') // TMDB uses non-breaking spaces that stop lines from wrapping
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}
