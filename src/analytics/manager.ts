import { appConfig } from '../config/env'
import { hasAnalyticsConsent } from './consent'
import type { AnalyticsEventPropertiesMap } from './events'
import { createNoopProvider } from './providers/noopProvider'
import { createSupabaseProvider } from './providers/supabaseProvider'
import type { AnalyticsProvider } from './types'

/**
 * Selects and owns the active analytics provider.
 *
 * Selection rules:
 * - Always use the no-op provider unless the backend is both configured
 *   (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY) and explicitly enabled
 *   (VITE_ENABLE_ANALYTICS=true).
 * - Even then, only forward events once the visitor has accepted the
 *   privacy notice. Declining or not having answered yet keeps everything
 *   local (no-op).
 */
class AnalyticsManager {
  private readonly noopProvider: AnalyticsProvider = createNoopProvider()
  private backendProvider: AnalyticsProvider | null = null

  private getActiveProvider(): AnalyticsProvider {
    if (!appConfig.isAnalyticsBackendEnabled) return this.noopProvider
    if (!hasAnalyticsConsent()) return this.noopProvider

    if (!this.backendProvider) {
      this.backendProvider = createSupabaseProvider()
    }
    return this.backendProvider
  }

  track<E extends keyof AnalyticsEventPropertiesMap>(
    event: E,
    properties: AnalyticsEventPropertiesMap[E],
  ): void {
    try {
      this.getActiveProvider().track(event, properties)
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[rootmap-play][analytics] track() failed, ignoring', event, error)
      }
    }
  }
}

/** Singleton analytics manager for the whole app. */
export const analytics = new AnalyticsManager()
