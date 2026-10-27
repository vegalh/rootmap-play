interface LogoMarkProps {
  className?: string
}

/** Original RootMap sprout mark, reused from the favicon artwork. */
export function LogoMark({ className = 'h-9 w-9' }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#F6F0E5" />
      <path
        d="M32 48c-8.837 0-16-6.268-16-14 0-6 4-10 8-10 2.5 0 4.5 1.3 6 3.2C31.5 23 33.8 20 38 20c5.523 0 8 4.477 8 10 0 9.941-7.163 18-14 18Z"
        fill="#9C5E49"
      />
      <path d="M32 48V28" stroke="#37432E" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="24" r="3.5" fill="#D1A355" />
    </svg>
  )
}
