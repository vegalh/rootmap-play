/**
 * Minimal consent-awareness for analytics.
 *
 * RootMap Play never collects PII in analytics events, but we still ask for
 * consent before any event leaves the browser, so parents stay in control.
 * The no-op provider ignores consent entirely (nothing leaves the device).
 * Only providers that talk to a real backend (e.g. Supabase) must check it.
 */

const CONSENT_STORAGE_KEY = 'rootmap-play:analytics-consent'

export type ConsentStatus = 'accepted' | 'declined' | 'unknown'

function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

export function getConsentStatus(): ConsentStatus {
  if (!hasLocalStorage()) return 'unknown'
  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  if (raw === 'accepted' || raw === 'declined') return raw
  return 'unknown'
}

export function setConsentStatus(status: Exclude<ConsentStatus, 'unknown'>): void {
  if (!hasLocalStorage()) return
  window.localStorage.setItem(CONSENT_STORAGE_KEY, status)
}

export function hasAnalyticsConsent(): boolean {
  return getConsentStatus() === 'accepted'
}
