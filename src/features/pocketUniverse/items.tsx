import type { ReactNode } from 'react'
import { CATEGORIES, ITEM_META, type CategoryId, type ItemLayer } from './itemsMeta'
import { PALETTE } from './palette'

export { CATEGORIES }
export type { CategoryId, ItemLayer }

export interface PocketItem {
  id: string
  category: CategoryId
  label: string
  layer: ItemLayer
  baseScale: number
  /** Pure SVG primitives (no own <svg>/defs) laid out in a 0..100 box. */
  render: () => ReactNode
}

const P = PALETTE

/** Simple dot eye, reused across most creature icons for a consistent look. */
function Eye({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={2.4} fill={P.ink} />
}

const RENDERERS: Record<string, () => ReactNode> = {
  // ---------- Animals ----------
  dinosaur: () => (
    <>
      <path
        d="M30 78c0-10 4-16 4-22 0-9 7-17 17-17 6 0 10 3 13 7 3-5 8-9 15-9 11 0 18 9 18 20 0 7-3 11-3 16 7 2 12 7 12 13 0 8-7 13-15 13h-5l3 11h-11l-3-10h-14l2 10h-11l-2-10c-5-1-9-5-9-10Z"
        fill={P.terracottaLight}
      />
      <path
        d="M50 39c3-4 6-5 9-5M62 36c2-3 5-4 8-3"
        stroke={P.pineDeep}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <Eye cx={55} cy={50} />
    </>
  ),
  cat: () => (
    <>
      <path d="M34 30 24 14l14 8Z" fill={P.terracotta} />
      <path d="M66 30 76 14 62 22Z" fill={P.terracotta} />
      <circle cx={50} cy={52} r={28} fill={P.terracotta} />
      <Eye cx={41} cy={50} />
      <Eye cx={59} cy={50} />
      <path d="M50 58l-3 3M50 58l3 3" stroke={P.pineDeep} strokeWidth={2} strokeLinecap="round" />
      <path
        d="M26 58h-12M26 62h-12M74 58h12M74 62h12"
        stroke={P.ink}
        strokeOpacity={0.4}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </>
  ),
  dog: () => (
    <>
      <ellipse cx={28} cy={46} rx={11} ry={17} fill={P.gold} />
      <ellipse cx={72} cy={46} rx={11} ry={17} fill={P.gold} />
      <circle cx={50} cy={54} r={27} fill={P.goldLight} />
      <Eye cx={41} cy={52} />
      <Eye cx={59} cy={52} />
      <ellipse cx={50} cy={64} rx={6} ry={4} fill={P.pineDeep} />
    </>
  ),
  rabbit: () => (
    <>
      <path d="M34 36c-4-16 2-26 8-26s7 14 5 28Z" fill={P.creamSoft} />
      <path d="M66 36c4-16-2-26-8-26s-7 14-5 28Z" fill={P.creamSoft} />
      <circle cx={50} cy={56} r={26} fill={P.cream} />
      <Eye cx={42} cy={54} />
      <Eye cx={58} cy={54} />
      <path d="M46 63c2 2 6 2 8 0" stroke={P.terracotta} strokeWidth={2} strokeLinecap="round" fill="none" />
    </>
  ),
  panda: () => (
    <>
      <circle cx={50} cy={54} r={28} fill={P.cream} />
      <circle cx={28} cy={30} r={9} fill={P.ink} />
      <circle cx={72} cy={30} r={9} fill={P.ink} />
      <ellipse cx={40} cy={52} rx={7} ry={9} fill={P.ink} />
      <ellipse cx={60} cy={52} rx={7} ry={9} fill={P.ink} />
      <circle cx={40} cy={52} r={2.2} fill={P.cream} />
      <circle cx={60} cy={52} r={2.2} fill={P.cream} />
      <ellipse cx={50} cy={66} rx={4} ry={3} fill={P.ink} />
    </>
  ),

  // ---------- Nature ----------
  star: () => (
    <path
      d="M50 16l9.5 21.5L83 40l-17 16 4.7 23L50 67.5 29.3 79.5 34 56.5 17 40.5l23.5-2.5Z"
      fill={P.gold}
    />
  ),
  moon: () => (
    <>
      <path d="M62 20c-18 4-28 20-22 36 7 17 27 24 42 16-20 1-37-16-34-36 2-10 8-14 14-16Z" fill={P.goldLight} />
      <circle cx={34} cy={66} r={2} fill={P.goldLight} />
      <circle cx={30} cy={56} r={1.4} fill={P.goldLight} />
    </>
  ),
  rainbow: () => (
    <>
      <path d="M12 74c0-24 17-42 38-42s38 18 38 42" fill="none" stroke={P.terracotta} strokeWidth={8} strokeLinecap="round" />
      <path d="M22 74c0-18 13-32 28-32s28 14 28 32" fill="none" stroke={P.gold} strokeWidth={8} strokeLinecap="round" />
      <path d="M32 74c0-12 9-22 18-22s18 10 18 22" fill="none" stroke={P.pineLight} strokeWidth={8} strokeLinecap="round" />
      <ellipse cx={14} cy={76} rx={9} ry={6} fill={P.cream} />
      <ellipse cx={86} cy={76} rx={9} ry={6} fill={P.cream} />
    </>
  ),
  cloud: () => (
    <>
      <ellipse cx={38} cy={58} rx={20} ry={15} fill={P.cream} />
      <ellipse cx={62} cy={54} rx={22} ry={17} fill={P.cream} />
      <ellipse cx={50} cy={66} rx={28} ry={13} fill={P.cream} />
    </>
  ),
  sun: () => (
    <>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4
        const x = 50 + Math.cos(angle) * 34
        const y = 50 + Math.sin(angle) * 34
        return <ellipse key={i} cx={x} cy={y} rx={6} ry={3.2} fill={P.goldLight} transform={`rotate(${(i * 45)} ${x} ${y})`} />
      })}
      <circle cx={50} cy={50} r={20} fill={P.gold} />
    </>
  ),

  // ---------- Food ----------
  strawberry: () => (
    <>
      <path d="M50 34c16 0 26 13 26 27 0 16-15 30-26 30s-26-14-26-30c0-14 10-27 26-27Z" fill={P.terracotta} />
      <path d="M50 34l-8-10M50 34l0-12M50 34l8-10" stroke={P.pineLight} strokeWidth={3} strokeLinecap="round" />
      <g fill={P.cream} opacity={0.8}>
        <circle cx={40} cy={54} r={1.8} />
        <circle cx={58} cy={50} r={1.8} />
        <circle cx={50} cy={64} r={1.8} />
        <circle cx={38} cy={70} r={1.8} />
        <circle cx={62} cy={68} r={1.8} />
      </g>
    </>
  ),
  'ice-cream': () => (
    <>
      <path d="M38 52l12 38 12-38Z" fill={P.terracottaLight} />
      <path
        d="M38 52h24M41 60h18M44 68h12"
        stroke={P.terracotta}
        strokeWidth={1.4}
      />
      <circle cx={50} cy={40} r={18} fill={P.cream} />
      <circle cx={50} cy={24} r={7} fill={P.berry} />
    </>
  ),
  cake: () => (
    <>
      <rect x={26} y={56} width={48} height={20} rx={4} fill={P.terracotta} />
      <rect x={32} y={40} width={36} height={18} rx={4} fill={P.goldLight} />
      <path d="M26 56c6-4 10 4 16 0s10 4 16 0 10 4 16 0v4H26Z" fill={P.cream} />
      <rect x={47} y={24} width={4} height={12} rx={1.5} fill={P.pineLight} />
      <path d="M49 24c-2-4 2-6 0-10 3 3 4 7 1 10Z" fill={P.gold} />
    </>
  ),
  apple: () => (
    <>
      <path
        d="M50 40c12-10 28-4 28 14 0 16-13 28-28 28S22 70 22 54c0-18 16-24 28-14Z"
        fill={P.terracotta}
      />
      <path d="M50 40c-2-6 0-11 4-14" stroke={P.pineLight} strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M52 28c5-2 9 0 11 4-5 1-9-1-11-4Z" fill={P.pineLight} />
    </>
  ),
  lollipop: () => (
    <>
      <path d="M50 74v16" stroke={P.cream} strokeWidth={4} strokeLinecap="round" />
      <circle cx={50} cy={46} r={26} fill={P.berryLight} />
      <path
        d="M50 46m-18 0a18 18 0 1 0 36 0a13 13 0 1 1 -26 0a8 8 0 1 0 16 0"
        fill="none"
        stroke={P.berry}
        strokeWidth={3}
      />
    </>
  ),

  // ---------- Vehicles ----------
  train: () => (
    <>
      <rect x={18} y={48} width={28} height={24} rx={5} fill={P.terracotta} />
      <rect x={50} y={36} width={32} height={36} rx={6} fill={P.pineLight} />
      <rect x={58} y={26} width={10} height={12} rx={2} fill={P.pineLight} />
      <circle cx={60} cy={20} r={6} fill={P.cream} opacity={0.7} />
      <circle cx={28} cy={76} r={6} fill={P.ink} />
      <circle cx={42} cy={76} r={6} fill={P.ink} />
      <circle cx={62} cy={76} r={6} fill={P.ink} />
      <circle cx={76} cy={76} r={6} fill={P.ink} />
      <rect x={56} y={46} width={10} height={10} rx={2} fill={P.cream} />
      <rect x={70} y={46} width={10} height={10} rx={2} fill={P.cream} />
    </>
  ),
  airplane: () => (
    <>
      <path d="M14 56l70-10c6-1 10 3 8 8l-4 6-70 8Z" fill={P.dusk} />
      <path d="M46 54l10-22 8-2-4 24Z" fill={P.duskLight} />
      <path d="M46 60l6 16 7-1-2-17Z" fill={P.duskLight} />
      <circle cx={30} cy={56} r={3} fill={P.cream} />
    </>
  ),
  sailboat: () => (
    <>
      <path d="M24 70l8-30 8 30Z" fill={P.cream} />
      <path d="M44 70l-2-34 14 34Z" fill={P.dusk} />
      <path d="M14 70h72l-10 12H24Z" fill={P.terracotta} />
      <rect x={41} y={24} width={2} height={46} fill={P.pineLight} />
    </>
  ),
  'hot-air-balloon': () => (
    <>
      <path
        d="M50 18c16 0 26 14 26 28 0 12-10 20-26 20s-26-8-26-20c0-14 10-28 26-28Z"
        fill={P.terracotta}
      />
      <path d="M38 64l4 10M62 64l-4 10" stroke={P.ink} strokeOpacity={0.5} strokeWidth={1.6} />
      <rect x={42} y={74} width={16} height={10} rx={2} fill={P.pineLight} />
    </>
  ),
  car: () => (
    <>
      <rect x={14} y={54} width={72} height={18} rx={6} fill={P.dusk} />
      <path d="M28 54c2-10 10-16 22-16s20 6 22 16Z" fill={P.duskLight} />
      <rect x={34} y={42} width={14} height={12} rx={2} fill={P.cream} opacity={0.8} />
      <rect x={52} y={42} width={14} height={12} rx={2} fill={P.cream} opacity={0.8} />
      <circle cx={30} cy={76} r={8} fill={P.ink} />
      <circle cx={70} cy={76} r={8} fill={P.ink} />
      <circle cx={80} cy={60} r={3} fill={P.gold} />
    </>
  ),

  // ---------- Toys ----------
  blocks: () => (
    <>
      <rect x={22} y={52} width={26} height={26} rx={4} fill={P.terracotta} transform="rotate(-6 35 65)" />
      <rect x={50} y={48} width={28} height={28} rx={4} fill={P.pineLight} transform="rotate(4 64 62)" />
      <rect x={36} y={24} width={24} height={24} rx={4} fill={P.gold} transform="rotate(-3 48 36)" />
    </>
  ),
  balloon: () => (
    <>
      <ellipse cx={50} cy={42} rx={22} ry={26} fill={P.berry} />
      <ellipse cx={42} cy={32} rx={6} ry={8} fill={P.berryLight} opacity={0.7} />
      <path d="M50 68l-2 6 4 2-4 2 4 2" stroke={P.ink} strokeOpacity={0.5} strokeWidth={1.4} fill="none" />
      <path d="M46 68h8l-4 6Z" fill={P.berry} />
    </>
  ),
  pinwheel: () => (
    <>
      <path d="M50 50V18c10 0 16 8 16 16s-6 16-16 16Z" fill={P.terracotta} />
      <path d="M50 50H18c0-10 8-16 16-16s16 6 16 16Z" fill={P.gold} />
      <path d="M50 50V82c-10 0-16-8-16-16s6-16 16-16Z" fill={P.pineLight} />
      <path d="M50 50H82c0 10-8 16-16 16S50 60 50 50Z" fill={P.dusk} />
      <circle cx={50} cy={50} r={6} fill={P.cream} />
      <path d="M50 82v14" stroke={P.ink} strokeOpacity={0.4} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  'teddy-bear': () => (
    <>
      <circle cx={28} cy={28} r={9} fill={P.gold} />
      <circle cx={72} cy={28} r={9} fill={P.gold} />
      <circle cx={50} cy={42} r={22} fill={P.goldLight} />
      <ellipse cx={50} cy={76} rx={22} ry={18} fill={P.goldLight} />
      <Eye cx={43} cy={40} />
      <Eye cx={57} cy={40} />
      <ellipse cx={50} cy={48} rx={7} ry={5} fill={P.cream} />
      <circle cx={50} cy={48} r={2} fill={P.ink} />
    </>
  ),
  'spinning-top': () => (
    <>
      <path d="M32 40h36l-8 36c-2 8-18 8-20 0Z" fill={P.berry} />
      <rect x={28} y={32} width={44} height={10} rx={5} fill={P.gold} />
      <path d="M50 10v18" stroke={P.pineLight} strokeWidth={3} strokeLinecap="round" />
      <path d="M18 56c-4 2-4 6 0 8M82 56c4 2 4 6 0 8" stroke={P.ink} strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" fill="none" />
    </>
  ),

  // ---------- Magical ----------
  'magic-wand': () => (
    <>
      <path d="M24 78 68 34" stroke={P.pineLight} strokeWidth={4} strokeLinecap="round" />
      <path d="M74 18l3.6 8.2L86 28l-8.4 2.8L74 39l-3.6-8.2L62 28l8.4-1.8Z" fill={P.gold} />
      <circle cx={30} cy={64} r={2} fill={P.goldLight} />
      <circle cx={40} cy={56} r={1.6} fill={P.goldLight} />
      <circle cx={22} cy={72} r={1.6} fill={P.goldLight} />
    </>
  ),
  unicorn: () => (
    <>
      <path
        d="M30 70c-2-18 8-34 24-34 10 0 17 6 20 14l8-14 2 2-6 16c4 4 6 10 4 16-3 10-14 16-26 16-14 0-25-7-26-16Z"
        fill={P.cream}
      />
      <path d="M54 36l10-16 3 2-9 16Z" fill={P.gold} />
      <path d="M40 38c-6 2-9 8-7 10 3-4 7-7 7-10Z" fill={P.lilacLight} />
      <path d="M34 42c-5 3-6 9-4 11 2-4 5-8 4-11Z" fill={P.berryLight} />
      <Eye cx={44} cy={54} />
    </>
  ),
  castle: () => (
    <>
      <rect x={18} y={50} width={18} height={30} fill={P.lilacLight} />
      <rect x={64} y={50} width={18} height={30} fill={P.lilacLight} />
      <rect x={38} y={38} width={24} height={42} fill={P.lilac} />
      <path d="M18 50l9-12 9 12Z" fill={P.berry} />
      <path d="M64 50l9-12 9 12Z" fill={P.berry} />
      <path d="M38 38l12-14 12 14Z" fill={P.berry} />
      <path d="M50 24v-8" stroke={P.ink} strokeOpacity={0.4} strokeWidth={2} />
      <path d="M50 16l6 3-6 3Z" fill={P.terracotta} />
      <path d="M46 62h8v18h-8Z" fill={P.ink} opacity={0.5} />
    </>
  ),
  'fairy-wings': () => (
    <>
      <path
        d="M50 50C40 30 16 26 12 42c-4 16 14 26 38 20C40 72 18 86 10 76c6 10 30 10 40-6Z"
        fill={P.lilacLight}
        opacity={0.9}
      />
      <path
        d="M50 50C60 30 84 26 88 42c4 16-14 26-38 20C60 72 82 86 90 76c-6 10-30 10-40-6Z"
        fill={P.lilacLight}
        opacity={0.9}
      />
      <circle cx={50} cy={50} r={3} fill={P.gold} />
      <circle cx={24} cy={40} r={1.6} fill={P.goldLight} />
      <circle cx={76} cy={40} r={1.6} fill={P.goldLight} />
    </>
  ),
  'crystal-ball': () => (
    <>
      <path d="M36 80h28l-4-8H40Z" fill={P.pineLight} />
      <circle cx={50} cy={50} r={26} fill={P.duskLight} opacity={0.9} />
      <path d="M38 38c6-6 16-8 24-4" stroke={P.cream} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.8} />
      <circle cx={50} cy={16} r={2} fill={P.goldLight} />
      <path d="M44 10h12M50 4v12" stroke={P.goldLight} strokeWidth={1.6} strokeLinecap="round" />
    </>
  ),
}

export const ITEMS: PocketItem[] = ITEM_META.map((meta) => ({
  ...meta,
  render: RENDERERS[meta.id] ?? (() => <circle cx={50} cy={50} r={24} fill={PALETTE.terracotta} />),
}))

export const ITEMS_BY_ID: Record<string, PocketItem> = Object.fromEntries(
  ITEMS.map((item) => [item.id, item]),
)

export function itemsByCategory(categoryId: CategoryId): PocketItem[] {
  return ITEMS.filter((item) => item.category === categoryId)
}
