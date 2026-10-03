import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { t } from '../../config/strings'
import { releaseYear } from '../../lib/format'
import { filmography } from '../../lib/person'
import type { PersonDetails } from '../../types/tmdb'

const INITIAL = 25

const departmentLabel = (d: string) => t.person.departments[d] ?? d

/** Credits by department, newest first, as a quiet year / title / role list. */
export function Filmography({ person }: { person: PersonDetails }) {
  const groups = useMemo(() => filmography(person), [person])
  const departments = [...groups.keys()]
  const [department, setDepartment] = useState(departments[0])
  const [expanded, setExpanded] = useState(false)

  if (departments.length === 0) return <p className="text-muted">{t.person.noCredits}</p>

  const entries = groups.get(department) ?? []
  const visible = expanded ? entries : entries.slice(0, INITIAL)

  return (
    <>
      {departments.length > 1 && (
        <div className="-mt-5">
          <ChipGroup
            label={t.person.departmentFilterLabel}
            options={departments.map((d) => ({ value: d, label: `${departmentLabel(d)} ${groups.get(d)!.length}` }))}
            selected={department}
            onSelect={(d) => {
              setDepartment(d)
              setExpanded(false)
            }}
          />
        </div>
      )}

      <ol id="filmography-list" className="max-w-[760px] border-t border-line">
        {visible.map((entry, i) => {
          const year = releaseYear(entry.movie.release_date) ?? t.person.tba
          const prevYear = i > 0 ? (releaseYear(visible[i - 1].movie.release_date) ?? t.person.tba) : null
          const showYear = year !== prevYear
          return (
            <li
              key={entry.movie.id}
              className={`grid grid-cols-[56px_minmax(0,1fr)] gap-4 py-3 ${showYear && i > 0 ? 'border-t border-line' : ''}`}
            >
              {/* The cell stays in the grid; only repeated years are hidden (but still read out). */}
              <span className="text-sm text-muted tabular-nums">
                <span className={showYear ? '' : 'sr-only'}>{year}</span>
              </span>
              <span>
                <Link
                  to={`/movie/${entry.movie.id}`}
                  className="font-serif text-[17px] leading-snug font-medium underline-offset-[3px] hover:underline"
                >
                  {entry.movie.title}
                </Link>
                {entry.roles.length > 0 && (
                  <span className="block text-sm text-muted">
                    <span className="sr-only">, </span>
                    {entry.roles.join(', ')}
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ol>

      {entries.length > INITIAL && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="filmography-list"
          onClick={() => setExpanded((v) => !v)}
          className="mt-6 btn-secondary"
        >
          {expanded ? t.person.showFewerCredits : t.person.showAllCredits(entries.length)}
        </button>
      )}
    </>
  )
}
