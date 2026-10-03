/** Same footprint as the loaded page so nothing jumps when data arrives. */
export function MoviePageSkeleton() {
  return (
    <div aria-busy="true" aria-hidden="true">
      <div className="skeleton h-[clamp(260px,38vw,460px)]" />
      <div className="wrap relative -mt-20 grid grid-cols-[minmax(0,1fr)] gap-8 pb-20 md:-mt-44 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
        <div className="skeleton aspect-[2/3] w-40 rounded-sm md:w-auto" />
        <div className="md:pt-36">
          <div className="skeleton h-4 w-16 rounded-sm" />
          <div className="skeleton mt-5 h-14 w-3/4 rounded-sm" />
          <div className="skeleton mt-4 h-5 w-1/2 rounded-sm" />
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton h-12 rounded-sm" />
            ))}
          </div>
          <div className="skeleton mt-9 h-32 max-w-[62ch] rounded-sm" />
        </div>
      </div>
    </div>
  )
}
