import { ChipGroup, ChipGroupSkeleton } from '../../components/ui/ChipGroup'
import { t } from '../../config/strings'
import type { Genre } from '../../types/tmdb'

interface GenreFilterProps {
  genres: Genre[] | undefined
  selected: number | undefined
  onSelect: (genreId: number | undefined) => void
}

export function GenreFilter({ genres, selected, onSelect }: GenreFilterProps) {
  if (!genres) return <ChipGroupSkeleton />
  return (
    <ChipGroup
      label={t.home.genreFilterLabel}
      options={[{ value: undefined, label: t.home.allGenres }, ...genres.map((g) => ({ value: g.id, label: g.name }))]}
      selected={selected}
      onSelect={onSelect}
    />
  )
}
