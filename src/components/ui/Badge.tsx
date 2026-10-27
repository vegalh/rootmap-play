import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  tone?: 'terracotta' | 'pine' | 'gold'
  className?: string
}

const toneClasses: Record<NonNullable<BadgeProps['tone']>, string> = {
  terracotta: 'bg-terracotta-500/10 text-terracotta-600',
  pine: 'bg-pine-600/10 text-pine-700',
  gold: 'bg-gold-500/15 text-ink-800',
}

/** Small pill label used for eyebrows and status badges like "开发中". */
export function Badge({ children, tone = 'terracotta', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
