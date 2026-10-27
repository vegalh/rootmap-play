export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-terracotta-500 text-cream-50 hover:bg-terracotta-600 shadow-[var(--shadow-card)]',
  secondary: 'bg-pine-600 text-cream-50 hover:bg-pine-700',
  ghost: 'bg-transparent text-ink-800 ring-1 ring-inset ring-ink-800/15 hover:bg-ink-800/5',
}

const baseButtonClasses =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60'

export function buttonClassName(variant: ButtonVariant = 'primary', className = ''): string {
  return `${baseButtonClasses} ${variantClasses[variant]} ${className}`.trim()
}
