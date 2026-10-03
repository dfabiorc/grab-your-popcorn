import { t } from '../../config/strings'
import type { Genre } from '../../types/tmdb'

interface GenreFilterProps {
  genres: Genre[] | undefined
  selected: number | undefined
  onSelect: (genreId: number | undefined) => void
}

const chip =
  'h-[34px] shrink-0 rounded-full border px-3.5 text-sm font-medium transition-[background-color,border-color,color] duration-150 [transition-timing-function:ease]'
const idle = 'border-line text-ink hover:border-muted'
const active = 'border-ink bg-ink text-paper'

/** Toggle buttons (aria-pressed); scrolls sideways on phones, wraps on desktop. */
export function GenreFilter({ genres, selected, onSelect }: GenreFilterProps) {
  if (!genres) {
    return (
      <div aria-hidden="true" className="flex gap-2 overflow-hidden py-5">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="skeleton h-[34px] w-20 shrink-0 rounded-full" />
        ))}
      </div>
    )
  }

  const options: Array<{ id: number | undefined; name: string }> = [{ id: undefined, name: t.home.allGenres }, ...genres]

  return (
    <div
      role="group"
      aria-label={t.home.genreFilterLabel}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 py-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
    >
      {options.map((genre) => {
        const isActive = genre.id === selected
        return (
          <button
            key={genre.id ?? 'all'}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(genre.id)}
            className={`${chip} ${isActive ? active : idle}`}
          >
            {genre.name}
          </button>
        )
      })}
    </div>
  )
}
