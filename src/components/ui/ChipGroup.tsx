interface ChipOption<T> {
  value: T
  label: string
}

interface ChipGroupProps<T> {
  label: string
  options: ChipOption<T>[]
  selected: T
  onSelect: (value: T) => void
}

const base =
  'h-[34px] shrink-0 rounded-full border px-3.5 text-sm font-medium transition-[background-color,border-color,color] duration-150 [transition-timing-function:ease]'
const idle = 'border-line text-ink hover:border-muted'
const active = 'border-ink bg-ink text-paper'

/** Single-choice toggle buttons (aria-pressed). Scrolls sideways on phones, wraps on wider screens. */
export function ChipGroup<T>({ label, options, selected, onSelect }: ChipGroupProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 py-5 md:mx-0 md:flex-wrap md:px-0"
    >
      {options.map((option) => {
        const isActive = option.value === selected
        return (
          <button
            key={String(option.value ?? 'all')}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.value)}
            className={`${base} ${isActive ? active : idle}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function ChipGroupSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="flex gap-2 overflow-hidden py-5">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-[34px] w-20 shrink-0 skeleton rounded-full" />
      ))}
    </div>
  )
}
