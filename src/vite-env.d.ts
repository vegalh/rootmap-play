/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public Supabase project URL. Safe to expose in the frontend. */
  readonly VITE_SUPABASE_URL?: string
  /** Public Supabase anonymous (publishable) key. Safe to expose in the frontend. */
  readonly VITE_SUPABASE_ANON_KEY?: string
  /**
   * Master switch for sending analytics events to a real backend.
   * When unset or "false", the app always uses the no-op analytics provider.
   */
  readonly VITE_ENABLE_ANALYTICS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
