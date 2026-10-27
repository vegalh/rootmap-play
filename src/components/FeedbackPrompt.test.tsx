import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { analytics } from '../analytics'
import { FeedbackPrompt } from './FeedbackPrompt'

describe('FeedbackPrompt', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('tracks rating_submitted when a star is chosen', async () => {
    const trackSpy = vi.spyOn(analytics, 'track')
    const user = userEvent.setup()
    render(<FeedbackPrompt productId="pocket-universe" />)

    await user.click(screen.getByRole('radio', { name: '5 星' }))

    expect(trackSpy).toHaveBeenCalledWith('rating_submitted', {
      productId: 'pocket-universe',
      rating: 5,
    })
  })

  it('shows quick reasons for a low rating and tracks feedback_submitted on selection', async () => {
    const trackSpy = vi.spyOn(analytics, 'track')
    const user = userEvent.setup()
    render(<FeedbackPrompt productId="pocket-universe" />)

    await user.click(screen.getByRole('radio', { name: '2 星' }))
    expect(screen.getByRole('button', { name: '作品不够好看' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '操作太复杂' }))

    expect(trackSpy).toHaveBeenCalledWith('feedback_submitted', {
      productId: 'pocket-universe',
      rating: 2,
      reason: '操作太复杂',
    })
    expect(screen.getByText(/感谢你的反馈/)).toBeInTheDocument()
  })

  it('offers an optional comment box for a high rating and never requires it', async () => {
    const trackSpy = vi.spyOn(analytics, 'track')
    const user = userEvent.setup()
    render(<FeedbackPrompt productId="pocket-universe" />)

    await user.click(screen.getByRole('radio', { name: '5 星' }))
    expect(screen.queryByRole('button', { name: '作品不够好看' })).not.toBeInTheDocument()

    const textarea = screen.getByPlaceholderText('还想对我们说的话（选填）')
    await user.type(textarea, '很喜欢这个小宇宙！')
    await user.click(screen.getByRole('button', { name: '提交反馈' }))

    expect(trackSpy).toHaveBeenCalledWith('feedback_submitted', {
      productId: 'pocket-universe',
      rating: 5,
      comment: '很喜欢这个小宇宙！',
    })
  })
})
