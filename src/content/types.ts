/**
 * Typed frontend mirror of the Supabase challenge-platform schema.
 *
 * These types describe the shape of data that will eventually come from
 * Supabase (see docs/SUPABASE_SCHEMA.md and supabase/migrations/) once the
 * frontend is wired up to it in Phase 2/3. Nothing in this module makes a
 * network call or assumes a backend is connected — it's pure type/data
 * modeling, consumed today only by src/content/demoChallenges.ts and
 * src/content/promptTemplate.ts and their tests.
 */

export type ChallengeStatus = 'draft' | 'published'

export type QuestionType = 'short_text' | 'long_text' | 'single_choice' | 'multiple_choice'

export const QUESTION_TYPES: readonly QuestionType[] = [
  'short_text',
  'long_text',
  'single_choice',
  'multiple_choice',
]

/** One selectable option for a single_choice/multiple_choice question. */
export interface QuestionOption {
  value: string
  label: string
}

/**
 * A single admin-defined question in a challenge's form.
 *
 * `questionKey` must match a `{{questionKey}}` placeholder used in the
 * parent challenge's `promptTemplate` (validated by
 * src/content/promptTemplate.ts, mirroring the `challenge_questions`
 * table's constraints).
 */
export interface ChallengeQuestion {
  id: string
  challengeId: string
  /** snake_case placeholder id, e.g. "favorite_things". */
  questionKey: string
  promptLabel: string
  helpText?: string
  questionType: QuestionType
  isRequired: boolean
  /** Required for single_choice/multiple_choice, absent for free-text types. */
  options?: QuestionOption[]
  /** Max answer length for free-text types. */
  maxLength: number
  displayOrder: number
}

/** Curated example artwork belonging to a challenge. */
export interface ChallengeArtwork {
  id: string
  challengeId: string
  /** Path within the private `challenge-artwork` storage bucket. */
  storagePath: string
  title?: string
  caption?: string
  /** Always required — accessibility is not optional. */
  altText: string
  isFeatured: boolean
  displayOrder: number
}

/** A single creative challenge, with its question form and example artwork. */
export interface Challenge {
  id: string
  /** Stable, URL-safe identifier used in shareable links. */
  slug: string
  title: string
  teaser: string
  description: string
  styleNotes?: string
  /** Named-placeholder template, e.g. "...：{{favorite_things}}。". */
  promptTemplate: string
  ctaLabel: string
  status: ChallengeStatus
  displayOrder: number
  questions: ChallengeQuestion[]
  artworks: ChallengeArtwork[]
}

/** Input shape for submitting voluntary feedback (mirrors `feedback_submissions`). */
export interface FeedbackSubmissionInput {
  challengeId?: string
  rating: 1 | 2 | 3 | 4 | 5
  lowRatingReason?: string
  comment?: string
  childAgeRange?: '0-2' | '2-3' | '3-4' | '4-6' | 'other'
  futureTopicSuggestion?: string
  visitorId?: string
}

/** Input shape for the optional community-interest questionnaire (mirrors `community_interest_submissions`). */
export interface CommunityInterestSubmissionInput {
  feedbackSubmissionId?: string
  wantsCommunity: boolean
  contactPlatform: 'wechat' | 'xiaohongshu' | 'none'
  contactHandle?: string
  /** Must be explicitly true (no prechecked boxes) whenever contactHandle is set. */
  contactConsentGiven: boolean
}
