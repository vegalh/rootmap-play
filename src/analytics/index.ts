export { analytics } from './manager'
export { usePageViewTracking } from './usePageViewTracking'
export { getConsentStatus, hasAnalyticsConsent, setConsentStatus } from './consent'
export type { ConsentStatus } from './consent'
export {
  ANALYTICS_EVENT_NAMES,
  LOW_RATING_REASONS,
  PRODUCT_IDS,
} from './events'
export type {
  AnalyticsEventName,
  AnalyticsEventPropertiesMap,
  LowRatingReason,
  ProductId,
} from './events'
export type { AnalyticsProvider } from './types'
