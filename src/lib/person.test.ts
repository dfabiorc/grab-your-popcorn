import { describe, expect, it } from 'vitest'
import type { MovieSummary, PersonDetails } from '../types/tmdb'
import { ageInYears, bioParagraphs, filmography, knownFor } from './person'

const movie = (id: number, release_date: string, vote_count = 10, poster = true): MovieSummary => ({
  id,
  title: `Film ${id}`,
  original_title: `Film ${id}`,
  overview: '',
  poster_path: poster ? `/p${id}.jpg` : null,
  backdrop_path: null,
  release_date,
  genre_ids: [],
  vote_average: 7,
  vote_count,
  popularity: 1,
})

const person = (overrides: Partial<PersonDetails>): PersonDetails => ({
  id: 1,
  name: 'Someone',
  biography: '',
  birthday: null,
  deathday: null,
  place_of_birth: null,
  known_for_department: 'Acting',
  profile_path: null,
  movie_credits: { cast: [], crew: [] },
  ...overrides,
})

describe('knownFor', () => {
  it('ranks acting credits by votes and skips self appearances and missing posters', () => {
    const p = person({
      movie_credits: {
        cast: [
          { ...movie(1, '2001-01-01', 50), character: 'Hero', credit_id: 'a' },
          { ...movie(2, '2002-01-01', 900), character: 'Himself', credit_id: 'b' },
          { ...movie(3, '2003-01-01', 300), character: 'Villain', credit_id: 'c' },
          { ...movie(4, '2004-01-01', 999, false), character: 'Cameo', credit_id: 'd' },
        ],
        crew: [],
      },
    })
    expect(knownFor(p).map((m) => m.id)).toEqual([3, 1])
  })

  it('uses the crew department for directors and dedupes multi-job films', () => {
    const p = person({
      known_for_department: 'Directing',
      movie_credits: {
        cast: [{ ...movie(9, '2000-01-01', 5000), character: 'Himself', credit_id: 'x' }],
        crew: [
          { ...movie(1, '1979-05-25', 9000), job: 'Director', department: 'Directing', credit_id: 'a' },
          { ...movie(1, '1979-05-25', 9000), job: 'Director', department: 'Directing', credit_id: 'a2' },
          { ...movie(2, '2000-05-01', 8000), job: 'Producer', department: 'Production', credit_id: 'b' },
        ],
      },
    })
    expect(knownFor(p).map((m) => m.id)).toEqual([1])
  })
})

describe('filmography', () => {
  it('groups by department, merges roles and sorts newest first with undated on top', () => {
    const p = person({
      known_for_department: 'Directing',
      movie_credits: {
        cast: [{ ...movie(5, '1990-01-01'), character: 'Cameo', credit_id: 'c1' }],
        crew: [
          { ...movie(1, '1979-05-25'), job: 'Director', department: 'Directing', credit_id: 'a' },
          { ...movie(2, '2000-05-01'), job: 'Director', department: 'Directing', credit_id: 'b' },
          { ...movie(3, ''), job: 'Director', department: 'Directing', credit_id: 'c' },
          { ...movie(2, '2000-05-01'), job: 'Producer', department: 'Production', credit_id: 'd' },
          { ...movie(4, '2010-01-01'), job: 'Producer', department: 'Production', credit_id: 'e' },
          { ...movie(4, '2010-01-01'), job: 'Executive Producer', department: 'Production', credit_id: 'f' },
        ],
      },
    })
    const groups = filmography(p)
    expect([...groups.keys()]).toEqual(['Directing', 'Production', 'Acting'])
    expect(groups.get('Directing')!.map((e) => e.movie.id)).toEqual([3, 2, 1])
    expect(groups.get('Production')!.find((e) => e.movie.id === 4)!.roles).toEqual(['Producer', 'Executive Producer'])
    expect(groups.get('Acting')![0].roles).toEqual(['Cameo'])
  })
})

describe('ageInYears', () => {
  it('counts whole years and handles the day before a birthday', () => {
    expect(ageInYears('1997-06-26', new Date(2026, 5, 26))).toBe(29)
    expect(ageInYears('1997-06-26', new Date(2026, 5, 25))).toBe(28)
    expect(ageInYears(null)).toBeNull()
  })
})

describe('bioParagraphs', () => {
  it('turns non-breaking spaces into normal ones so text can wrap', () => {
    expect(bioParagraphs('An\u00a0English\u00a0filmmaker.')).toEqual(['An English filmmaker.'])
  })

  it('splits paragraphs and drops empty ones', () => {
    expect(bioParagraphs('One.\n\nTwo\nlines.\n\n\n')).toEqual(['One.', 'Two lines.'])
  })
})
