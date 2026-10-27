import { ProductDetailLayout } from '../components/ProductDetailLayout'
import { FamilyUniverseIllustration } from '../components/illustrations/FamilyUniverseIllustration'
import { t } from '../i18n'

export function FamilyUniversePage() {
  const copy = t.products.familyUniverse
  return (
    <ProductDetailLayout
      name={copy.name}
      englishName={copy.englishName}
      tagline={copy.tagline}
      comingSoonNotice={copy.comingSoonNotice}
      illustration={FamilyUniverseIllustration}
    />
  )
}
