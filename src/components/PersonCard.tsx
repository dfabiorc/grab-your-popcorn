import { Link } from 'react-router'
import { t } from '../config/strings'
import type { SearchPersonResult } from '../types/tmdb'
import { TmdbImage } from './ui/TmdbImage'

export function PersonCard({ person }: { person: SearchPersonResult }) {
  const department = t.person.departments[person.known_for_department] ?? person.known_for_department
  const knownFor = person.known_for
    .map((k) => k.title ?? k.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(', ')

  return (
    <Link to={`/person/${person.id}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden rounded-sm bg-line">
        <TmdbImage
          path={person.profile_path}
          kind="profile"
          width={185}
          height={231}
          sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 45vw"
          alt=""
          className="size-full poster-zoom object-cover object-top"
        />
      </div>
      <strong className="mt-2.5 block leading-tight font-medium underline-offset-[3px] group-hover:underline">
        {person.name}
      </strong>
      <span className="block text-sm text-muted">
        <span className="sr-only">, </span>
        {department}
        {knownFor && <span className="line-clamp-1">{knownFor}</span>}
      </span>
    </Link>
  )
}
