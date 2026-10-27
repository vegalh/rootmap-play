import { useEffect, useRef, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { analytics } from '../analytics'
import type { ProductId } from '../analytics/events'
import { t } from '../i18n'
import { Badge } from './ui/Badge'

interface ProductCardProps {
  productId: ProductId
  href: string
  name: string
  tagline: string
  illustration: ComponentType<{ className?: string }>
  position: number
}

/**
 * Compact secondary experience tile shown below the homepage hero.
 * Reports an impression once when it first becomes visible, and a click
 * event when the parent navigates into the product.
 */
export function ProductCard({
  productId,
  href,
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
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-pine-700">
        <Illustration className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute right-3 top-3">
          <Badge tone="gold">{t.productCard.comingSoonBadge}</Badge>
        </span>
      </div>
      <div className="flex flex-col gap-1 p-5">
        <h3 className="text-lg font-medium sm:text-xl">{name}</h3>
        <p className="text-sm text-ink-700/75">{tagline}</p>
      </div>
    </Link>
  )
}
