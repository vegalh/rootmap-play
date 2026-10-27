/**
 * Canonical analytics event catalogue for RootMap Play.
 *
 * These names and shapes are the single source of truth shared between the
 * frontend, the (future) Supabase ingestion table, and the admin dashboard.
 * See docs/ANALYTICS_EVENTS.md for the full specification.
 *
 * Hard rules enforced by the types below:
 * - No child names, photos, or other identifying details about a child.
 * - No WeChat / Xiaohongshu account identifiers.
 * - `productId` only ever identifies which product experience was used.
 */

export const PRODUCT_IDS = [
  'pocket-universe',
  'little-hero',
  'family-universe',
] as const

export type ProductId = (typeof PRODUCT_IDS)[number]

export const ANALYTICS_EVENT_NAMES = {
  PAGE_VIEW: 'page_view',
  PRODUCT_CARD_VIEW: 'product_card_view',
  PRODUCT_CLICK: 'product_click',
  CREATION_STARTED: 'creation_started',
  CREATION_COMPLETED: 'creation_completed',
  DOWNLOAD_CLICKED: 'download_clicked',
  DOWNLOAD_SUCCEEDED: 'download_succeeded',
  RATING_SUBMITTED: 'rating_submitted',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  COMMUNITY_INTEREST_SUBMITTED: 'community_interest_submitted',
} as const

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENT_NAMES)[keyof typeof ANALYTICS_EVENT_NAMES]

export interface PageViewProperties {
  path: string
  referrer?: string
}

export interface ProductCardViewProperties {
  productId: ProductId
  /** Position of the card within the grid it was shown in (1-based). */
  position?: number
}

export interface ProductClickProperties {
  productId: ProductId
  /** Where the click originated from, e.g. "home_grid" or "nav_menu". */
  source?: string
}

export interface CreationStartedProperties {
  productId: ProductId
}

export interface CreationCompletedProperties {
  productId: ProductId
  /** Time spent creating, in milliseconds, for understanding friction. */
  durationMs?: number
}

export interface DownloadClickedProperties {
  productId: ProductId
}

export interface DownloadSucceededProperties {
  productId: ProductId
}

export const LOW_RATING_REASONS = [
  '作品不够好看',
  '结果不够个性化',
  '操作太复杂',
  '不符合我的期待',
  '其他',
] as const

export type LowRatingReason = (typeof LOW_RATING_REASONS)[number]

export interface RatingSubmittedProperties {
  productId: ProductId
  /** 1-5 star rating. */
  rating: 1 | 2 | 3 | 4 | 5
}

export interface FeedbackSubmittedProperties {
  productId: ProductId
  rating: 1 | 2 | 3 | 4 | 5
  /** Only present for 1-3 star ratings, chosen from LOW_RATING_REASONS. */
  reason?: LowRatingReason
  /** Free-text comment. Users are instructed not to include personal info. */
  comment?: string
}

export interface CommunityInterestSubmittedProperties {
  /** Which optional interests the parent opted into (no contact info here). */
  interests: Array<'community' | 'product_testing' | 'suggestions'>
}

/** Maps each event name to its properties type for compile-time safety. */
export interface AnalyticsEventPropertiesMap {
  page_view: PageViewProperties
  product_card_view: ProductCardViewProperties
  product_click: ProductClickProperties
  creation_started: CreationStartedProperties
  creation_completed: CreationCompletedProperties
  download_clicked: DownloadClickedProperties
  download_succeeded: DownloadSucceededProperties
  rating_submitted: RatingSubmittedProperties
  feedback_submitted: FeedbackSubmittedProperties
  community_interest_submitted: CommunityInterestSubmittedProperties
}
