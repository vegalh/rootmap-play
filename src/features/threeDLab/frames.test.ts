import { describe, expect, it } from 'vitest'
import { findFrameName, isFrameName, ROOM_FRAMES } from './frames'

function node(name: string, parent: { name: string; parent: unknown } | null = null) {
  return { name, parent } as { name: string; parent: never }
}

describe('3D Lab frames', () => {
  it('maps every frame to a real demo challenge slug', () => {
    expect(ROOM_FRAMES.map((frame) => frame.slug)).toEqual([
      'pocket-universe',
      'secret-room',
      'life-movie-poster',
    ])
  })

  it('recognises frame names only', () => {
    expect(isFrameName('frame_secret_room')).toBe(true)
    expect(isFrameName('bookshelf')).toBe(false)
  })

  it('resolves a hit on nested artwork primitives to its frame', () => {
    const frame = node('frame_life_movie', node('Scene'))
    const art = node('frame_life_movie_art', frame)
    const primitive = node('frame_life_movie_art_1', art)
    expect(findFrameName(primitive)).toBe('frame_life_movie')
  })

  it('returns null for objects that are not part of a frame', () => {
    expect(findFrameName(node('wall_back', node('Scene')))).toBeNull()
    expect(findFrameName(null)).toBeNull()
  })
})
