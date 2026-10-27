import { describe, expect, it, vi } from 'vitest'
import { exportSceneToPng } from './svgExport'

/** Minimal fake <img> that resolves `onload` or `onerror` synchronously on src assignment. */
function makeFakeImage(shouldSucceed: boolean) {
  const img = {
    onload: null as (() => void) | null,
    onerror: null as (() => void) | null,
    set src(_value: string) {
      if (shouldSucceed) {
        img.onload?.()
      } else {
        img.onerror?.()
      }
    },
  }
  return img as unknown as HTMLImageElement
}

/** Minimal fake <canvas> + 2D context that records drawing calls instead of rendering pixels. */
function makeFakeCanvas(options: { contextAvailable?: boolean; blobAvailable?: boolean } = {}) {
  const { contextAvailable = true, blobAvailable = true } = options
  const calls: string[] = []
  const ctx = {
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
    fillRect: () => calls.push('fillRect'),
    drawImage: () => calls.push('drawImage'),
    fillText: (text: string) => calls.push(`fillText:${text}`),
  }
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => (contextAvailable ? ctx : null),
    toBlob: (cb: (blob: Blob | null) => void) => {
      cb(blobAvailable ? new Blob(['fake-png'], { type: 'image/png' }) : null)
    },
  }
  return { canvas: canvas as unknown as HTMLCanvasElement, calls }
}

describe('exportSceneToPng', () => {
  it('resolves ok:false when the SVG fails to rasterize into an image', async () => {
    const result = await exportSceneToPng('<svg />', { titleText: 't', creditText: 'c' }, {
      createImage: () => makeFakeImage(false),
    })
    expect(result.ok).toBe(false)
    expect(result.error).toBe('image-load-failed')
  })

  it('resolves ok:false when canvas 2D is unsupported', async () => {
    const { canvas } = makeFakeCanvas({ contextAvailable: false })
    const result = await exportSceneToPng(
      '<svg />',
      { titleText: 't', creditText: 'c' },
      {
        createImage: () => makeFakeImage(true),
        createCanvas: () => canvas,
        loadFonts: async () => {},
      },
    )
    expect(result.ok).toBe(false)
    expect(result.error).toBe('canvas-unsupported')
  })

  it('resolves ok:false when PNG encoding fails', async () => {
    const { canvas } = makeFakeCanvas({ blobAvailable: false })
    const result = await exportSceneToPng(
      '<svg />',
      { titleText: 't', creditText: 'c' },
      {
        createImage: () => makeFakeImage(true),
        createCanvas: () => canvas,
        loadFonts: async () => {},
      },
    )
    expect(result.ok).toBe(false)
    expect(result.error).toBe('encode-failed')
  })

  it('draws the scene image then the title and credit text, and resolves a PNG blob', async () => {
    const { canvas, calls } = makeFakeCanvas()
    const loadFonts = vi.fn().mockResolvedValue(undefined)
    const result = await exportSceneToPng(
      '<svg />',
      { titleText: '宝宝的专属口袋宇宙', creditText: '由 RootMap Play 制作' },
      {
        createImage: () => makeFakeImage(true),
        createCanvas: () => canvas,
        loadFonts,
      },
    )

    expect(result.ok).toBe(true)
    expect(result.blob?.type).toBe('image/png')
    expect(loadFonts).toHaveBeenCalled()
    expect(calls).toEqual([
      'fillRect',
      'drawImage',
      'fillText:宝宝的专属口袋宇宙',
      'fillText:由 RootMap Play 制作',
    ])
  })

  it('enforces a minimum output size of 2000px on the long edge', async () => {
    const { canvas } = makeFakeCanvas()
    await exportSceneToPng(
      '<svg />',
      { titleText: 't', creditText: 'c', outputSize: 500 },
      {
        createImage: () => makeFakeImage(true),
        createCanvas: (width, height) => {
          canvas.width = width
          canvas.height = height
          return canvas
        },
        loadFonts: async () => {},
      },
    )
    expect(canvas.width).toBeGreaterThanOrEqual(2000)
  })
})
