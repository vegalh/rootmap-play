import { ITEM_META_BY_ID, ITEM_ORDER, LAYER_RANK } from './itemsMeta'
import { createRng, hashStringToSeed, rngRange } from './rng'

/** Scene coordinate space. Everything below is expressed in these units. */
export const SCENE_SIZE = 600
export const SCENE_CENTER = SCENE_SIZE / 2

export interface ItemPlacement {
  itemId: string
  x: number
  y: number
  scale: number
  rotationDeg: number
  isHero: boolean
}

export interface RingPlan {
  rx: number
  ry: number
  rotationDeg: number
}

export interface StarPlan {
  x: number
  y: number
  r: number
}

export interface CompositionPlan {
  seed: number
  heroItemId: string
  /** Back-to-front draw order; render in this order so depth reads correctly. */
  placements: ItemPlacement[]
  ring: RingPlan
  stars: StarPlan[]
}

const HERO_SCALE = 1.65
const ORBIT_DEPTH_SCALE: Record<'back' | 'mid' | 'front', number> = {
  back: 0.52,
  mid: 0.72,
  front: 0.92,
}
const BASE_ANGLES_DEG = [-90, 0, 90, 180]
const CENTER_EXCLUSION_RADIUS = 150
const MAX_STAR_ATTEMPTS = 20

function pickHero(selectedIds: string[]): string {
  let best = selectedIds[0]
  let bestRank = -1
  let bestOrderIndex = Number.POSITIVE_INFINITY

  for (const id of selectedIds) {
    const meta = ITEM_META_BY_ID[id]
    const rank = meta ? LAYER_RANK[meta.layer] : 0
    const orderIndex = ITEM_ORDER.indexOf(id)
    if (rank > bestRank || (rank === bestRank && orderIndex < bestOrderIndex)) {
      best = id
      bestRank = rank
      bestOrderIndex = orderIndex
    }
  }

  return best
}

/**
 * Deterministically builds a layout for exactly five selected item ids.
 *
 * The same five ids (in any click order) plus the same `regenerateNonce`
 * always produce the identical plan — this keeps the composer testable and
 * means "regenerate" is an honest re-roll rather than hidden randomness.
 */
export function buildComposition(selectedItemIds: string[], regenerateNonce = 0): CompositionPlan {
  if (selectedItemIds.length !== 5) {
    throw new Error(`buildComposition requires exactly 5 item ids, received ${selectedItemIds.length}`)
  }

  const sortedIds = [...selectedItemIds].sort()
  const seed = hashStringToSeed(`${sortedIds.join('|')}::${regenerateNonce}`)
  const rng = createRng(seed)

  const heroItemId = pickHero(selectedItemIds)
  const orbiterIds = selectedItemIds
    .filter((id) => id !== heroItemId)
    .sort((a, b) => ITEM_ORDER.indexOf(a) - ITEM_ORDER.indexOf(b))

  const ring: RingPlan = {
    rx: rngRange(rng, 185, 230),
    ry: rngRange(rng, 68, 98),
    rotationDeg: rngRange(rng, -8, 8),
  }
  const rotationRad = (ring.rotationDeg * Math.PI) / 180

  const placements: ItemPlacement[] = orbiterIds.map((itemId, index) => {
    const meta = ITEM_META_BY_ID[itemId]
    const jitterDeg = rngRange(rng, -14, 14)
    const angleDeg = BASE_ANGLES_DEG[index % BASE_ANGLES_DEG.length] + jitterDeg
    const angleRad = (angleDeg * Math.PI) / 180
    const radiusScaleX = rngRange(rng, 0.85, 1.15)
    const radiusScaleY = rngRange(rng, 0.85, 1.15)

    const rawX = ring.rx * radiusScaleX * Math.cos(angleRad)
    const rawY = ring.ry * radiusScaleY * Math.sin(angleRad)
    const x = SCENE_CENTER + rawX * Math.cos(rotationRad) - rawY * Math.sin(rotationRad)
    const y = SCENE_CENTER + rawX * Math.sin(rotationRad) + rawY * Math.cos(rotationRad)

    const depthScale = meta ? ORBIT_DEPTH_SCALE[meta.layer] : 0.7
    const baseScale = meta?.baseScale ?? 1
    const sizeJitter = rngRange(rng, 0.94, 1.06)

    return {
      itemId,
      x,
      y,
      scale: depthScale * baseScale * sizeJitter,
      rotationDeg: rngRange(rng, -12, 12),
      isHero: false,
    }
  })

  const heroMeta = ITEM_META_BY_ID[heroItemId]
  const heroPlacement: ItemPlacement = {
    itemId: heroItemId,
    x: SCENE_CENTER,
    y: SCENE_CENTER + rngRange(rng, -6, 10),
    scale: HERO_SCALE * (heroMeta?.baseScale ?? 1),
    rotationDeg: rngRange(rng, -4, 4),
    isHero: true,
  }

  const starCount = Math.round(rngRange(rng, 9, 14))
  const stars: StarPlan[] = []
  for (let i = 0; i < starCount; i += 1) {
    let x = 0
    let y = 0
    for (let attempt = 0; attempt < MAX_STAR_ATTEMPTS; attempt += 1) {
      x = rngRange(rng, 40, SCENE_SIZE - 40)
      y = rngRange(rng, 40, SCENE_SIZE - 40)
      const distanceFromCenter = Math.hypot(x - SCENE_CENTER, y - SCENE_CENTER)
      if (distanceFromCenter > CENTER_EXCLUSION_RADIUS) break
    }
    stars.push({ x, y, r: rngRange(rng, 1.6, 3.4) })
  }

  return {
    seed,
    heroItemId,
    placements: [...placements, heroPlacement],
    ring,
    stars,
  }
}
