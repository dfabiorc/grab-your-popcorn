import { describe, expect, it } from 'vitest'
import { formatRuntime, formatScore, parseTmdbDate, releaseYear, toIsoDate } from './format'

describe('toIsoDate', () => {
  it('uses the local calendar date with zero padding', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('parseTmdbDate', () => {
  it('parses as a local date, not UTC', () => {
    const date = parseTmdbDate('2026-08-26')!
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 7, 26])
  })

  it('returns null for empty or malformed values', () => {
    expect(parseTmdbDate('')).toBeNull()
    expect(parseTmdbDate(null)).toBeNull()
    expect(parseTmdbDate('2026-8-1')).toBeNull()
  })
})

describe('releaseYear', () => {
  it('extracts the year or null', () => {
    expect(releaseYear('1999-12-31')).toBe('1999')
    expect(releaseYear('')).toBeNull()
  })
})

describe('formatRuntime', () => {
  it.each([
    [119, '1h 59m'],
    [45, '45m'],
    [120, '2h'],
    [0, null],
    [null, null],
  ])('%s -> %s', (minutes, expected) => {
    expect(formatRuntime(minutes)).toBe(expected)
  })
})

describe('formatScore', () => {
  it('keeps one decimal and hides empty scores', () => {
    expect(formatScore(6.649)).toBe('6.6')
    expect(formatScore(7)).toBe('7.0')
    expect(formatScore(0)).toBeNull()
  })
})
