interface IllustrationProps {
  className?: string
}

/** Original artwork for Little Hero Card: a collectible shield-shaped character card. */
export function LittleHeroIllustration({ className = 'h-full w-full' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="宝宝的隐藏角色插画">
      <defs>
        <linearGradient id="lh-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E78A63" />
          <stop offset="100%" stopColor="#C25A37" />
        </linearGradient>
      </defs>
      <rect x="18" y="18" width="204" height="204" rx="28" fill="#F8F1E3" />
      <rect x="18" y="18" width="204" height="204" rx="28" fill="none" stroke="#E7B74F" strokeWidth="2" strokeOpacity="0.5" />

      {/* shield badge */}
      <path
        d="M120 46c18 8 34 10 46 10 2 30-4 70-46 94-42-24-48-64-46-94 12 0 28-2 46-10Z"
        fill="url(#lh-card)"
      />
      <path
        d="M120 46c18 8 34 10 46 10 2 30-4 70-46 94-42-24-48-64-46-94 12 0 28-2 46-10Z"
        fill="none"
        stroke="#F8F1E3"
        strokeWidth="2"
        strokeOpacity="0.6"
      />

      {/* little crown / star emblem inside the shield */}
      <path
        d="M120 92l5.4 11.4 12.6 1.3-9.3 8.6 2.6 12.4-11.3-6.4-11.3 6.4 2.6-12.4-9.3-8.6 12.6-1.3Z"
        fill="#F8F1E3"
      />

      {/* sparkle details around the badge */}
      <g fill="#264740">
        <circle cx="60" cy="70" r="2.4" />
        <circle cx="182" cy="76" r="2" />
        <circle cx="70" cy="170" r="2" />
        <circle cx="176" cy="168" r="2.4" />
      </g>

      {/* name plate */}
      <rect x="70" y="182" width="100" height="16" rx="8" fill="#264740" opacity="0.1" />
    </svg>
  )
}
