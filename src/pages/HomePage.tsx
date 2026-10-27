import { analytics } from '../analytics'
import { ArtworkFrame } from '../components/ArtworkFrame'
import { BlobBackdrop } from '../components/illustrations/BlobBackdrop'
import { FamilyUniverseIllustration } from '../components/illustrations/FamilyUniverseIllustration'
import { LittleHeroIllustration } from '../components/illustrations/LittleHeroIllustration'
import { PocketUniverseIllustration } from '../components/illustrations/PocketUniverseIllustration'
import { ProductCard } from '../components/ProductCard'
import { Container } from '../components/ui/Container'
import { LinkButton } from '../components/ui/Button'
import { t } from '../i18n'

const moreExperiences = [
  {
    ...t.products.littleHero,
    href: '/little-hero',
    illustration: LittleHeroIllustration,
  },
  {
    ...t.products.familyUniverse,
    href: '/family-universe',
    illustration: FamilyUniverseIllustration,
  },
] as const

/**
 * The homepage is a single interactive mini-experience, not a marketing
 * site: one hero (headline + CTA + a real artwork preview) and two
 * compact secondary experience cards. No mission statement, no "why
 * RootMap" section, no trust badges — the artwork itself does that work.
 */
export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <BlobBackdrop className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
        <Container className="grid gap-10 py-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
          <div className="order-2 flex flex-col items-center gap-5 text-center lg:order-1 lg:items-start lg:text-left">
            <h1 className="text-balance whitespace-pre-line text-4xl font-medium sm:text-5xl">
              {t.home.heroHeadline}
            </h1>
            <p className="max-w-sm text-balance text-base text-ink-700/80 sm:text-lg">
              {t.home.heroSubtitle}
            </p>
            <LinkButton
              to="/pocket-universe"
              variant="primary"
              onClick={() =>
                analytics.track('product_click', {
                  productId: 'pocket-universe',
                  source: 'home_hero',
                })
              }
            >
              {t.home.heroCta}
            </LinkButton>
          </div>

          <div className="order-1 lg:order-2">
            <ArtworkFrame
              illustration={PocketUniverseIllustration}
              caption={t.home.previewCaption}
              size="hero"
            />
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700/45">
            {t.home.moreLabel}
          </span>
          <div className="grid gap-6 sm:grid-cols-2">
            {moreExperiences.map((experience, index) => (
              <ProductCard
                key={experience.id}
                productId={experience.id}
                href={experience.href}
                name={experience.name}
                tagline={experience.tagline}
                illustration={experience.illustration}
                position={index + 1}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
