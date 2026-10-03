/** Same footprint as the loaded page so nothing jumps when data arrives. */
export function MoviePageSkeleton() {
  return (
    <div aria-busy="true" aria-hidden="true">
      <div className="h-[clamp(260px,38vw,460px)] skeleton" />
      <div className="relative wrap -mt-20 grid grid-cols-[minmax(0,1fr)] gap-8 pb-20 md:-mt-44 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
        <div className="aspect-[2/3] w-40 skeleton rounded-sm md:w-auto" />
        <div className="md:pt-36">
          <div className="h-4 w-16 skeleton rounded-sm" />
          <div className="mt-5 h-14 w-3/4 skeleton rounded-sm" />
          <div className="mt-4 h-5 w-1/2 skeleton rounded-sm" />
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-12 skeleton rounded-sm" />
            ))}
          </div>
          <div className="mt-9 h-32 max-w-[62ch] skeleton rounded-sm" />
        </div>
      </div>
    </div>
  )
}
