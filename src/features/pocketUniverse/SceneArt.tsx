import { forwardRef } from 'react'
import type { CompositionPlan } from './composition'
import { SCENE_CENTER, SCENE_SIZE } from './composition'
import { ITEMS_BY_ID } from './items'
import type { SceneTheme } from './themes'

interface SceneArtProps {
  plan: CompositionPlan
  theme: SceneTheme
  className?: string
}

const SPHERE_R = 258
const CLIP_R = 250

/**
 * Renders the composed "pocket universe" as a single SVG scene. Used both
 * for the live on-screen preview and, via `ref`, as the source serialized
 * for PNG export — so what the parent sees is exactly what gets exported.
 *
 * Deliberately contains no text: Chinese title/branding copy is drawn
 * separately with the Canvas 2D API during export, which renders it with
 * the page's loaded fonts reliably, rather than risking font substitution
 * inside a rasterized, detached SVG image.
 */
export const SceneArt = forwardRef<SVGSVGElement, SceneArtProps>(function SceneArt(
  { plan, theme, className = 'h-full w-full' },
  ref,
) {
  const gradientId = `pu-sky-${theme.id}`

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={SCENE_SIZE}
      height={SCENE_SIZE}
      viewBox={`0 0 ${SCENE_SIZE} ${SCENE_SIZE}`}
      className={className}
      role="img"
      aria-label="宝宝的专属口袋宇宙插画"
    >
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={theme.skyFrom} />
          <stop offset="100%" stopColor={theme.skyTo} />
        </radialGradient>
        <clipPath id="pu-scene-clip">
          <circle cx={SCENE_CENTER} cy={SCENE_CENTER} r={CLIP_R} />
        </clipPath>
      </defs>

      <circle cx={SCENE_CENTER} cy={SCENE_CENTER} r={SPHERE_R} fill={`url(#${gradientId})`} />
      <circle
        cx={SCENE_CENTER}
        cy={SCENE_CENTER}
        r={SPHERE_R}
        fill="none"
        stroke={theme.groundColor}
        strokeOpacity={0.4}
        strokeWidth={2}
      />

      <g clipPath="url(#pu-scene-clip)">
        {/* soft ground platform so items read as standing in a little world */}
        <ellipse
          cx={SCENE_CENTER}
          cy={SCENE_CENTER + 150}
          rx={230}
          ry={46}
          fill={theme.groundColor}
          opacity={0.18}
        />

        {plan.stars.map((star, index) => (
          <circle key={index} cx={star.x} cy={star.y} r={star.r} fill={theme.starColor} opacity={0.85} />
        ))}

        <g
          transform={`translate(${SCENE_CENTER} ${SCENE_CENTER}) rotate(${plan.ring.rotationDeg})`}
        >
          <ellipse
            cx={0}
            cy={0}
            rx={plan.ring.rx}
            ry={plan.ring.ry}
            fill="none"
            stroke={theme.ringColor}
            strokeOpacity={0.3}
            strokeWidth={1.5}
          />
        </g>

        {plan.placements.map((placement) => {
          const item = ITEMS_BY_ID[placement.itemId]
          if (!item) return null
          const boxSize = 100 * placement.scale
          return (
            <g
              key={placement.itemId}
              transform={`translate(${placement.x} ${placement.y}) rotate(${placement.rotationDeg})`}
            >
              <svg
                x={-boxSize / 2}
                y={-boxSize / 2}
                width={boxSize}
                height={boxSize}
                viewBox="0 0 100 100"
              >
                {item.render()}
              </svg>
            </g>
          )
        })}
      </g>
    </svg>
  )
})
