import type { ComponentType } from 'react'
import { t } from '../i18n'
import { ArtworkFrame } from './ArtworkFrame'
import { Container } from './ui/Container'
import { LinkButton } from './ui/Button'

interface ProductDetailLayoutProps {
  englishName: string
  name: string
  tagline: string
  comingSoonNotice: string
  illustration: ComponentType<{ className?: string }>
}

/**
 * Shared layout for the three product entry pages. Deliberately compact —
 * one artwork preview, a short title + tagline, and an honest "即将开放"
 * state — rather than a long explanatory brochure. The real creation flow
 * ships in PHASE 2; until then the primary action stays disabled instead
 * of pretending to work.
 */
export function ProductDetailLayout({
  englishName,
  name,
  tagline,
  comingSoonNotice,
  illustration,
}: ProductDetailLayoutProps) {
  return (
    <Container className="flex flex-col items-center gap-8 py-10 text-center sm:py-14">
      <LinkButton to="/" variant="ghost" className="self-start">
        ← {t.common.backHome}
      </LinkButton>

      <ArtworkFrame illustration={illustration} caption={t.home.previewCaption} size="compact" />

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700/50">
          {englishName}
        </span>
        <h1 className="text-balance text-3xl font-medium sm:text-4xl">{name}</h1>
        <p className="max-w-sm text-balance text-base text-ink-700/80">{tagline}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="cursor-not-allowed rounded-full bg-ink-800/10 px-6 py-3 text-base font-medium text-ink-700/60"
        >
          {t.productCard.comingSoonBadge}
        </button>
        <p className="max-w-xs text-xs text-ink-700/60">{comingSoonNotice}</p>
      </div>
    </Container>
  )
}
