import { describe, expect, it } from 'vitest'
import { buildComposition, SCENE_SIZE } from './composition'

const FIVE_ITEMS = ['cat', 'star', 'cake', 'train', 'unicorn']

describe('buildComposition', () => {
  it('throws unless exactly five item ids are given', () => {
    expect(() => buildComposition(['cat'])).toThrow()
    expect(() => buildComposition([...FIVE_ITEMS, 'dog'])).toThrow()
  })

  it('is deterministic for the same ids and the same regenerate nonce', () => {
    const a = buildComposition(FIVE_ITEMS, 0)
    const b = buildComposition(FIVE_ITEMS, 0)
    expect(b).toEqual(a)
  })

  it('is independent of the order the parent selected items in', () => {
    const forward = buildComposition(FIVE_ITEMS, 0)
    const shuffled = buildComposition([...FIVE_ITEMS].reverse(), 0)
    expect(shuffled).toEqual(forward)
  })

  it('produces a different layout when the regenerate nonce changes', () => {
    const first = buildComposition(FIVE_ITEMS, 0)
    const second = buildComposition(FIVE_ITEMS, 1)
    expect(second).not.toEqual(first)
    // Regenerating keeps the same five items, so the same hero is picked.
    expect(second.heroItemId).toBe(first.heroItemId)
  })

  it('produces a different layout for a different set of items', () => {
    const a = buildComposition(FIVE_ITEMS, 0)
    const b = buildComposition(['dog', 'moon', 'apple', 'car', 'castle'], 0)
    expect(b.seed).not.toBe(a.seed)
  })

  it('always picks the same centerpiece for a given set regardless of click order', () => {
    // 'unicorn' is a "front" layer item, so it should out-rank the others.
    const a = buildComposition(FIVE_ITEMS, 0)
    expect(a.heroItemId).toBe('unicorn')
  })

  it('includes every selected item exactly once, with the hero present', () => {
    const plan = buildComposition(FIVE_ITEMS, 0)
    const ids = plan.placements.map((p) => p.itemId).sort()
    expect(ids).toEqual([...FIVE_ITEMS].sort())
    expect(plan.placements.filter((p) => p.isHero)).toHaveLength(1)
    expect(plan.placements.find((p) => p.isHero)?.itemId).toBe(plan.heroItemId)
  })

  it('keeps every placement comfortably inside the scene bounds', () => {
    const plan = buildComposition(FIVE_ITEMS, 0)
    for (const placement of plan.placements) {
      expect(placement.x).toBeGreaterThan(0)
      expect(placement.x).toBeLessThan(SCENE_SIZE)
      expect(placement.y).toBeGreaterThan(0)
      expect(placement.y).toBeLessThan(SCENE_SIZE)
    }
  })

  it('keeps stars away from the centerpiece so nothing overlaps awkwardly', () => {
    const plan = buildComposition(FIVE_ITEMS, 3)
    for (const star of plan.stars) {
      const distance = Math.hypot(star.x - SCENE_SIZE / 2, star.y - SCENE_SIZE / 2)
      expect(distance).toBeGreaterThan(100)
    }
  })
})
