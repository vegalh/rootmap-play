interface LittleHouseSceneProps {
  className?: string
}

/**
 * Original decorative atmosphere illustration for the homepage hero — a
 * quiet corner of a small wooden house on a sunlit afternoon: a window
 * with soft light, a shelf with picture books, a ceramic vase of flowers,
 * and a framed print leaning against the wall. This is intentionally
 * decorative "house" atmosphere, not the example creative artwork itself
 * (that content is real, admin-curated artwork — see
 * `ArtworkPlaceholder` — and must never be faked). Flat, restrained
 * vector shapes in the Little House palette, consistent with the existing
 * hand-authored illustration style (`BlobBackdrop`, `LogoMark`).
 */
export function LittleHouseScene({ className = '' }: LittleHouseSceneProps) {
  return (
    <svg
      viewBox="0 0 640 520"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="house-sunlight" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#E3C480" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E3C480" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="house-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE4D0" />
          <stop offset="100%" stopColor="#E3D3B8" />
        </linearGradient>
      </defs>

      {/* wall */}
      <rect width="640" height="520" fill="url(#house-wall)" />
      <rect width="640" height="520" fill="url(#house-sunlight)" />

      {/* window */}
      <g>
        <rect x="200" y="48" width="240" height="220" rx="10" fill="#F6F0E5" />
        <rect x="200" y="48" width="240" height="220" rx="10" fill="none" stroke="#6B5847" strokeOpacity="0.35" strokeWidth="6" />
        {/* sky through the window */}
        <rect x="212" y="60" width="216" height="196" rx="4" fill="#D1A355" fillOpacity="0.18" />
        <circle cx="400" cy="100" r="30" fill="#E3C480" fillOpacity="0.9" />
        {/* a distant tree, just visible */}
        <path d="M232 256 C232 210 260 188 268 188 C276 188 304 210 304 256 Z" fill="#7C8A6B" fillOpacity="0.5" />
        {/* window cross-bars */}
        <rect x="318" y="60" width="4" height="196" fill="#6B5847" fillOpacity="0.3" />
        <rect x="212" y="156" width="216" height="4" fill="#6B5847" fillOpacity="0.3" />
      </g>

      {/* hanging framed print on the wall, left of the window */}
      <g transform="translate(96 90) rotate(-3)">
        <rect width="88" height="108" rx="4" fill="#F6F0E5" stroke="#6B5847" strokeOpacity="0.4" strokeWidth="4" />
        <rect x="10" y="10" width="68" height="88" fill="#9C5E49" fillOpacity="0.25" />
        <path d="M18 78 L38 46 L54 64 L66 40 L78 78 Z" fill="#4C5A42" fillOpacity="0.45" />
      </g>

      {/* wooden shelf */}
      <g>
        <rect x="64" y="332" width="512" height="16" rx="4" fill="#6B5847" />
        <rect x="64" y="348" width="512" height="8" fill="#4A3C30" fillOpacity="0.35" />

        {/* stacked picture books */}
        <g transform="translate(96 268)">
          <rect x="0" y="40" width="112" height="20" rx="3" fill="#9C5E49" />
          <rect x="6" y="20" width="96" height="20" rx="3" fill="#7C8A6B" />
          <rect x="2" y="2" width="104" height="18" rx="3" fill="#D1A355" />
        </g>

        {/* ceramic vase with flowers */}
        <g transform="translate(260 252)">
          <path d="M14 40 C6 40 2 56 8 72 C12 82 36 82 40 72 C46 56 42 40 34 40 Z" fill="#E3D3B8" stroke="#6B5847" strokeOpacity="0.3" strokeWidth="2" />
          <path d="M24 40 C18 24 10 18 6 10" stroke="#4C5A42" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M24 40 C26 22 30 14 36 6" stroke="#4C5A42" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M24 40 C24 20 24 12 24 2" stroke="#4C5A42" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="6" cy="8" r="6" fill="#9C5E49" />
          <circle cx="36" cy="4" r="6" fill="#D1A355" />
          <circle cx="24" cy="0" r="6" fill="#CDA08B" />
        </g>

        {/* a small framed photo leaning on the shelf */}
        <g transform="translate(360 272) rotate(4)">
          <rect width="64" height="76" rx="4" fill="#F6F0E5" stroke="#6B5847" strokeOpacity="0.4" strokeWidth="3" />
          <rect x="7" y="7" width="50" height="62" fill="#D1A355" fillOpacity="0.3" />
        </g>

        {/* a small potted plant */}
        <g transform="translate(468 258)">
          <path d="M10 70 L54 70 L48 94 L16 94 Z" fill="#9C5E49" fillOpacity="0.5" />
          <path d="M32 70 C10 60 6 34 16 16 C20 40 28 50 32 70 Z" fill="#4C5A42" />
          <path d="M32 70 C54 58 58 32 48 14 C44 38 36 50 32 70 Z" fill="#7C8A6B" />
        </g>
      </g>

      {/* soft floor shadow grounding the whole scene */}
      <rect x="0" y="470" width="640" height="50" fill="#4A3C30" fillOpacity="0.06" />
    </svg>
  )
}
