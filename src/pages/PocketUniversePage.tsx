import { ProductDetailLayout } from '../components/ProductDetailLayout'
import { PocketUniverseIllustration } from '../components/illustrations/PocketUniverseIllustration'
import { t } from '../i18n'

export function PocketUniversePage() {
  const copy = t.products.pocketUniverse
  return (
    <ProductDetailLayout
      eyebrow={copy.eyebrow}
      name={copy.name}
      englishName={copy.englishName}
      tagline={copy.tagline}
      description={copy.description}
      steps={copy.steps}
      comingSoonNotice={copy.comingSoonNotice}
      illustration={PocketUniverseIllustration}
    />
  )
}
