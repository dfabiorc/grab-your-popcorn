import { useId, type ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
  /** Visually hide the heading but keep it for screen readers and the outline. */
  hideTitle?: boolean
  className?: string
}

/** A titled block in a detail page. Spacing between sections lives here. */
export function Section({ title, children, hideTitle, className = '' }: SectionProps) {
  const id = useId()
  return (
    <section aria-labelledby={id} className={`mt-14 ${className}`}>
      <h2
        id={id}
        className={
          hideTitle ? 'sr-only' : 'mb-5 font-serif text-[26px] leading-[1.2] font-medium tracking-[-0.015em]'
        }
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
