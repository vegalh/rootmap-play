import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../test/renderWithRouter'
import { getConsentStatus } from '../analytics/consent'
import { PrivacyNoticeBanner } from './PrivacyNoticeBanner'

describe('PrivacyNoticeBanner', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows on first visit and hides after accepting, recording consent', async () => {
    const user = userEvent.setup()
    renderWithRouter(<PrivacyNoticeBanner />)

    expect(screen.getByText(/匿名使用数据/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '好的，我知道了' }))

    expect(screen.queryByText(/匿名使用数据/)).not.toBeInTheDocument()
    expect(getConsentStatus()).toBe('accepted')
  })

  it('hides after declining, recording the decline', async () => {
    const user = userEvent.setup()
    renderWithRouter(<PrivacyNoticeBanner />)

    await user.click(screen.getByRole('button', { name: '暂不同意' }))

    expect(screen.queryByText(/匿名使用数据/)).not.toBeInTheDocument()
    expect(getConsentStatus()).toBe('declined')
  })

  it('does not render again once a choice was already made', () => {
    window.localStorage.setItem('rootmap-play:analytics-consent', 'accepted')
    renderWithRouter(<PrivacyNoticeBanner />)
    expect(screen.queryByText(/匿名使用数据/)).not.toBeInTheDocument()
  })
})
