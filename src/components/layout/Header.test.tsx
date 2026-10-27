import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../test/renderWithRouter'
import { Header } from './Header'

describe('Header', () => {
  it('renders a small brand mark linking home and a privacy link, with no hamburger menu', () => {
    renderWithRouter(<Header />)

    expect(screen.getByText('RootMap')).toBeInTheDocument()
    expect(screen.getByText('PLAY')).toBeInTheDocument()

    const links = screen.getAllByRole('link')
    const hrefs = links.map((link) => link.getAttribute('href'))
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/privacy')

    // The redesigned header has no mobile menu toggle to hide links behind.
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
