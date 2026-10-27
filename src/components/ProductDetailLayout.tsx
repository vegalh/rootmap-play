import type { ComponentType } from 'react'
import { t } from '../i18n'
import { Badge } from './ui/Badge'
import { Container } from './ui/Container'
import { LinkButton } from './ui/Button'

interface ProductDetailLayoutProps {
  eyebrow: string
  name: string
  englishName: string
  tagline: string
  description: string
  steps: readonly string[]
  comingSoonNotice: string
  illustration: ComponentType<{ className?: string }>
}

/**
 * Shared layout for the three product detail pages. PHASE 1 ships this as
 * an informational page with an honestly-labelled "coming soon" state —
 * the real creation experiences land in PHASE 2.
 */
export function ProductDetailLayout({
  eyebrow,
  name,
  englishName,
  tagline,
  description,
  steps,
  comingSoonNotice,
  illustration: Illustration,
}: ProductDetailLayoutProps) {
  return (
    <Container className="flex flex-col gap-10 py-10 sm:py-16">
      <LinkButton to="/" variant="ghost" className="self-start">
        ← {t.common.backHome}
      </LinkButton>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="order-2 flex flex-col gap-4 lg:order-1">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-terracotta-600">
            {eyebrow} · {englishName}
          </span>
          <h1 className="text-balance text-3xl font-medium sm:text-4xl">{name}</h1>
          <p className="text-balance text-lg text-ink-700/80">{tagline}</p>
          <p className="text-base leading-relaxed text-ink-700/80">{description}</p>
        </div>

        <div className="order-1 aspect-square w-full overflow-hidden rounded-3xl bg-pine-700 shadow-[var(--shadow-soft)] lg:order-2">
          <Illustration className="h-full w-full" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl bg-cream-100 p-5">
            <span className="font-display text-2xl text-terracotta-500">{index + 1}</span>
            <p className="mt-2 text-sm text-ink-700/85">{step}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-ink-800/20 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <Badge tone="gold">{t.common.developingBadge}</Badge>
          <p className="max-w-xl text-sm text-ink-700/80">{comingSoonNotice}</p>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="shrink-0 cursor-not-allowed rounded-full bg-ink-800/10 px-6 py-3 text-base font-medium text-ink-700/60"
        >
          {t.productCard.comingSoonBadge}
        </button>
      </div>
    </Container>
  )
}
