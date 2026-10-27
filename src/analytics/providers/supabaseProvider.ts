import { appConfig } from '../../config/env'
import type { AnalyticsProvider } from '../types'

/**
 * Forward-looking Supabase analytics provider.
 *
 * This is groundwork for PHASE 3 (backend). It intentionally does not use
 * the full supabase-js SDK yet — it posts directly to the PostgREST
 * `analytics_events` endpoint using the public anon key, which is the only
 * key ever allowed in frontend code. The service-role key must never be
 * used here or anywhere in this app.
 *
 * Until the `analytics_events` table and its insert policy exist (a PHASE 3
 * migration), every call will fail fast and silently — caught below — so
 * the public site is never affected even when this provider is selected.
 */
export function createSupabaseProvider(): AnalyticsProvider {
  const endpoint = appConfig.supabaseUrl
    ? `${appConfig.supabaseUrl.replace(/\/$/, '')}/rest/v1/analytics_events`
    : null

  return {
    id: 'supabase',
    track(event, properties) {
      if (!endpoint || !appConfig.supabaseAnonKey) return

      // Fire-and-forget: analytics must never block or break the UI.
      fetch(endpoint, {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          apikey: appConfig.supabaseAnonKey,
          Authorization: `Bearer ${appConfig.supabaseAnonKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          event_name: event,
          properties,
          occurred_at: new Date().toISOString(),
        }),
      }).catch((error: unknown) => {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn(
            '[rootmap-play][analytics:supabase] event not delivered (expected until PHASE 3 backend exists)',
            error,
          )
        }
      })
    },
  }
}
