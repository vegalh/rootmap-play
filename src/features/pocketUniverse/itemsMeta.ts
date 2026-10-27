/**
 * Plain-data catalogue of the 30 selectable things, kept free of React/JSX
 * so composition logic (`composition.ts`) can import it and stay a pure,
 * fast-to-test module. Visual rendering of each item lives in `items.tsx`.
 */

export const CATEGORIES = [
  { id: 'animals', label: '动物' },
  { id: 'nature', label: '自然' },
  { id: 'food', label: '美食' },
  { id: 'vehicles', label: '交通工具' },
  { id: 'toys', label: '玩具' },
  { id: 'magical', label: '奇幻' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

/** How prominently an item reads in the composed scene. */
export type ItemLayer = 'back' | 'mid' | 'front'

export interface ItemMeta {
  id: string
  category: CategoryId
  label: string
  layer: ItemLayer
  /** Per-item fine-tuning so visually large/small motifs balance each other. */
  baseScale: number
}

/**
 * Master order — deliberately stable and never reordered. Composition logic
 * uses this order as the tie-break when choosing which selected item
 * becomes the centerpiece, so the same five items always produce the same
 * centerpiece regardless of click order.
 */
export const ITEM_META: ItemMeta[] = [
  // Animals
  { id: 'dinosaur', category: 'animals', label: '恐龙', layer: 'front', baseScale: 1 },
  { id: 'cat', category: 'animals', label: '猫咪', layer: 'mid', baseScale: 0.95 },
  { id: 'dog', category: 'animals', label: '小狗', layer: 'mid', baseScale: 0.95 },
  { id: 'rabbit', category: 'animals', label: '兔子', layer: 'mid', baseScale: 0.9 },
  { id: 'panda', category: 'animals', label: '熊猫', layer: 'front', baseScale: 1 },
  // Nature
  { id: 'star', category: 'nature', label: '星星', layer: 'back', baseScale: 0.75 },
  { id: 'moon', category: 'nature', label: '月亮', layer: 'back', baseScale: 0.85 },
  { id: 'rainbow', category: 'nature', label: '彩虹', layer: 'back', baseScale: 1.1 },
  { id: 'cloud', category: 'nature', label: '云朵', layer: 'back', baseScale: 1 },
  { id: 'sun', category: 'nature', label: '太阳', layer: 'back', baseScale: 0.9 },
  // Food
  { id: 'strawberry', category: 'food', label: '草莓', layer: 'mid', baseScale: 0.7 },
  { id: 'ice-cream', category: 'food', label: '冰淇淋', layer: 'mid', baseScale: 0.85 },
  { id: 'cake', category: 'food', label: '蛋糕', layer: 'mid', baseScale: 0.9 },
  { id: 'apple', category: 'food', label: '苹果', layer: 'mid', baseScale: 0.7 },
  { id: 'lollipop', category: 'food', label: '棒棒糖', layer: 'mid', baseScale: 0.75 },
  // Vehicles
  { id: 'train', category: 'vehicles', label: '小火车', layer: 'mid', baseScale: 1 },
  { id: 'airplane', category: 'vehicles', label: '飞机', layer: 'mid', baseScale: 0.95 },
  { id: 'sailboat', category: 'vehicles', label: '帆船', layer: 'mid', baseScale: 0.95 },
  { id: 'hot-air-balloon', category: 'vehicles', label: '热气球', layer: 'back', baseScale: 1 },
  { id: 'car', category: 'vehicles', label: '小汽车', layer: 'mid', baseScale: 0.9 },
  // Toys
  { id: 'blocks', category: 'toys', label: '积木', layer: 'mid', baseScale: 0.85 },
  { id: 'balloon', category: 'toys', label: '气球', layer: 'back', baseScale: 0.85 },
  { id: 'pinwheel', category: 'toys', label: '风车', layer: 'mid', baseScale: 0.85 },
  { id: 'teddy-bear', category: 'toys', label: '泰迪熊', layer: 'front', baseScale: 0.95 },
  { id: 'spinning-top', category: 'toys', label: '陀螺', layer: 'mid', baseScale: 0.7 },
  // Magical
  { id: 'magic-wand', category: 'magical', label: '魔法棒', layer: 'mid', baseScale: 0.8 },
  { id: 'unicorn', category: 'magical', label: '独角兽', layer: 'front', baseScale: 1.05 },
  { id: 'castle', category: 'magical', label: '城堡', layer: 'back', baseScale: 1.1 },
  { id: 'fairy-wings', category: 'magical', label: '精灵翅膀', layer: 'mid', baseScale: 0.9 },
  { id: 'crystal-ball', category: 'magical', label: '水晶球', layer: 'mid', baseScale: 0.75 },
]

export const ITEM_ORDER: string[] = ITEM_META.map((item) => item.id)

export const ITEM_META_BY_ID: Record<string, ItemMeta> = Object.fromEntries(
  ITEM_META.map((item) => [item.id, item]),
)

export const LAYER_RANK: Record<ItemLayer, number> = { back: 1, mid: 2, front: 3 }
