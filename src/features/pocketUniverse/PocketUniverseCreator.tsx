import { useRef, useState } from 'react'
import { analytics } from '../../analytics'
import { FeedbackPrompt } from '../../components/FeedbackPrompt'
import { LinkButton } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { t } from '../../i18n'
import { buildComposition } from './composition'
import { downloadBlob, exportSceneToPng, serializeSvgElement } from './svgExport'
import { ItemPicker } from './ItemPicker'
import { SceneArt } from './SceneArt'
import { DEFAULT_THEME_ID, SCENE_THEMES } from './themes'

const PRODUCT_ID = 'pocket-universe'

type Phase = 'select' | 'preview'
type DownloadState = 'idle' | 'working' | 'done' | 'error'

/**
 * Orchestrates the full Pocket Universe journey: pick 5 things -> preview
 * the generated scene (with theme + regenerate + edit controls) -> export
 * a high-resolution PNG -> optional post-download rating. Nothing past the
 * download step is required, matching the "five-minute experience" brief.
 */
export function PocketUniverseCreator() {
  const [phase, setPhase] = useState<Phase>('select')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID)
  const [regenerateNonce, setRegenerateNonce] = useState(0)
  const [downloadState, setDownloadState] = useState<DownloadState>('idle')

  const firstInteractionRef = useRef<number | null>(null)
  const sceneRef = useRef<SVGSVGElement>(null)

  function handleToggle(id: string) {
    if (firstInteractionRef.current === null) {
      firstInteractionRef.current = Date.now()
    }
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((existing) => existing !== id)
      if (current.length >= 5) return current
      return [...current, id]
    })
  }

  function handleContinue() {
    if (selectedIds.length !== 5) return
    analytics.track('creation_started', { productId: PRODUCT_ID })
    setPhase('preview')
    setDownloadState('idle')
    const durationMs = firstInteractionRef.current ? Date.now() - firstInteractionRef.current : undefined
    analytics.track('creation_completed', { productId: PRODUCT_ID, durationMs })
  }

  function handleEditSelections() {
    setPhase('select')
  }

  function handleRegenerate() {
    setRegenerateNonce((current) => current + 1)
  }

  async function handleDownload() {
    const svg = sceneRef.current
    if (!svg) return
    analytics.track('download_clicked', { productId: PRODUCT_ID })
    setDownloadState('working')

    const markup = serializeSvgElement(svg)
    const result = await exportSceneToPng(markup, {
      titleText: t.pocketUniverseCreator.previewTitle,
      creditText: t.pocketUniverseCreator.previewCredit,
    })

    if (!result.ok || !result.blob) {
      setDownloadState('error')
      return
    }

    downloadBlob(result.blob, 'rootmap-play-pocket-universe.png')
    analytics.track('download_succeeded', { productId: PRODUCT_ID })
    setDownloadState('done')
  }

  if (phase === 'select') {
    return (
      <Container className="flex flex-col gap-6 py-8 sm:py-10">
        <LinkButton to="/" variant="ghost" className="self-start">
          ← {t.common.backHome}
        </LinkButton>
        <h1 className="sr-only">{t.products.pocketUniverse.name}</h1>
        <ItemPicker selectedIds={selectedIds} onToggle={handleToggle} onContinue={handleContinue} />
      </Container>
    )
  }

  const theme = SCENE_THEMES.find((candidate) => candidate.id === themeId) ?? SCENE_THEMES[0]
  const plan = buildComposition(selectedIds, regenerateNonce)

  return (
    <Container className="flex flex-col items-center gap-6 py-8 text-center sm:py-10">
      <button
        type="button"
        onClick={handleEditSelections}
        className="self-start text-sm font-medium text-ink-700/70 hover:text-ink-800"
      >
        {t.pocketUniverseCreator.editSelectionCta}
      </button>

      <div className="w-full max-w-sm -rotate-1 rounded-[28px] bg-cream-50 p-3 shadow-[var(--shadow-soft)] ring-1 ring-ink-800/5 sm:max-w-md sm:p-4">
        <div className="aspect-square w-full overflow-hidden rounded-2xl">
          <SceneArt ref={sceneRef} plan={plan} theme={theme} className="h-full w-full" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-balance text-2xl font-medium sm:text-3xl">{t.products.pocketUniverse.name}</h1>
      </div>

      <div className="flex items-center gap-2" role="radiogroup" aria-label={t.pocketUniverseCreator.themeLabel}>
        {SCENE_THEMES.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            role="radio"
            aria-checked={candidate.id === themeId}
            aria-label={candidate.label}
            onClick={() => setThemeId(candidate.id)}
            className={`h-8 w-8 rounded-full border-2 transition-transform duration-150 ${
              candidate.id === themeId ? 'border-terracotta-500 scale-110' : 'border-transparent'
            }`}
            style={{ background: `linear-gradient(135deg, ${candidate.skyFrom}, ${candidate.skyTo})` }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleRegenerate}
          className="rounded-full bg-cream-100 px-4 py-2 text-sm font-medium text-ink-700/80 hover:bg-cream-200"
        >
          {t.pocketUniverseCreator.regenerateCta}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloadState === 'working'}
          className="rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-medium text-cream-50 shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {downloadState === 'working'
            ? t.pocketUniverseCreator.downloadingCta
            : t.pocketUniverseCreator.downloadCta}
        </button>
      </div>

      {downloadState === 'error' && (
        <p role="alert" className="text-sm text-terracotta-600">
          {t.pocketUniverseCreator.downloadErrorMessage}
        </p>
      )}
      {downloadState === 'done' && (
        <p className="text-sm text-pine-600">{t.pocketUniverseCreator.downloadSuccessMessage}</p>
      )}

      {downloadState === 'done' && <FeedbackPrompt productId={PRODUCT_ID} />}
    </Container>
  )
}
