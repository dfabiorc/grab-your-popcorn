import { describe, expect, it } from 'vitest'
import type { CrewCredit, Video } from '../types/tmdb'
import { keyCrew, pickTrailer, reviewParagraphs } from './credits'

const crew = (id: number, name: string, job: string): CrewCredit => ({
  id,
  name,
  job,
  department: '',
  profile_path: null,
  credit_id: `${id}-${job}`,
})

describe('keyCrew', () => {
  it('lists the director first and merges jobs per person', () => {
    const result = keyCrew([
      crew(1, 'Novelist', 'Novel'),
      crew(2, 'Nolan', 'Writer'),
      crew(3, 'AD Person', 'First Assistant Director'),
      crew(2, 'Nolan', 'Director'),
      crew(4, 'Scribe', 'Screenplay'),
    ])
    expect(result).toEqual([
      { id: 2, name: 'Nolan', jobs: ['Director', 'Writer'] },
      { id: 4, name: 'Scribe', jobs: ['Screenplay'] },
      { id: 1, name: 'Novelist', jobs: ['Novel'] },
    ])
  })

  it('returns nothing when there are no key jobs', () => {
    expect(keyCrew([crew(9, 'Gaffer', 'Gaffer')])).toEqual([])
  })
})

const video = (key: string, type: string, official: boolean, site = 'YouTube'): Video => ({
  id: key,
  key,
  name: key,
  site,
  type,
  official,
  published_at: '',
})

describe('pickTrailer', () => {
  it('prefers an official trailer', () => {
    expect(pickTrailer([video('fan', 'Trailer', false), video('off', 'Trailer', true)])?.key).toBe('off')
  })

  it('falls back to any trailer, then to a teaser', () => {
    expect(pickTrailer([video('t', 'Teaser', true), video('fan', 'Trailer', false)])?.key).toBe('fan')
    expect(pickTrailer([video('clip', 'Clip', true), video('t', 'Teaser', false)])?.key).toBe('t')
  })

  it('ignores clips, featurettes and non-YouTube videos', () => {
    expect(pickTrailer([video('c', 'Clip', true), video('v', 'Trailer', true, 'Vimeo')])).toBeNull()
  })
})

describe('reviewParagraphs', () => {
  it('splits on blank lines and joins soft line breaks', () => {
    expect(reviewParagraphs('First line\r\ncontinues.\r\n\r\n\r\nSecond paragraph.')).toEqual([
      'First line continues.',
      'Second paragraph.',
    ])
  })

  it('normalises non-breaking spaces', () => {
    expect(reviewParagraphs('Great\u00a0film.')).toEqual(['Great film.'])
  })

  it('strips markdown emphasis, links and html tags', () => {
    expect(reviewParagraphs('A **bold** and _quiet_ [link](https://x.y) <em>take</em>.')).toEqual([
      'A bold and quiet link take.',
    ])
  })
})
