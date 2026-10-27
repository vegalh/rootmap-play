import { zhCN, type Translations } from './translations/zh-CN'

/**
 * Supported locales. Simplified Chinese is the only shipped locale today.
 *
 * To add English later:
 * 1. Create `translations/en.ts` exporting a const of the same shape as
 *    `Translations` (the compiler will enforce every key exists).
 * 2. Add `'en'` to `SUPPORTED_LOCALES` and register it in `translations`.
 * 3. Wire a locale switcher in the header once a second locale exists.
 */
export const SUPPORTED_LOCALES = ['zh-CN'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'zh-CN'

export const translations: Record<Locale, Translations> = {
  'zh-CN': zhCN,
}

export type { Translations } from './translations/zh-CN'

/**
 * Active dictionary for the current locale. Since only `zh-CN` ships today
 * this is resolved statically; once a second locale exists, replace this
 * with a React context that reads the visitor's preference.
 */
export const t: Translations = translations[DEFAULT_LOCALE]

/** Hook form, so components already written against a hook don't need to change later. */
export function useTranslations(): Translations {
  return t
}

