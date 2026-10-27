import { useState } from 'react'
import { analytics, LOW_RATING_REASONS, type LowRatingReason, type ProductId } from '../analytics'
import { t } from '../i18n'

interface FeedbackPromptProps {
  productId: ProductId
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <path
        d="M12 2.8l2.76 5.59 6.17.9-4.47 4.35 1.06 6.15L12 16.9l-5.52 2.9 1.06-6.15-4.47-4.35 6.17-.9Z"
        fill={filled ? '#D9A23A' : 'none'}
        stroke={filled ? '#D9A23A' : 'currentColor'}
        strokeWidth={filled ? 0 : 1.6}
        className={filled ? '' : 'text-ink-800/25'}
      />
    </svg>
  )
}

/**
 * Optional 1–5 star satisfaction prompt shown after a successful download.
 * Never blocks the download itself — this only ever appears afterwards.
 * Low ratings (1–3) offer quick reason chips; high ratings (4–5) offer an
 * optional free-text compliment. Both are honest about not implying
 * server-side storage beyond the existing (consent-aware) analytics event.
 */
export function FeedbackPrompt({ productId }: FeedbackPromptProps) {
  const [rating, setRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)
  const [hoverRating, setHoverRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)
  const [selectedReason, setSelectedReason] = useState<LowRatingReason | null>(null)
  const [comment, setComment] = useState('')
  const [feedbackDone, setFeedbackDone] = useState(false)

  function handleRate(value: 1 | 2 | 3 | 4 | 5) {
    setRating(value)
    setSelectedReason(null)
    setFeedbackDone(false)
    analytics.track('rating_submitted', { productId, rating: value })
  }

  function handleReason(reason: LowRatingReason) {
    if (!rating) return
    setSelectedReason(reason)
    setFeedbackDone(true)
    analytics.track('feedback_submitted', { productId, rating, reason })
  }

  function handleSubmitComment() {
    if (!rating) return
    analytics.track('feedback_submitted', {
      productId,
      rating,
      comment: comment.trim() || undefined,
    })
    setFeedbackDone(true)
  }

  const displayRating = hoverRating || rating

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl bg-cream-100 p-5 text-center">
      <p className="text-sm font-medium text-ink-800">{t.feedback.question}</p>
      <div
        role="radiogroup"
        aria-label="满意度评分"
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverRating(0)}
      >
        {STAR_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} 星`}
            onMouseEnter={() => setHoverRating(value)}
            onFocus={() => setHoverRating(value)}
            onClick={() => handleRate(value)}
            className="rounded-full p-1 transition-transform duration-150 hover:scale-110"
          >
            <StarIcon filled={value <= displayRating} />
          </button>
        ))}
      </div>

      {rating > 0 && rating <= 3 && !feedbackDone && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {LOW_RATING_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => handleReason(reason)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors duration-150 ${
                selectedReason === reason
                  ? 'bg-terracotta-500 text-cream-50'
                  : 'bg-cream-50 text-ink-700/70 hover:bg-cream-200'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      )}

      {rating >= 4 && !feedbackDone && (
        <div className="flex w-full flex-col items-center gap-2">
          <label htmlFor="feedback-comment" className="sr-only">
            {t.feedback.commentPlaceholder}
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={t.feedback.commentPlaceholder}
            rows={2}
            className="w-full resize-none rounded-xl border border-ink-800/10 bg-cream-50 px-3 py-2 text-sm text-ink-800 placeholder:text-ink-700/40 focus:border-terracotta-400"
          />
          <button
            type="button"
            onClick={handleSubmitComment}
            className="rounded-full bg-terracotta-500 px-4 py-1.5 text-xs font-medium text-cream-50 hover:bg-terracotta-600"
          >
            {t.feedback.submitCta}
          </button>
        </div>
      )}

      {feedbackDone && <p className="text-xs text-ink-700/60">{t.feedback.thankYou}</p>}
    </div>
  )
}
