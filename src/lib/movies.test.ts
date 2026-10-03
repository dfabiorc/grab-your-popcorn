import { describe, expect, it } from 'vitest'
import { genreNames, parseGenreParam, uniqueById } from './movies'

describe('uniqueById', () => {
  it('flattens pages and keeps the first occurrence', () => {
    const pages = [
      [{ id: 1, v: 'a' }, { id: 2, v: 'b' }],
      [{ id: 2, v: 'b2' }, { id: 3, v: 'c' }],
    ]
    expect(uniqueById(pages)).toEqual([
      { id: 1, v: 'a' },
      { id: 2, v: 'b' },
      { id: 3, v: 'c' },
    ])
  })
})

describe('genreNames', () => {
  const genres = [
    { id: 28, name: 'Action' },
    { id: 18, name: 'Drama' },
  ]

  it('maps ids to names in order and skips unknown ids', () => {
    expect(genreNames([18, 999, 28], genres)).toEqual(['Drama', 'Action'])
  })

  it('is empty while genres are loading', () => {
    expect(genreNames([18], undefined)).toEqual([])
  })
})

describe('parseGenreParam', () => {
  it.each([
    ['28', 28],
    [null, undefined],
    ['', undefined],
    ['0', undefined],
    ['abc', undefined],
    ['-3', undefined],
    ['1.5', undefined],
  ])('%s -> %s', (input, expected) => {
    expect(parseGenreParam(input)).toBe(expected)
  })
})
