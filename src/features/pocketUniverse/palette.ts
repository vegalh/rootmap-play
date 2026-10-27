/**
 * Feature-local color accents layered on top of the global theme palette
 * (`src/index.css`). Kept here rather than in the design system because
 * they exist only to give the 30 illustrated items enough chromatic
 * variety while staying inside the same warm, editorial mood.
 */
export const PALETTE = {
  cream: '#FDFAF4',
  creamSoft: '#F8F1E3',
  ink: '#2B2219',
  pineDeep: '#1C3732',
  pine: '#264740',
  pineLight: '#33594F',
  terracotta: '#D9704A',
  terracottaLight: '#E78A63',
  gold: '#D9A23A',
  goldLight: '#E7B74F',
  // Extra warm/soft accents used only by individual item illustrations.
  dusk: '#5B7C99',
  duskLight: '#8CA8BC',
  berry: '#C9728F',
  berryLight: '#E0A6B9',
  lilac: '#8671A6',
  lilacLight: '#B6A4D1',
} as const
