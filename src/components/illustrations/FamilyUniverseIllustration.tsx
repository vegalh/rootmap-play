interface IllustrationProps {
  className?: string
}

/** Original artwork for Family Universe: an orbiting map of family members. */
export function FamilyUniverseIllustration({ className = 'h-full w-full' }: IllustrationProps) {
  const satellites = [
    { cx: 120, cy: 46, r: 11, fill: '#D9704A' },
    { cx: 196, cy: 92, r: 9, fill: '#E7B74F' },
    { cx: 196, cy: 160, r: 10, fill: '#33594F' },
    { cx: 120, cy: 200, r: 9, fill: '#E78A63' },
    { cx: 44, cy: 160, r: 10, fill: '#E7B74F' },
    { cx: 44, cy: 92, r: 9, fill: '#264740' },
  ]

  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="我们家的亲戚关系宇宙插画">
      <circle cx="120" cy="120" r="104" fill="#F8F1E3" />
      <circle cx="120" cy="120" r="104" fill="none" stroke="#E7B74F" strokeOpacity="0.5" strokeWidth="2" />

      <g stroke="#264740" strokeOpacity="0.35" strokeWidth="1.5">
        {satellites.map((s) => (
          <line key={`${s.cx}-${s.cy}`} x1="120" y1="120" x2={s.cx} y2={s.cy} />
        ))}
      </g>

      {/* central parent+child node */}
      <circle cx="120" cy="120" r="20" fill="#C25A37" />
      <circle cx="113" cy="116" r="4.5" fill="#F8F1E3" />
      <circle cx="127" cy="118" r="3.2" fill="#F8F1E3" />

      {satellites.map((s) => (
        <circle key={`${s.cx}-${s.cy}-node`} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} />
      ))}
    </svg>
  )
}
