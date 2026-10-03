import { useState } from 'react'
import { Link } from 'react-router'
import { TmdbImage } from '../../components/ui/TmdbImage'
import { t } from '../../config/strings'
import type { CastCredit } from '../../types/tmdb'

const INITIAL = 12

export function CastList({ cast }: { cast: CastCredit[] }) {
  const [expanded, setExpanded] = useState(false)
  if (cast.length === 0) return <p className="text-muted">{t.movie.noCast}</p>

  const visible = expanded ? cast : cast.slice(0, INITIAL)
  return (
    <>
      <ul id="cast-list" className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {visible.map((person) => (
          <li key={person.credit_id}>
            <Link to={`/person/${person.id}`} className="group block">
              <div className="aspect-[4/5] overflow-hidden rounded-sm bg-line">
                <TmdbImage
                  path={person.profile_path}
                  kind="profile"
                  width={185}
                  height={231}
                  sizes="(min-width: 1280px) 130px, (min-width: 640px) 25vw, 45vw"
                  alt=""
                  className="poster-zoom size-full object-cover object-top"
                />
              </div>
              <strong className="mt-2.5 block leading-tight font-medium underline-offset-[3px] group-hover:underline">
                {person.name}
              </strong>
              {person.character && (
                <span className="text-sm text-muted">
                  <span className="sr-only">, {t.movie.as} </span>
                  {person.character}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {cast.length > INITIAL && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="cast-list"
          onClick={() => setExpanded((v) => !v)}
          className="btn-secondary mt-7"
        >
          {expanded ? t.movie.showLessCast : t.movie.showAllCast(cast.length)}
        </button>
      )}
    </>
  )
}
