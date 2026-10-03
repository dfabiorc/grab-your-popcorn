import { Outlet, ScrollRestoration } from 'react-router'
import { t } from '../config/strings'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        onClick={(e) => {
          // Hash routing owns location.hash, so move focus manually instead of following the anchor.
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
        className="sr-only z-30 rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t.nav.skipToContent}
      </a>
      <Header />
      {/* At least one screen tall: the footer never sits in view while a page is loading and then jumps. */}
      <main id="main" tabIndex={-1} className="min-h-dvh outline-none">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
