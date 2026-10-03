import { LANGUAGE } from '../config/app'

/** Local calendar date as YYYY-MM-DD (what TMDB date filters expect). */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Parses a TMDB YYYY-MM-DD string as a local date. `new Date('2026-08-26')`
 * would be UTC midnight and show the previous day west of Greenwich.
 */
export function parseTmdbDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

const dateFormatter = new Intl.DateTimeFormat(LANGUAGE, { year: 'numeric', month: 'short', day: 'numeric' })

export function formatDate(value: string | null | undefined): string | null {
  const date = parseTmdbDate(value)
  return date ? dateFormatter.format(date) : null
}

export function releaseYear(value: string | null | undefined): string | null {
  const date = parseTmdbDate(value)
  return date ? String(date.getFullYear()) : null
}

/** 119 -> "1h 59m", 45 -> "45m". */
export function formatRuntime(minutes: number | null | undefined): string | null {
  if (!minutes || minutes <= 0) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

const scoreFormatter = new Intl.NumberFormat(LANGUAGE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const countFormatter = new Intl.NumberFormat(LANGUAGE)

/** TMDB scores are 0-10 with many decimals; show one. */
export function formatScore(score: number | null | undefined): string | null {
  if (score === null || score === undefined || score <= 0) return null
  return scoreFormatter.format(score)
}

export function formatCount(value: number): string {
  return countFormatter.format(value)
}
