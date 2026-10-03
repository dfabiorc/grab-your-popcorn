import tmdbLogo from '../assets/tmdb-logo.svg'
import { t } from '../config/strings'

/** TMDB attribution required by their API terms (logo + notice, less prominent than our brand). */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-line py-8 text-[13px] text-muted">
      <div className="wrap flex flex-wrap items-center gap-4">
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="shrink-0">
          <img src={tmdbLogo} alt={t.footer.tmdbAlt} width={123} height={16} className="h-4 w-auto" />
        </a>
        <p>{t.footer.attribution}</p>
      </div>
    </footer>
  )
}
