interface BlobBackdropProps {
  className?: string
}

/**
 * Soft organic background shapes used behind the hero and section headers.
 * Purely decorative, original vector art (no external images or emoji).
 */
export function BlobBackdrop({ className = '' }: BlobBackdropProps) {
  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M80 180C40 90 160 10 280 30C400 50 410 150 520 140C630 130 700 40 760 110C820 180 760 300 660 320C560 340 540 260 440 280C340 300 320 400 220 390C120 380 120 270 80 180Z"
        fill="#F0E5CD"
        opacity="0.8"
      />
      <path
        d="M620 350C700 340 760 410 730 470C700 530 600 520 560 480C520 440 540 360 620 350Z"
        fill="#E7B74F"
        opacity="0.25"
      />
      <path
        d="M120 320C70 330 20 290 30 240C40 190 110 180 150 210C190 240 170 310 120 320Z"
        fill="#33594F"
        opacity="0.15"
      />
      <circle cx="660" cy="90" r="6" fill="#D9704A" opacity="0.5" />
      <circle cx="140" cy="120" r="4" fill="#D9704A" opacity="0.4" />
      <circle cx="420" cy="60" r="5" fill="#264740" opacity="0.3" />
    </svg>
  )
}
