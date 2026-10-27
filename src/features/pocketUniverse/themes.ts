/** Background color theme for the composed scene — layout stays identical, only the palette shifts. */
export interface SceneTheme {
  id: string
  label: string
  skyFrom: string
  skyTo: string
  ringColor: string
  starColor: string
  groundColor: string
}

export const SCENE_THEMES: SceneTheme[] = [
  {
    id: 'night',
    label: '深夜星空',
    skyFrom: '#3c6a5f',
    skyTo: '#1c3732',
    ringColor: '#F8F1E3',
    starColor: '#F8F1E3',
    groundColor: '#E7B74F',
  },
  {
    id: 'dusk',
    label: '黄昏暖阳',
    skyFrom: '#e39a6d',
    skyTo: '#9a4f3a',
    ringColor: '#FDFAF4',
    starColor: '#FDFAF4',
    groundColor: '#F8F1E3',
  },
  {
    id: 'dream',
    label: '梦境薰衣草',
    skyFrom: '#8d79b3',
    skyTo: '#463a66',
    ringColor: '#F8F1E3',
    starColor: '#F8F1E3',
    groundColor: '#E7B74F',
  },
]

export const DEFAULT_THEME_ID = SCENE_THEMES[0].id
