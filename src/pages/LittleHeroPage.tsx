import { ProductDetailLayout } from '../components/ProductDetailLayout'
import { LittleHeroIllustration } from '../components/illustrations/LittleHeroIllustration'
import { t } from '../i18n'

export function LittleHeroPage() {
  const copy = t.products.littleHero
  return (
    <ProductDetailLayout
      name={copy.name}
      englishName={copy.englishName}
      tagline={copy.tagline}
      comingSoonNotice={copy.comingSoonNotice}
      illustration={LittleHeroIllustration}
    />
  )
}
