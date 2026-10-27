import type { AnalyticsEventPropertiesMap } from './events'

/**
 * Contract every analytics provider must implement. Providers must never
 * throw — failures should be caught and logged internally so the public
 * site keeps working even if analytics is misconfigured or offline.
 */
export interface AnalyticsProvider {
  /** Human-readable id used in debug logs, e.g. "noop" or "supabase". */
  readonly id: string
  track<E extends keyof AnalyticsEventPropertiesMap>(
    event: E,
    properties: AnalyticsEventPropertiesMap[E],
  ): void
}
