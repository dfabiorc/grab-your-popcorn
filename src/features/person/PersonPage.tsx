import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { TmdbError } from '../../api/client'
import { queries } from '../../api/queries'
import { BackLink } from '../../components/BackLink'
import { MovieRow } from '../../components/MovieRow'
import { ExpandableProse } from '../../components/ui/ExpandableProse'
import { Section } from '../../components/ui/Section'
import { ErrorState, StatusMessage } from '../../components/ui/StatusMessage'
import { TmdbImage } from '../../components/ui/TmdbImage'
import { t } from '../../config/strings'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatDate, parseTmdbDate } from '../../lib/format'
import { ageInYears, bioParagraphs, knownFor } from '../../lib/person'
import type { PersonDetails } from '../../types/tmdb'
import { Filmography } from './Filmography'

export function PersonPage() {
  const id = Number(useParams().id)
  const valid = Number.isInteger(id) && id > 0
  const query = useQuery({ ...queries.person(id), enabled: valid })
  useDocumentTitle(query.data?.name)

  if (!valid || (query.error instanceof TmdbError && query.error.status === 404)) {
    return (
      <StatusMessage
        title={t.person.notFoundTitle}
        action={
          <Link to="/" className="btn-primary">
            {t.errors.backHome}
          </Link>
        }
      >
        {t.person.notFoundBody}
      </StatusMessage>
    )
  }
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />
  if (!query.data) return <PersonPageSkeleton />

  return <PersonView person={query.data} />
}

function PersonView({ person }: { person: PersonDetails }) {
  const born = formatDate(person.birthday)
  const died = formatDate(person.deathday)
  const deathDate = parseTmdbDate(person.deathday) ?? undefined
  const age = ageInYears(person.birthday, deathDate)
  const famous = knownFor(person)
  const bio = bioParagraphs(person.biography)

  // Age goes next to the birth date while alive, next to the death date otherwise.
  const withAge = (date: string) => (age === null ? date : `${date} (${t.person.age(age)})`)
  const facts: Array<{ label: string; value: string }> = []
  if (person.known_for_department) {
    const department = person.known_for_department
    facts.push({ label: t.person.knownForDepartment, value: t.person.departments[department] ?? department })
  }
  if (born) facts.push({ label: t.person.born, value: died ? born : withAge(born) })
  if (person.place_of_birth) facts.push({ label: t.person.placeOfBirth, value: person.place_of_birth })
  if (died) facts.push({ label: t.person.died, value: withAge(died) })

  return (
    <article className="wrap grid grid-cols-[minmax(0,1fr)] gap-8 pt-8 pb-20 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12 md:pt-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
      <div className="w-40 md:sticky md:top-24 md:w-auto md:self-start">
        <div className="aspect-[2/3] overflow-hidden rounded-sm bg-line shadow-lift">
          <TmdbImage
            path={person.profile_path}
            kind="profile"
            width={185}
            height={278}
            sizes="(min-width: 1024px) 280px, (min-width: 768px) 240px, 160px"
            alt={t.person.photoAlt(person.name)}
            loading="eager"
            fetchPriority="high"
            className="size-full object-cover object-top"
          />
        </div>
      </div>

      <div className="min-w-0">
        <BackLink />
        <h1 className="display-serif text-[clamp(38px,5.2vw,64px)] leading-[1.02] font-medium">{person.name}</h1>

        <dl className="mt-7 grid grid-cols-2 border-t border-line sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="border-b border-line py-3.5 pr-4">
              <dt className="text-[13px] text-muted">{fact.label}</dt>
              <dd className="mt-0.5 font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <Section title={t.person.biography} hideTitle className="mt-9!">
          <div className="max-w-[62ch]">
            {bio.length ? (
              <ExpandableProse
                paragraphs={bio}
                threshold={700}
                clampClass="line-clamp-6"
                className="font-serif text-[19px] leading-[1.65]"
                moreLabel={t.person.readMore}
                lessLabel={t.person.readLess}
              />
            ) : (
              <p className="text-muted">{t.person.noBiography}</p>
            )}
          </div>
        </Section>

        {famous.length > 0 && (
          <Section title={t.person.knownFor}>
            <MovieRow movies={famous} />
          </Section>
        )}

        <Section title={t.person.filmography}>
          <Filmography person={person} />
        </Section>
      </div>
    </article>
  )
}

function PersonPageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-hidden="true"
      className="wrap grid grid-cols-[minmax(0,1fr)] gap-8 pt-8 pb-20 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12 md:pt-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14"
    >
      <div className="aspect-[2/3] w-40 skeleton rounded-sm md:w-auto" />
      <div>
        <div className="h-4 w-16 skeleton rounded-sm" />
        <div className="mt-5 h-14 w-2/3 skeleton rounded-sm" />
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-12 skeleton rounded-sm" />
          ))}
        </div>
        <div className="mt-9 h-40 max-w-[62ch] skeleton rounded-sm" />
      </div>
    </div>
  )
}
