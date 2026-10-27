import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../test/renderWithRouter'
import { analytics } from '../../analytics'
import { PocketUniverseCreator } from './PocketUniverseCreator'
import * as svgExport from './svgExport'

const FIVE_ITEM_NAMES = ['恐龙', '猫咪', '小狗', '兔子', '熊猫']

async function selectFiveAndContinue(user: ReturnType<typeof userEvent.setup>) {
  for (const name of FIVE_ITEM_NAMES) {
    await user.click(screen.getByRole('button', { name }))
  }
  await user.click(screen.getByRole('button', { name: /生成我的宇宙/ }))
}

describe('PocketUniverseCreator', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fires creation_started and creation_completed once five items are chosen', async () => {
    const trackSpy = vi.spyOn(analytics, 'track')
    const user = userEvent.setup()
    renderWithRouter(<PocketUniverseCreator />, ['/pocket-universe'])

    await selectFiveAndContinue(user)

    expect(trackSpy).toHaveBeenCalledWith('creation_started', { productId: 'pocket-universe' })
    expect(trackSpy).toHaveBeenCalledWith(
      'creation_completed',
      expect.objectContaining({ productId: 'pocket-universe' }),
    )
    expect(screen.getByRole('img', { name: /插画/ })).toBeInTheDocument()
  })

  it('switches the color theme without losing the composition', async () => {
    const user = userEvent.setup()
    renderWithRouter(<PocketUniverseCreator />, ['/pocket-universe'])
    await selectFiveAndContinue(user)

    const duskTheme = screen.getByRole('radio', { name: '黄昏暖阳' })
    await user.click(duskTheme)
    expect(duskTheme).toHaveAttribute('aria-checked', 'true')
  })

  it('regenerates the layout on demand', async () => {
    const user = userEvent.setup()
    renderWithRouter(<PocketUniverseCreator />, ['/pocket-universe'])
    await selectFiveAndContinue(user)

    const sceneBefore = screen.getByRole('img', { name: /插画/ }).innerHTML
    await user.click(screen.getByRole('button', { name: '换一种排列' }))
    const sceneAfter = screen.getByRole('img', { name: /插画/ }).innerHTML

    expect(sceneAfter).not.toEqual(sceneBefore)
  })

  it('returns to the picker, preserving the previous selections', async () => {
    const user = userEvent.setup()
    renderWithRouter(<PocketUniverseCreator />, ['/pocket-universe'])
    await selectFiveAndContinue(user)

    await user.click(screen.getByRole('button', { name: /重新选择/ }))

    expect(screen.getByText('5/5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '恐龙' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('downloads successfully, tracks the event, and reveals the rating prompt', async () => {
    vi.spyOn(svgExport, 'exportSceneToPng').mockResolvedValue({
      ok: true,
      blob: new Blob(['fake'], { type: 'image/png' }),
    })
    const downloadBlobSpy = vi.spyOn(svgExport, 'downloadBlob').mockImplementation(() => {})
    const trackSpy = vi.spyOn(analytics, 'track')
    const user = userEvent.setup()
    renderWithRouter(<PocketUniverseCreator />, ['/pocket-universe'])
    await selectFiveAndContinue(user)

    await user.click(screen.getByRole('button', { name: /下载高清图片/ }))

    expect(trackSpy).toHaveBeenCalledWith('download_clicked', { productId: 'pocket-universe' })
    expect(downloadBlobSpy).toHaveBeenCalled()
    expect(await screen.findByText(/已保存到你的设备/)).toBeInTheDocument()
    expect(trackSpy).toHaveBeenCalledWith('download_succeeded', { productId: 'pocket-universe' })
    expect(screen.getByText('这次创作体验怎么样？')).toBeInTheDocument()
  })

  it('shows an honest error state and never fakes success when export fails', async () => {
    vi.spyOn(svgExport, 'exportSceneToPng').mockResolvedValue({
      ok: false,
      error: 'canvas-unsupported',
    })
    const trackSpy = vi.spyOn(analytics, 'track')
    const user = userEvent.setup()
    renderWithRouter(<PocketUniverseCreator />, ['/pocket-universe'])
    await selectFiveAndContinue(user)

    await user.click(screen.getByRole('button', { name: /下载高清图片/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent('下载失败')
    expect(screen.queryByText(/已保存到你的设备/)).not.toBeInTheDocument()
    expect(trackSpy).not.toHaveBeenCalledWith('download_succeeded', expect.anything())
  })
})
