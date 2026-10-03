import type { CrewCredit, Video } from '../types/tmdb'

export interface KeyPerson {
  id: number
  name: string
  jobs: string[]
}

// Order defines how they are listed: director first, then the writing credits.
const KEY_JOBS = ['Director', 'Screenplay', 'Writer', 'Story', 'Novel', 'Book', 'Characters'] as const

/**
 * Director and writers, one entry per person with all their key jobs
 * ("Christopher Nolan: Director, Writer"). Assistant directors, script
 * supervisors and the like are left out.
 */
export function keyCrew(crew: CrewCredit[], limit = 6): KeyPerson[] {
  const byPerson = new Map<number, KeyPerson>()
  const rank = (job: string) => KEY_JOBS.indexOf(job as (typeof KEY_JOBS)[number])

  const relevant = crew.filter((c) => rank(c.job) >= 0).sort((a, b) => rank(a.job) - rank(b.job))
  for (const credit of relevant) {
    const person = byPerson.get(credit.id)
    if (person) {
      if (!person.jobs.includes(credit.job)) person.jobs.push(credit.job)
    } else {
      byPerson.set(credit.id, { id: credit.id, name: credit.name, jobs: [credit.job] })
    }
  }
  return [...byPerson.values()].slice(0, limit)
}

/**
 * Best YouTube video to show as "the trailer": official trailer, then any
 * trailer, then an official teaser, then any teaser. Clips and featurettes
 * are not trailers, so a film with only those gets none.
 */
export function pickTrailer(videos: Video[]): Video | null {
  const youtube = videos.filter((v) => v.site === 'YouTube')
  const preferences: Array<(v: Video) => boolean> = [
    (v) => v.type === 'Trailer' && v.official,
    (v) => v.type === 'Trailer',
    (v) => v.type === 'Teaser' && v.official,
    (v) => v.type === 'Teaser',
  ]
  for (const matches of preferences) {
    const found = youtube.find(matches)
    if (found) return found
  }
  return null
}

/**
 * TMDB reviews are user-written markdown-ish text with \r\n line breaks.
 * We render them as plain paragraphs: links keep their text, emphasis
 * markers and stray HTML tags are dropped.
 */
export function reviewParagraphs(content: string): string[] {
  return content
    .replace(/\u00a0/g, ' ') // non-breaking spaces would stop lines from wrapping
    .replace(/\r\n?/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(\*\*|__|\*|_)(\S[^*_]*?\S|\S)\1/g, '$2')
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}
