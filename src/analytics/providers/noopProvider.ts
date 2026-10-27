import type { AnalyticsProvider } from '../types'

/**
 * Default analytics provider. Used whenever Supabase isn't configured, the
 * analytics backend flag is off, or the user hasn't given consent yet.
 *
 * It never sends data anywhere. In development it logs to the console so
 * the event flow is visible while building features — this is clearly a
 * development aid, not a stand-in for real user analytics.
 */
export function createNoopProvider(): AnalyticsProvider {
  return {
    id: 'noop',
    track(event, properties) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.debug('[rootmap-play][analytics:noop] (not sent anywhere)', event, properties)
      }
    },
  }
}
