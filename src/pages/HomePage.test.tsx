import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/renderWithRouter'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the hero headline, primary CTA, and the two secondary experience cards', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('把宝宝喜欢的东西')
    expect(screen.getByRole('link', { name: /立即制作/ })).toHaveAttribute(
      'href',
      '/pocket-universe',
    )
    expect(screen.getByText('宝宝的隐藏角色')).toBeInTheDocument()
    expect(screen.getByText('我们家的亲戚关系宇宙')).toBeInTheDocument()
    // Pocket Universe is the hero itself, not a duplicated secondary card.
    expect(screen.queryByRole('heading', { name: '宝宝的口袋宇宙' })).not.toBeInTheDocument()
  })
})
