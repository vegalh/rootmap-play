import { useProgress } from '@react-three/drei'
import { Component, type ReactNode, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { useChallenges } from '../content/useChallenges'
import { type FrameName, ROOM_FRAMES } from '../features/threeDLab/frames'
import { RoomViewer } from '../features/threeDLab/RoomViewer'

/**
 * EXPERIMENTAL — /3d-lab. A prototype of the RootMap "little house" as a
 * real-time 3D room (model built by experiments/3d-room/blender/
 * build_room.py). Not linked from the site; reachable by URL only.
 * Lazy-loaded from App.tsx so three.js never ships with other pages.
 * Copy is inline rather than in i18n/ while this remains an experiment.
 */
export function ThreeDLabPage() {
  const [hovered, setHovered] = useState<FrameName | null>(null)
  const [selected, setSelected] = useState<FrameName | null>(null)
  const { data: challenges } = useChallenges()
  const { active: loading, progress } = useProgress()

  const frames = useMemo(
    () =>
      ROOM_FRAMES.map((frame) => ({
        ...frame,
        title: challenges?.find((challenge) => challenge.slug === frame.slug)?.title ?? frame.fallbackTitle,
      })),
    [challenges],
  )
  const selectedFrame = frames.find((frame) => frame.name === selected)
  const hoveredFrame = frames.find((frame) => frame.name === hovered)

  return (
    <Container className="flex flex-col gap-6 py-8 sm:py-12">
      <header className="flex flex-col gap-2">
        <p className="text-xs tracking-[0.2em] text-ink-700/55 uppercase">3D Lab · 实验原型</p>
        <h1 className="font-display text-2xl text-ink-900 sm:text-3xl">想象力的小屋</h1>
        <p className="text-sm text-ink-700/70">轻轻拖动转一转，点一点墙上的画框。</p>
      </header>

      <div className="relative h-[68vh] min-h-[380px] overflow-hidden rounded-3xl bg-cream-100 shadow-soft">
        <ViewerErrorBoundary>
          <RoomViewer hovered={hovered} selected={selected} onHover={setHovered} onSelect={setSelected} />
        </ViewerErrorBoundary>

        {loading && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-ink-700/60">
            正在搭建小屋… {Math.round(progress)}%
          </p>
        )}

        {!selectedFrame && hoveredFrame && (
          <p className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-cream-50/90 px-4 py-1.5 text-sm text-ink-800 shadow-card">
            {hoveredFrame.title}
          </p>
        )}

        {selectedFrame && (
          <div
            role="status"
            className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-2xl bg-cream-50/95 p-4 shadow-card sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-80 sm:p-5"
          >
            <p className="font-display text-lg text-ink-900">{selectedFrame.title}</p>
            <div className="flex items-center justify-between gap-3">
              <Link
                to={`/challenges/${selectedFrame.slug}`}
                state={{ source: '3d-lab' }}
                className="rounded-full bg-terracotta-500 px-4 py-2 text-sm text-cream-50 hover:bg-terracotta-600"
              >
                进入这个挑战 →
              </Link>
              <button type="button" onClick={() => setSelected(null)} className="text-sm text-ink-700/60 hover:text-ink-800">
                关闭
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard / screen-reader path to the same three frames. */}
      <nav aria-label="墙上的画框" className="flex flex-wrap gap-2">
        {frames.map((frame) => (
          <button
            key={frame.name}
            type="button"
            aria-pressed={frame.name === selected}
            onClick={() => setSelected(frame.name === selected ? null : frame.name)}
            onMouseEnter={() => setHovered(frame.name)}
            onMouseLeave={() => setHovered(null)}
            className="rounded-full border border-cream-200 px-4 py-1.5 text-sm text-ink-800 hover:bg-cream-100 aria-pressed:border-terracotta-400 aria-pressed:bg-cream-100"
          >
            {frame.title}
          </button>
        ))}
      </nav>
    </Container>
  )
}

class ViewerErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="flex h-full items-center justify-center p-6 text-center text-sm text-ink-700/70">
          这个设备暂时无法显示 3D 小屋（需要 WebGL）。
        </p>
      )
    }
    return this.props.children
  }
}
