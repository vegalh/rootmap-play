import { BlobBackdrop } from '../components/illustrations/BlobBackdrop'
import { FamilyUniverseIllustration } from '../components/illustrations/FamilyUniverseIllustration'
import { LittleHeroIllustration } from '../components/illustrations/LittleHeroIllustration'
import { PocketUniverseIllustration } from '../components/illustrations/PocketUniverseIllustration'
import { ProductCard } from '../components/ProductCard'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { t } from '../i18n'

const products = [
  {
    ...t.products.pocketUniverse,
    href: '/pocket-universe',
    illustration: PocketUniverseIllustration,
  },
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

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <BlobBackdrop className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
        <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-terracotta-600">
            {t.home.heroEyebrow}
          </span>
          <h1 className="text-balance whitespace-pre-line text-4xl font-medium sm:text-6xl">
            {t.home.heroTitle}
          </h1>
          <p className="max-w-2xl text-balance text-base text-ink-700/80 sm:text-lg">
            {t.home.heroSubtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-base font-medium text-cream-50 shadow-[var(--shadow-card)] transition-colors hover:bg-terracotta-600"
            >
              {t.home.heroPrimaryCta}
            </a>
            <a
              href="#rootmap-intro"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-6 py-3 text-base font-medium text-ink-800 ring-1 ring-inset ring-ink-800/15 transition-colors hover:bg-ink-800/5"
            >
              {t.home.heroSecondaryCta}
            </a>
          </div>
        </Container>
      </section>

      <section id="rootmap-intro" className="py-14 sm:py-20">
        <Container>
          <SectionHeading title={t.home.introTitle} subtitle={t.home.introBody} />
        </Container>
      </section>

      <section id="products" className="py-14 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading title={t.home.productsTitle} subtitle={t.home.productsSubtitle} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                href={product.href}
                eyebrow={product.eyebrow}
                name={product.name}
                tagline={product.tagline}
                illustration={product.illustration}
                position={index + 1}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading title={t.home.trustTitle} />
          <div className="grid gap-6 sm:grid-cols-3">
            {t.home.trustItems.map((item) => (
              <div key={item.title} className="rounded-2xl bg-cream-100 p-6 text-center">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-700/80">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
