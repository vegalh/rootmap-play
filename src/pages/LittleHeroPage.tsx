import { ProductDetailLayout } from '../components/ProductDetailLayout'
import { LittleHeroIllustration } from '../components/illustrations/LittleHeroIllustration'
import { t } from '../i18n'

export function LittleHeroPage() {
  const copy = t.products.littleHero
  return (
    <ProductDetailLayout
      eyebrow={copy.eyebrow}
      name={copy.name}
      englishName={copy.englishName}
      tagline={copy.tagline}
      description={copy.description}
      steps={copy.steps}
      comingSoonNotice={copy.comingSoonNotice}
      illustration={LittleHeroIllustration}
    />
  )
}
