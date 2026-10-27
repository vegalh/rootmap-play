import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../test/renderWithRouter'
import { Header } from './Header'

describe('Header', () => {
  it('renders the brand and all primary navigation links', () => {
    renderWithRouter(<Header />)

    expect(screen.getByText('RootMap')).toBeInTheDocument()
    expect(screen.getByText('PLAY')).toBeInTheDocument()

    const nav = screen.getAllByRole('link')
    const hrefs = nav.map((link) => link.getAttribute('href'))
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/pocket-universe')
    expect(hrefs).toContain('/little-hero')
    expect(hrefs).toContain('/family-universe')
  })

  it('toggles the mobile menu open and closed', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Header />)

    const toggle = screen.getByRole('button', { name: '菜单' })
    expect(screen.queryByRole('navigation', { name: '' })).toBeTruthy()

    await user.click(toggle)
    expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '关闭' }))
    expect(screen.getByRole('button', { name: '菜单' })).toBeInTheDocument()
  })
})
