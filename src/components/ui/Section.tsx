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
          hideTitle ? 'sr-only' : 'reveal-mask mb-6 display-serif text-[clamp(28px,3vw,40px)] leading-[1.1] font-medium'
        }
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
