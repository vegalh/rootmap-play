import { LogoMark } from './illustrations/LogoMark'

type ArtworkAspect = 'portrait' | 'square' | 'landscape'

interface ArtworkPlaceholderProps {
  /** Describes the real artwork this will become — shown as a caption, never invented as if it already existed. */
  altText: string
  aspect?: ArtworkAspect
  size?: 'hero' | 'compact'
  /** Give repeated placeholders in a gallery a slightly different tilt so the wall doesn't look mechanically identical. */
  rotate?: 'left' | 'right' | 'none'
  className?: string
}

const ASPECT_CLASSES: Record<ArtworkAspect, string> = {
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
}

const ROTATE_CLASSES: Record<NonNullable<ArtworkPlaceholderProps['rotate']>, string> = {
  left: '-rotate-2',
  right: 'rotate-1',
  none: '',
}

/**
 * Honestly marks a frame as "real artwork goes here" rather than faking a
 * finished illustration. Until real example artwork is supplied, every
 * gallery/challenge-detail image slot renders one of these: a warm,
 * framed, paper-textured card with a visible "待替换" (to be replaced)
 * stamp and the intended artwork's description (`altText`), so replacing
 * it later is a single data change, not a redesign.
 */
export function ArtworkPlaceholder({
  altText,
  aspect = 'square',
  size = 'hero',
  rotate = 'none',
  className = '',
}: ArtworkPlaceholderProps) {
  const frameSize = size === 'hero' ? 'max-w-sm sm:max-w-md' : 'max-w-[15rem] sm:max-w-xs'

  return (
    <div
      className={`group relative mx-auto w-full ${frameSize} ${ROTATE_CLASSES[rotate]} rounded-[28px] bg-cream-50 p-3 shadow-[var(--shadow-soft)] ring-1 ring-ink-800/5 transition-transform duration-300 hover:rotate-0 sm:p-4 ${className}`}
    >
      <div
        role="img"
        aria-label={`示例插画占位：${altText}`}
        className={`bg-paper-grain relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-ink-800/15 bg-gradient-to-br from-cream-100 via-cream-100 to-gold-400/25 p-4 text-center ${ASPECT_CLASSES[aspect]}`}
      >
        <LogoMark className="h-7 w-7 opacity-50 sm:h-8 sm:w-8" />
        <p className="text-xs font-medium tracking-wide text-ink-700/70">示例插画 · 待替换</p>
        <p className="max-w-[80%] text-[11px] leading-snug text-ink-700/50">{altText}</p>
      </div>
    </div>
  )
}
