import { Link } from 'react-router-dom'
import type { Challenge } from '../content/types'
import { t } from '../i18n'
import { ArtworkPlaceholder } from './ArtworkPlaceholder'

interface ChallengeCardProps {
  challenge: Challenge
  /** 'featured' renders the larger "open book" presentation used once per gallery; 'grid' is the compact tile. */
  variant?: 'featured' | 'grid'
}

function featuredArtwork(challenge: Challenge) {
  return challenge.artworks.find((artwork) => artwork.isFeatured) ?? challenge.artworks[0]
}

/**
 * A single challenge's entry point into the gallery — part of the
 * "flexible gallery system" the content model is designed for (Phase 2
 * brief §4/§10): it renders from `Challenge` data alone, so it scales to
 * any number of admin-published challenges without homepage changes.
 *
 * Navigation state (`source`) lets the destination page's
 * `challenge_opened` analytics event record which part of the gallery a
 * visitor entered from, without the card itself needing its own
 * analytics call.
 */
export function ChallengeCard({ challenge, variant = 'grid' }: ChallengeCardProps) {
  const artwork = featuredArtwork(challenge)
  const altText = artwork?.altText ?? challenge.teaser

  if (variant === 'featured') {
    return (
      <Link
        to={`/challenges/${challenge.slug}`}
        state={{ source: 'gallery_featured' }}
        className="group grid gap-6 overflow-hidden rounded-[32px] bg-cream-100 p-5 shadow-[var(--shadow-soft)] sm:grid-cols-2 sm:items-center sm:p-8"
      >
        <ArtworkPlaceholder altText={altText} aspect="square" size="hero" rotate="left" />
        <div className="flex flex-col items-start gap-3 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700/50">
            {t.home.featuredLabel}
          </span>
          <h2 className="text-balance text-2xl font-medium sm:text-3xl">{challenge.title}</h2>
          <p className="text-balance text-base text-ink-700/80">{challenge.teaser}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-medium text-cream-50 shadow-[var(--shadow-card)] transition-colors duration-200 group-hover:bg-terracotta-600">
            {challenge.ctaLabel}
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/challenges/${challenge.slug}`}
      state={{ source: 'gallery_grid' }}
      className="group flex flex-col gap-4 rounded-3xl bg-cream-100 p-4 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1 sm:p-5"
    >
      <ArtworkPlaceholder altText={altText} aspect="square" size="compact" rotate="right" />
      <div className="flex flex-col gap-1 text-left">
        <h3 className="text-lg font-medium">{challenge.title}</h3>
        <p className="text-sm text-ink-700/75">{challenge.teaser}</p>
      </div>
    </Link>
  )
}
