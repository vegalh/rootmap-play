import { ChallengeCard } from '../components/ChallengeCard'
import { LittleHouseScene } from '../components/illustrations/LittleHouseScene'
import { Container } from '../components/ui/Container'
import { useChallenges } from '../content/useChallenges'
import { t } from '../i18n'

/**
 * The homepage is the entrance to RootMap Play's "Little House": a brief,
 * warm welcome, one featured creative challenge presented like an open
 * picture book, and a curated gallery of the rest. It reads challenges
 * through `useChallenges()` (backed by `contentRepository`), never a
 * hardcoded list, so it scales to any number of admin-published
 * challenges without a redesign (Phase 2 brief §4/§10). Draft challenges
 * never render here — only `status: 'published'` content reaches this
 * page.
 */
export function HomePage() {
  const { data: challenges, loading } = useChallenges()
  const [featured, ...rest] = challenges ?? []

  return (
    <>
      <section className="relative overflow-hidden">
        <Container className="grid gap-10 py-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
          <div className="order-2 flex flex-col items-center gap-5 text-center lg:order-1 lg:items-start lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700/45">
              {t.home.heroEyebrow}
            </span>
            <h1 className="text-balance whitespace-pre-line text-4xl font-medium sm:text-5xl">
              {t.home.heroHeadline}
            </h1>
            <p className="max-w-sm text-balance text-base text-ink-700/80 sm:text-lg">
              {t.home.heroSubtitle}
            </p>
          </div>

          <div className="order-1 overflow-hidden rounded-[28px] shadow-[var(--shadow-soft)] lg:order-2">
            <LittleHouseScene className="h-full w-full" />
          </div>
        </Container>
      </section>

      {featured && (
        <section className="py-6 sm:py-8">
          <Container>
            <ChallengeCard challenge={featured} variant="featured" />
          </Container>
        </section>
      )}

      <section className="py-10 sm:py-14">
        <Container className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700/45">
            {t.home.galleryLabel}
          </span>

          {loading && <p className="text-sm text-ink-700/60">{t.home.galleryLoading}</p>}

          {!loading && rest.length === 0 && !featured && (
            <p className="text-sm text-ink-700/60">{t.home.galleryEmpty}</p>
          )}

          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} variant="grid" />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
