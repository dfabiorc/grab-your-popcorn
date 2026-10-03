import { useId, useState, type ReactNode } from 'react'

interface ExpandableProseProps {
  paragraphs: string[]
  /** Collapse only when the text is longer than this many characters. */
  threshold?: number
  /** Tailwind line-clamp class used while collapsed. */
  clampClass?: string
  className?: string
  moreLabel: string
  lessLabel: string
  /** Extra controls rendered next to the toggle (e.g. a link to the source). */
  actions?: ReactNode
}

/** Serif paragraphs clamped to a few lines, with an accessible Read more / Show less toggle. */
export function ExpandableProse({
  paragraphs,
  threshold = 480,
  clampClass = 'line-clamp-5',
  className = 'font-serif text-[17px] leading-[1.6]',
  moreLabel,
  lessLabel,
  actions,
}: ExpandableProseProps) {
  const id = useId()
  const [expanded, setExpanded] = useState(false)
  const isLong = paragraphs.join(' ').length > threshold

  return (
    <>
      <div id={id} className={`space-y-3 ${className} ${isLong && !expanded ? clampClass : ''}`}>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {(isLong || actions) && (
        <div className="mt-3 flex gap-5 text-sm">
          {isLong && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={id}
              onClick={() => setExpanded((v) => !v)}
              className="font-medium underline-offset-[3px] hover:underline"
            >
              {expanded ? lessLabel : moreLabel}
            </button>
          )}
          {actions}
        </div>
      )}
    </>
  )
}
