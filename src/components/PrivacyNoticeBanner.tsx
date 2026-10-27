import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getConsentStatus, setConsentStatus } from '../analytics'
import { t } from '../i18n'

/**
 * First-visit notice explaining anonymous product analytics. Shown until
 * the visitor accepts or declines; their choice gates whether the
 * (future) Supabase analytics provider is ever used — see
 * src/analytics/manager.ts.
 *
 * This app is client-rendered only (no SSR), so reading localStorage in
 * the lazy useState initializer is safe and avoids an extra render pass.
 */
export function PrivacyNoticeBanner() {
  const [isVisible, setIsVisible] = useState(() => getConsentStatus() === 'unknown')

  if (!isVisible) return null

  function respond(status: 'accepted' | 'declined') {
    setConsentStatus(status)
    setIsVisible(false)
  }

  return (
    <div
      role="region"
      aria-label={t.privacyNotice.learnMoreCta}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-800/10 bg-cream-50/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="max-w-3xl text-sm text-ink-700/85">
          {t.privacyNotice.body}{' '}
          <Link to="/privacy" className="font-medium text-ink-800 underline">
            {t.privacyNotice.learnMoreCta}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => respond('declined')}
            className="rounded-full px-4 py-2 text-sm font-medium text-ink-700 ring-1 ring-inset ring-ink-800/15 hover:bg-ink-800/5"
          >
            {t.privacyNotice.declineCta}
          </button>
          <button
            type="button"
            onClick={() => respond('accepted')}
            className="rounded-full bg-terracotta-500 px-4 py-2 text-sm font-medium text-cream-50 hover:bg-terracotta-600"
          >
            {t.privacyNotice.acceptCta}
          </button>
        </div>
      </div>
    </div>
  )
}
