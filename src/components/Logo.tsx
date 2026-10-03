/** Striped popcorn bucket. Colours come from theme tokens, so it adapts to dark mode. */
export function LogoMark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="11" cy="9" r="4.2" fill="var(--pop)" />
      <circle cx="16.5" cy="7" r="4.6" fill="var(--pop)" />
      <circle cx="21.5" cy="9.5" r="4" fill="var(--pop)" />
      <path
        d="M6.5 11.5h19l-2.2 17a1.6 1.6 0 0 1-1.6 1.4H10.3a1.6 1.6 0 0 1-1.6-1.4z"
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M12 11.5l.9 18.4M20 11.5l-.9 18.4" stroke="var(--accent)" strokeWidth="2.6" />
    </svg>
  )
}
