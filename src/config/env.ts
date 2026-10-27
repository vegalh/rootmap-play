/**
 * Centralised, typed access to build-time environment configuration.
 *
 * Nothing here is ever required for the public site to function. All
 * Supabase-related values are optional and, when absent, every dependent
 * feature (analytics ingestion, admin auth) degrades to a safe,
 * clearly-labelled "not configured" state instead of throwing.
 */

export interface AppConfig {
  /** Public Supabase project URL, if configured. */
  supabaseUrl: string | null
  /** Public Supabase anonymous key, if configured. Never the service-role key. */
  supabaseAnonKey: string | null
  /** Whether Supabase is configured well enough to attempt real network calls. */
  isSupabaseConfigured: boolean
  /** Whether sending analytics to a real backend is both configured and enabled. */
  isAnalyticsBackendEnabled: boolean
}

function readEnvString(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

const supabaseUrl = readEnvString(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = readEnvString(import.meta.env.VITE_SUPABASE_ANON_KEY)
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
const analyticsFlag = (import.meta.env.VITE_ENABLE_ANALYTICS ?? '').trim().toLowerCase()

export const appConfig: AppConfig = {
  supabaseUrl,
  supabaseAnonKey,
  isSupabaseConfigured,
  isAnalyticsBackendEnabled: isSupabaseConfigured && analyticsFlag === 'true',
}
