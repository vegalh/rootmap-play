/**
 * Rasterizes the on-screen SVG scene into a high-resolution, branded PNG.
 *
 * Design choice: the SVG scene itself contains no text (see `SceneArt.tsx`),
 * so the only thing being rasterized from SVG->Image->canvas is shapes,
 * which always render identically regardless of font availability. The
 * Chinese title and RootMap credit are drawn afterwards directly with the
 * Canvas 2D API, after explicitly waiting for the page's web font to be
 * ready — the most reliable way to guarantee correct, non-tofu Chinese
 * glyphs in the exported image.
 *
 * All browser/canvas access is behind an injectable `deps` object so the
 * compositing and error-handling logic can be unit tested without a real
 * canvas/image backend (jsdom provides neither).
 */

export interface ExportSceneOptions {
  /** Long-edge output size in pixels. Must stay >= 2000 per spec. */
  outputSize?: number
  titleText: string
  creditText: string
}

export interface ExportSceneResult {
  ok: boolean
  blob?: Blob
  error?: 'image-load-failed' | 'canvas-unsupported' | 'encode-failed'
}

export interface ExportSceneDeps {
  createImage: () => HTMLImageElement
  createCanvas: (width: number, height: number) => HTMLCanvasElement
  loadFonts: () => Promise<void>
}

function createDefaultDeps(): ExportSceneDeps {
  return {
    createImage: () => new Image(),
    createCanvas: (width, height) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      return canvas
    },
    loadFonts: async () => {
      if (typeof document === 'undefined' || !('fonts' in document)) return
      try {
        await Promise.all([
          document.fonts.load('700 64px "Noto Sans SC"'),
          document.fonts.load('400 36px "Noto Sans SC"'),
          document.fonts.ready,
        ])
      } catch {
        // Font loading failing is not fatal — fillText falls back to the
        // browser/OS default sans-serif, which still supports CJK on every
        // platform our audience actually uses.
      }
    },
  }
}

function loadImageFromSvgMarkup(
  svgMarkup: string,
  createImage: () => HTMLImageElement,
): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = createImage()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`
  })
}

/** Serializes a live SVG DOM node exactly as shown on screen. */
export function serializeSvgElement(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  return new XMLSerializer().serializeToString(clone)
}

export async function exportSceneToPng(
  svgMarkup: string,
  options: ExportSceneOptions,
  overrides: Partial<ExportSceneDeps> = {},
): Promise<ExportSceneResult> {
  const deps: ExportSceneDeps = { ...createDefaultDeps(), ...overrides }
  const outputSize = Math.max(options.outputSize ?? 2000, 2000)

  const sceneImage = await loadImageFromSvgMarkup(svgMarkup, deps.createImage)
  if (!sceneImage) {
    return { ok: false, error: 'image-load-failed' }
  }

  await deps.loadFonts()

  const padding = Math.round(outputSize * 0.06)
  const titleBandHeight = Math.round(outputSize * 0.18)
  const canvas = deps.createCanvas(outputSize, outputSize + titleBandHeight)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return { ok: false, error: 'canvas-unsupported' }
  }

  // Cream matting, matching the on-screen ArtworkFrame presentation.
  ctx.fillStyle = '#FDFAF4'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const sceneBox = outputSize - padding * 2
  ctx.drawImage(sceneImage, padding, padding, sceneBox, sceneBox)

  const fontStack = '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillStyle = '#2B2219'
  ctx.font = `700 ${Math.round(outputSize * 0.045)}px ${fontStack}`
  ctx.fillText(options.titleText, outputSize / 2, outputSize + titleBandHeight * 0.4)

  ctx.fillStyle = 'rgba(43, 34, 25, 0.55)'
  ctx.font = `400 ${Math.round(outputSize * 0.022)}px ${fontStack}`
  ctx.fillText(options.creditText, outputSize / 2, outputSize + titleBandHeight * 0.72)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/png')
  })

  if (!blob) {
    return { ok: false, error: 'encode-failed' }
  }

  return { ok: true, blob }
}

/** Triggers a browser download for a generated blob, then cleans up the object URL. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
