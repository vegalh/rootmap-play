import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  children?: ReactNode
}

/** Consistent "eyebrow + title + subtitle" heading block used across sections. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  children,
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-terracotta-600">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-3xl font-medium sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="max-w-2xl text-balance text-base text-ink-700/80 sm:text-lg">{subtitle}</p>
      ) : null}
      {children}
    </div>
  )
}
