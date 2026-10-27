import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { analytics } from './manager'

describe('analytics manager', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    fetchSpy.mockRestore()
  })

  it('never throws when tracking an event', () => {
    expect(() => analytics.track('page_view', { path: '/' })).not.toThrow()
  })

  it('does not send any network request when Supabase is not configured', () => {
    // In the test environment VITE_SUPABASE_URL / VITE_ENABLE_ANALYTICS are
    // unset, so the manager must stay on the no-op provider.
    analytics.track('product_click', { productId: 'pocket-universe', source: 'home_grid' })
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
