import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/renderWithRouter'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the Little House welcome and the challenge gallery', async () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('欢迎来到')

    // The first published challenge (pocket-universe) renders as the
    // featured card; the remaining published challenge (secret-room)
    // renders once in the grid below it — never duplicated.
    const featuredLinks = await screen.findAllByRole('link', { name: /宝宝的口袋宇宙/ })
    expect(featuredLinks.length).toBeGreaterThan(0)
    expect(featuredLinks[0]).toHaveAttribute('href', '/challenges/pocket-universe')

    const gridLinks = screen.getAllByRole('link', { name: /宝宝的秘密房间/ })
    expect(gridLinks[0]).toHaveAttribute('href', '/challenges/secret-room')

    // The draft challenge must never reach the public gallery.
    expect(screen.queryByText('宝宝的人生电影')).not.toBeInTheDocument()
  })
})
