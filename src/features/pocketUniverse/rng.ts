/**
 * Minimal deterministic PRNG utilities used to turn a parent's five
 * selections into a composition that is always the same for the same
 * inputs (testable, reproducible), while still looking hand-placed rather
 * than mechanically tiled.
 */

/** FNV-1a string hash — fast, deterministic, good enough distribution for seeding. */
export function hashStringToSeed(input: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/** mulberry32: tiny, fast, deterministic PRNG. Same seed -> same sequence, always. */
export function createRng(seed: number): () => number {
  let state = seed >>> 0
  return function next(): number {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Linear interpolation helper for mapping a 0..1 random draw into a range. */
export function rngRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min)
}
