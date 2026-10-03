import { ArrowSquareOutIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { t } from '../../config/strings'
import { reviewParagraphs } from '../../lib/credits'
import { formatDate } from '../../lib/format'
import type { Paged, Review } from '../../types/tmdb'

const SHOWN = 3
const LONG = 480 // characters; shorter reviews are shown in full

export function ReviewList({ reviews, movieId }: { reviews: Paged<Review>; movieId: number }) {
  if (reviews.results.length === 0) return <p className="text-muted">{t.movie.noReviews}</p>

  return (
    <div className="max-w-[760px]">
      {reviews.results.slice(0, SHOWN).map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
      {reviews.total_results > SHOWN && (
        <a
          href={`https://www.themoviedb.org/movie/${movieId}/reviews`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-[3px] hover:underline"
        >
          {t.movie.allReviews(reviews.total_results)}
          <ArrowSquareOutIcon aria-hidden="true" className="size-4" />
        </a>
      )}
    </div>
  )
}

function ReviewItem({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false)
  const paragraphs = useMemo(() => reviewParagraphs(review.content), [review.content])
  const isLong = review.content.length > LONG
  const rating = review.author_details.rating
  const bodyId = `review-${review.id}`

  return (
    <article className="border-t border-line py-6">
      <header className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 text-sm text-muted">
        <span>
          <strong className="font-medium text-ink">{review.author}</strong>
          {formatDate(review.created_at.slice(0, 10)) && <> · {formatDate(review.created_at.slice(0, 10))}</>}
        </span>
        {rating !== null && <span>{t.movie.ratedBy(rating)}</span>}
      </header>
      <div
        id={bodyId}
        className={`space-y-3 font-serif text-[17px] leading-[1.6] ${isLong && !expanded ? 'line-clamp-5' : ''}`}
      >
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-3 flex gap-5 text-sm">
        {isLong && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={bodyId}
            onClick={() => setExpanded((v) => !v)}
            className="font-medium underline-offset-[3px] hover:underline"
          >
            {expanded ? t.movie.readLess : t.movie.readMore}
          </button>
        )}
        <a href={review.url} target="_blank" rel="noreferrer" className="text-muted underline-offset-[3px] hover:underline">
          {t.movie.readOnTmdb}
        </a>
      </div>
    </article>
  )
}
