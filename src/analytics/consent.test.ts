import { beforeEach, describe, expect, it } from 'vitest'
import { getConsentStatus, hasAnalyticsConsent, setConsentStatus } from './consent'

describe('analytics consent', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('defaults to unknown before any choice is made', () => {
    expect(getConsentStatus()).toBe('unknown')
    expect(hasAnalyticsConsent()).toBe(false)
  })

  it('persists an accepted choice', () => {
    setConsentStatus('accepted')
    expect(getConsentStatus()).toBe('accepted')
    expect(hasAnalyticsConsent()).toBe(true)
  })

  it('persists a declined choice', () => {
    setConsentStatus('declined')
    expect(getConsentStatus()).toBe('declined')
    expect(hasAnalyticsConsent()).toBe(false)
  })
})
