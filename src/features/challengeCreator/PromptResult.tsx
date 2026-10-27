import { useState } from 'react'
import { analytics } from '../../analytics'
import { AnchorButton } from '../../components/ui/Button'
import { t } from '../../i18n'

interface PromptResultProps {
  challengeSlug: string
  prompt: string
  onEditAnswers: () => void
}

const CHATGPT_URL = 'https://chat.openai.com/'

/**
 * Presents the resolved prompt like a finished creative note — never a
 * generated image, since RootMap Play never calls an image-generation
 * API (Phase 2 brief §7). The parent always does the actual creation
 * themselves in ChatGPT; this component only ever copies plain text to
 * the clipboard and opens a fresh ChatGPT tab, it never transmits the
 * prompt or the parent's answers anywhere.
 */
export function PromptResult({ challengeSlug, prompt, onEditAnswers }: PromptResultProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    analytics.track('prompt_copied', { challengeSlug })
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard access can be denied/unavailable (older browsers, some
      // in-app webviews) — the prompt text is still fully visible and
      // selectable, so this fails quietly rather than blocking the parent.
    }
  }

  function handleOpenChatGpt() {
    analytics.track('chatgpt_outbound_clicked', { challengeSlug })
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <h2 className="text-balance text-xl font-medium sm:text-2xl">{t.challenge.resultHeading}</h2>

      <div className="bg-paper-grain w-full rounded-2xl border border-ink-800/10 bg-cream-100 p-5 text-left shadow-[var(--shadow-card)] sm:p-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-800 sm:text-base">{prompt}</p>
      </div>

      <p className="max-w-sm text-balance text-xs text-ink-700/60">{t.challenge.resultExplanation}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full bg-terracotta-500 px-6 py-3 text-sm font-medium text-cream-50 shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-terracotta-600"
        >
          {copied ? t.challenge.copiedCta : t.challenge.copyCta}
        </button>
        <AnchorButton
          href={CHATGPT_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          onClick={handleOpenChatGpt}
        >
          {t.challenge.openChatGptCta}
        </AnchorButton>
      </div>

      <button
        type="button"
        onClick={onEditAnswers}
        className="text-sm font-medium text-ink-700/70 hover:text-ink-800"
      >
        {t.challenge.editAnswersCta}
      </button>

      <p className="max-w-sm text-balance text-[11px] text-ink-700/45">{t.challenge.disclaimer}</p>
    </div>
  )
}
