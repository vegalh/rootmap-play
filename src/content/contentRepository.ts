/**
 * Content-access abstraction for the public exhibition (Phase 2).
 *
 * Every public page (the gallery homepage, the challenge detail page)
 * reads challenges through this module, never by importing
 * `demoChallenges.ts` directly. That's the one deliberate seam that lets a
 * later phase swap `demoContentRepository` for a Supabase-backed
 * implementation (querying `challenges`/`challenge_questions`/
 * `challenge_artworks`, see docs/SUPABASE_SCHEMA.md) without touching any
 * page or component — only this file and its tests would change.
 *
 * All methods are `Promise`-returning even though the demo implementation
 * resolves synchronously, so calling code already handles the
 * loading/error shape a real network-backed repository will need.
 */
import { DEMO_CHALLENGES } from './demoChallenges'
import type { Challenge } from './types'

export interface ContentRepository {
  /** Published challenges only, ordered for display (by `displayOrder`). */
  listPublishedChallenges(): Promise<Challenge[]>
  /**
   * A single challenge by its stable slug. Resolves `undefined` for an
   * unknown slug *and* for a draft slug — the public site must never
   * reveal unpublished content, matching the Supabase RLS policies
   * designed in Phase 1.
   */
  getChallengeBySlug(slug: string): Promise<Challenge | undefined>
}

function sortByDisplayOrder(challenges: Challenge[]): Challenge[] {
  return [...challenges].sort((a, b) => a.displayOrder - b.displayOrder)
}

/**
 * Local demo implementation, backed by the clearly-labeled mock fixtures
 * in `demoChallenges.ts`. This is what every public page uses today.
 */
export const demoContentRepository: ContentRepository = {
  async listPublishedChallenges() {
    return sortByDisplayOrder(DEMO_CHALLENGES.filter((challenge) => challenge.status === 'published'))
  },

  async getChallengeBySlug(slug) {
    const challenge = DEMO_CHALLENGES.find((candidate) => candidate.slug === slug)
    if (!challenge || challenge.status !== 'published') return undefined
    return challenge
  },
}

/**
 * The single instance every page/component should import. Swapping to a
 * live Supabase-backed repository later is a one-line change here.
 */
export const contentRepository: ContentRepository = demoContentRepository
