/**
 * Line-art popcorn bucket. Transparent, drawn with currentColor, so it is
 * near-black on paper and near-white in dark mode.
 */
export function LogoMark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 12.5A3.6 3.6 0 0 1 12 7.4A4.4 4.4 0 0 1 20 6.6A3.6 3.6 0 0 1 24 12.5" />
      <path d="M6.5 12.5h19l-2.15 16.1a1.6 1.6 0 0 1-1.6 1.4h-11.5a1.6 1.6 0 0 1-1.6-1.4z" />
      <path d="M12.6 12.5l.7 17.5M19.4 12.5l-.7 17.5" />
    </svg>
  )
}
