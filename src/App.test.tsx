import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App routing', () => {
  it('renders the home page at /', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('为孩子创造一段')
  })

  it.each([
    ['/pocket-universe', '宝宝的口袋宇宙'],
    ['/little-hero', '宝宝的隐藏角色'],
    ['/family-universe', '我们家的亲戚关系宇宙'],
  ])('renders %s without a broken route', (path, expectedHeading) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(expectedHeading)
  })

  it('renders the privacy page', () => {
    renderAt('/privacy')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('隐私说明')
  })

  it('renders the admin setup-required state', () => {
    renderAt('/admin')
    expect(screen.getByText('后台尚未配置')).toBeInTheDocument()
  })

  it('renders a 404 page for an unknown route instead of crashing', () => {
    renderAt('/this-route-does-not-exist')
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '回到首页' })).toHaveAttribute('href', '/')
  })
})
