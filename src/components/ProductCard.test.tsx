import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/renderWithRouter'
import { PocketUniverseIllustration } from './illustrations/PocketUniverseIllustration'
import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  it('renders the product name, tagline, and a working link', () => {
    renderWithRouter(
      <ProductCard
        productId="pocket-universe"
        href="/pocket-universe"
        eyebrow="产品 A"
        name="宝宝的口袋宇宙"
        tagline="挑选五件孩子喜欢的小事物"
        illustration={PocketUniverseIllustration}
        position={1}
      />,
    )

    expect(screen.getByText('宝宝的口袋宇宙')).toBeInTheDocument()
    expect(screen.getByText('挑选五件孩子喜欢的小事物')).toBeInTheDocument()

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/pocket-universe')
  })
})
