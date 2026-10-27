import { useEffect, useRef, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { analytics } from '../analytics'
import type { ProductId } from '../analytics/events'
import { t } from '../i18n'
import { Badge } from './ui/Badge'

interface ProductCardProps {
  productId: ProductId
  href: string
  eyebrow: string
  name: string
  tagline: string
  illustration: ComponentType<{ className?: string }>
  position: number
}

/**
 * Homepage product tile. Reports an impression once when it first becomes
 * visible, and a click event when the parent navigates into the product.
 */
export function ProductCard({
  productId,
  href,
  eyebrow,
  name,
  tagline,
  illustration: Illustration,
  position,
}: ProductCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const hasTrackedImpression = useRef(false)

  useEffect(() => {
    const node = cardRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasTrackedImpression.current) {
            hasTrackedImpression.current = true
            analytics.track('product_card_view', { productId, position })
            observer.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [productId, position])

  return (
    <Link
      ref={cardRef}
      to={href}
      onClick={() => analytics.track('product_click', { productId, source: 'home_grid' })}
      className="group flex flex-col overflow-hidden rounded-3xl bg-cream-100 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-pine-700">
        <Illustration className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600">
          {eyebrow}
        </span>
        <h3 className="text-xl font-medium sm:text-2xl">{name}</h3>
        <p className="flex-1 text-sm text-ink-700/80 sm:text-base">{tagline}</p>
        <div className="mt-2 flex items-center justify-between">
          <Badge tone="gold">{t.productCard.comingSoonBadge}</Badge>
          <span className="text-sm font-semibold text-terracotta-600 group-hover:underline">
            {t.productCard.cta} →
          </span>
        </div>
      </div>
    </Link>
  )
}
