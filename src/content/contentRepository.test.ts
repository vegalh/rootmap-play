import { describe, expect, it } from 'vitest'
import { demoContentRepository } from './contentRepository'

describe('demoContentRepository', () => {
  it('lists only published challenges, ordered by displayOrder', async () => {
    const challenges = await demoContentRepository.listPublishedChallenges()

    expect(challenges.every((challenge) => challenge.status === 'published')).toBe(true)
    expect(challenges.map((challenge) => challenge.slug)).toEqual(['pocket-universe', 'secret-room'])
    expect(challenges).not.toHaveLength(0)
  })

  it('resolves a published challenge by slug', async () => {
    const challenge = await demoContentRepository.getChallengeBySlug('pocket-universe')

    expect(challenge).toBeDefined()
    expect(challenge?.title).toBe('宝宝的口袋宇宙')
  })

  it('never resolves a draft challenge, even by its exact slug', async () => {
    const challenge = await demoContentRepository.getChallengeBySlug('life-movie-poster')

    expect(challenge).toBeUndefined()
  })

  it('resolves undefined for an unknown slug', async () => {
    const challenge = await demoContentRepository.getChallengeBySlug('does-not-exist')

    expect(challenge).toBeUndefined()
  })
})
