import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as analyticsModule from '../../analytics'
import { PromptResult } from './PromptResult'

describe('PromptResult', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the resolved prompt text', () => {
    render(
      <PromptResult challengeSlug="pocket-universe" prompt="一段生成好的 prompt 文本" onEditAnswers={vi.fn()} />,
    )

    expect(screen.getByText('一段生成好的 prompt 文本')).toBeInTheDocument()
  })

  it('copies the prompt to the clipboard and tracks prompt_copied', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    const trackSpy = vi.spyOn(analyticsModule.analytics, 'track')

    render(<PromptResult challengeSlug="pocket-universe" prompt="复制我" onEditAnswers={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: '复制创作咒语' }))

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('复制我'))
    expect(trackSpy).toHaveBeenCalledWith('prompt_copied', { challengeSlug: 'pocket-universe' })
    expect(await screen.findByRole('button', { name: /已复制/ })).toBeInTheDocument()
  })

  it('tracks chatgpt_outbound_clicked and opens a new, generic tab', () => {
    const trackSpy = vi.spyOn(analyticsModule.analytics, 'track')

    render(<PromptResult challengeSlug="pocket-universe" prompt="任意文本" onEditAnswers={vi.fn()} />)
    const link = screen.getByRole('link', { name: '打开 ChatGPT' })
    fireEvent.click(link)

    expect(trackSpy).toHaveBeenCalledWith('chatgpt_outbound_clicked', { challengeSlug: 'pocket-universe' })
    expect(link).toHaveAttribute('href', 'https://chat.openai.com/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('calls onEditAnswers when "修改我的回答" is clicked', () => {
    const onEditAnswers = vi.fn()
    render(<PromptResult challengeSlug="pocket-universe" prompt="任意文本" onEditAnswers={onEditAnswers} />)

    fireEvent.click(screen.getByRole('button', { name: /修改我的回答/ }))

    expect(onEditAnswers).toHaveBeenCalledTimes(1)
  })
})
