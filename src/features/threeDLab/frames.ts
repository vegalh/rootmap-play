/**
 * The three interactive picture frames in the 3D Lab room, keyed by the
 * object names the Blender script gives them
 * (experiments/3d-room/blender/build_room.py → build_frames). Renaming a
 * frame in Blender means renaming it here too.
 */
export const ROOM_FRAMES = [
  { name: 'frame_pocket_universe', slug: 'pocket-universe', fallbackTitle: '宝宝的口袋宇宙' },
  { name: 'frame_secret_room', slug: 'secret-room', fallbackTitle: '宝宝的秘密房间' },
  { name: 'frame_life_movie', slug: 'life-movie-poster', fallbackTitle: '宝宝的人生电影' },
] as const

export type RoomFrame = (typeof ROOM_FRAMES)[number]
export type FrameName = RoomFrame['name']

const FRAME_NAMES = new Set<string>(ROOM_FRAMES.map((frame) => frame.name))

export function isFrameName(name: string): name is FrameName {
  return FRAME_NAMES.has(name)
}

interface NamedNode {
  name: string
  parent: NamedNode | null
}

/**
 * Walks up from a raycast hit to the frame it belongs to. A hit can land
 * on the frame's own mesh, its artwork child, or — because glTF splits
 * multi-material meshes into primitives — an unnamed sub-mesh of either.
 */
export function findFrameName(node: NamedNode | null): FrameName | null {
  for (let current = node; current; current = current.parent) {
    if (isFrameName(current.name)) return current.name
  }
  return null
}
