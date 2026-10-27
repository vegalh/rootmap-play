interface IllustrationProps {
  className?: string
}

/** Original artwork for Pocket Universe: a starlit sphere holding small loved things. */
export function PocketUniverseIllustration({ className = 'h-full w-full' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="宝宝的口袋宇宙插画">
      <defs>
        <radialGradient id="pu-sky" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#3c6a5f" />
          <stop offset="100%" stopColor="#1c3732" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="104" fill="url(#pu-sky)" />
      <circle cx="120" cy="120" r="104" fill="none" stroke="#E7B74F" strokeOpacity="0.4" strokeWidth="2" />

      {/* scattered stars */}
      <g fill="#F8F1E3">
        <circle cx="70" cy="60" r="2.5" />
        <circle cx="168" cy="72" r="2" />
        <circle cx="185" cy="140" r="2.5" />
        <circle cx="60" cy="150" r="2" />
        <circle cx="120" cy="50" r="1.8" />
        <circle cx="150" cy="180" r="1.8" />
      </g>

      {/* small star shape */}
      <path
        d="M90 76l4.2 9.6 10.4 1.1-7.7 7.2 2.1 10.3-9-5.3-9 5.3 2.1-10.3-7.7-7.2 10.4-1.1Z"
        fill="#E7B74F"
      />

      {/* mini dinosaur silhouette */}
      <path
        d="M118 156c-10 0-18-6-18-15 0-6 3-9 3-14 0-5 4-9 9-9 4 0 6 2 8 4 2-3 5-5 9-5 6 0 10 4 10 10 0 3-1 5-1 8 4 1 7 4 7 8 0 5-4 8-9 8h-3l2 7h-6l-2-6h-9l1 6h-6l-1-6Z"
        fill="#E78A63"
      />
      <circle cx="113" cy="134" r="1.6" fill="#1c3732" />

      {/* strawberry */}
      <path
        d="M158 118c8 0 14 6 14 13 0 9-8 17-14 17s-14-8-14-17c0-7 6-13 14-13Z"
        fill="#D9704A"
      />
      <path d="M158 114l-4-6M158 114l0-7M158 114l4-6" stroke="#33594F" strokeWidth="2" strokeLinecap="round" />
      <g fill="#F8F1E3" opacity="0.7">
        <circle cx="153" cy="122" r="1" />
        <circle cx="160" cy="126" r="1" />
        <circle cx="156" cy="132" r="1" />
      </g>

      {/* orbit ring */}
      <ellipse
        cx="120"
        cy="120"
        rx="88"
        ry="30"
        fill="none"
        stroke="#F8F1E3"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
    </svg>
  )
}
