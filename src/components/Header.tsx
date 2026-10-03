import { MagnifyingGlassIcon, MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { SITE_NAME } from '../config/app'
import { t } from '../config/strings'
import { useTheme } from '../lib/theme'
import { LogoMark } from './Logo'

export function Header() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const [query, setQuery] = useState('')

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const q = query.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${SITE_NAME}, ${t.nav.home}`}>
          <LogoMark />
          <span className="hidden font-serif text-xl font-semibold tracking-[-0.01em] whitespace-nowrap sm:inline">
            {SITE_NAME}
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <form role="search" onSubmit={onSubmit} className="min-w-0 flex-1 sm:max-w-72 sm:flex-none">
            <label className="flex h-[38px] items-center gap-2 rounded-full border border-line bg-surface px-3 text-muted focus-within:border-ink focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
              <MagnifyingGlassIcon aria-hidden="true" className="size-4 shrink-0" />
              <span className="sr-only">{t.nav.searchLabel}</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
            </label>
          </form>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? t.nav.themeToLight : t.nav.themeToDark}
            className="grid size-[38px] shrink-0 place-items-center rounded-full border border-line bg-surface text-ink"
          >
            {theme === 'dark' ? <SunIcon className="size-[18px]" /> : <MoonIcon className="size-[18px]" />}
          </button>
        </div>
      </div>
    </header>
  )
}
