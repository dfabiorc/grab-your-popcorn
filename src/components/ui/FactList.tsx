import type { ReactNode } from 'react'

export interface Fact {
  label: string
  value: ReactNode
}

/**
 * Quiet label/value band with hairlines above and below. Two columns on
 * phones (with a rule between rows), up to four in one row from `sm`.
 * The rules belong to the list, so they span the full width whatever the count.
 */
export function FactList({ facts }: { facts: Fact[] }) {
  return (
    <dl className="mt-7 grid grid-cols-2 border-y border-line sm:grid-cols-4">
      {facts.map((fact, i) => (
        <div key={fact.label} className={`py-3.5 pr-4 ${i >= 2 ? 'border-t border-line sm:border-t-0' : ''}`}>
          <dt className="text-[13px] text-muted">{fact.label}</dt>
          <dd className="mt-0.5 font-medium">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
