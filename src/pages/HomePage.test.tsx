import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/renderWithRouter'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the hero headline and all three product cards', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('为孩子创造一段')
    expect(screen.getByText('宝宝的口袋宇宙')).toBeInTheDocument()
    expect(screen.getByText('宝宝的隐藏角色')).toBeInTheDocument()
    expect(screen.getByText('我们家的亲戚关系宇宙')).toBeInTheDocument()
  })
})
