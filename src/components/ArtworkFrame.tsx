import type { ComponentType } from 'react'
import { LogoMark } from './illustrations/LogoMark'

interface ArtworkFrameProps {
  illustration: ComponentType<{ className?: string }>
  caption?: string
  size?: 'hero' | 'compact'
  className?: string
}

/**
 * Presents an illustration like a printed art card — the beautiful,
 * collectible-feeling artifact a parent would actually want to save or
 * share, rather than a generic app screenshot. Used for the homepage hero
 * preview and the product entry pages.
 *
 * The small corner stamp mirrors the real RootMap branding that will
 * appear on exported artwork; the caption makes clear this specific image
 * is a sample, since the real creation flow isn't implemented yet.
 */
export function ArtworkFrame({
  illustration: Illustration,
  caption,
  size = 'hero',
  className = '',
}: ArtworkFrameProps) {
  const frameSize = size === 'hero' ? 'max-w-sm sm:max-w-md' : 'max-w-[15rem] sm:max-w-xs'

  return (
    <div className={`mx-auto flex w-full flex-col items-center gap-3 ${frameSize} ${className}`}>
      <div className="group relative w-full -rotate-2 rounded-[28px] bg-cream-50 p-3 shadow-[var(--shadow-soft)] ring-1 ring-ink-800/5 transition-transform duration-300 hover:rotate-0 sm:p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
          <Illustration className="h-full w-full" />
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-cream-50/90 px-2.5 py-1 text-[10px] font-medium text-ink-800 shadow-sm">
            <LogoMark className="h-3 w-3" />
            RootMap
          </span>
        </div>
      </div>
      {caption ? <p className="text-xs tracking-wide text-ink-700/45">{caption}</p> : null}
    </div>
  )
}
