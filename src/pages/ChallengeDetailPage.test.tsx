import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, type InitialEntry } from 'react-router-dom'
import * as analyticsModule from '../analytics'
import { ChallengeDetailPage } from './ChallengeDetailPage'

/**
 * `ChallengeDetailPage` reads its slug via `useParams`, which only
 * populates when rendered through a matching `<Route>` — so (unlike most
 * pages in this app) it can't use the plain `renderWithRouter` helper.
 */
function renderDetailPage(slug: string, state?: { source?: string }) {
  const initialEntries: InitialEntry[] = [{ pathname: `/challenges/${slug}`, state }]
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/challenges/:slug" element={<ChallengeDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ChallengeDetailPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows a friendly not-found state for an unknown slug', async () => {
    renderDetailPage('does-not-exist')

    expect(await screen.findByText('这个挑战还没准备好')).toBeInTheDocument()
  })

  it('fires challenge_opened once on mount, with the source from navigation state', async () => {
    const trackSpy = vi.spyOn(analyticsModule.analytics, 'track')

    renderDetailPage('pocket-universe', { source: 'gallery_featured' })

    await screen.findByRole('heading', { level: 1 })
    await waitFor(() =>
      expect(trackSpy).toHaveBeenCalledWith('challenge_opened', {
        challengeSlug: 'pocket-universe',
        source: 'gallery_featured',
      }),
    )
  })

  it('walks through the full flow: fill answers, generate, copy, then edit answers', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    const trackSpy = vi.spyOn(analyticsModule.analytics, 'track')

    renderDetailPage('pocket-universe')

    await screen.findByRole('heading', { level: 1 })

    fireEvent.change(screen.getByLabelText(/宝宝最近最喜欢什么/), {
      target: { value: '恐龙和星星' },
    })
    expect(trackSpy).toHaveBeenCalledWith('prompt_started', { challengeSlug: 'pocket-universe' })

    fireEvent.click(screen.getByRole('radio', { name: '温暖、梦幻' }))
    fireEvent.click(screen.getByRole('button', { name: /生成我的创作咒语/ }))

    expect(trackSpy).toHaveBeenCalledWith('prompt_generated', { challengeSlug: 'pocket-universe' })
    const resultHeading = await screen.findByRole('heading', { name: '你的专属创作咒语' })
    expect(resultHeading).toBeInTheDocument()
    expect(screen.getByText(/恐龙和星星/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '复制创作咒语' }))
    await waitFor(() => expect(writeText).toHaveBeenCalled())
    expect(trackSpy).toHaveBeenCalledWith('prompt_copied', { challengeSlug: 'pocket-universe' })

    fireEvent.click(screen.getByRole('button', { name: /修改我的回答/ }))

    // Back on the questionnaire, with the previous answer preserved.
    expect(await screen.findByLabelText(/宝宝最近最喜欢什么/)).toHaveValue('恐龙和星星')
  })
})
