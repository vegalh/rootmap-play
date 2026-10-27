import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LogoMark } from '../illustrations/LogoMark'
import { t } from '../../i18n'
import { Container } from '../ui/Container'

const navItems = [
  { to: '/', label: t.nav.home },
  { to: '/pocket-universe', label: t.nav.pocketUniverse },
  { to: '/little-hero', label: t.nav.littleHero },
  { to: '/family-universe', label: t.nav.familyUniverse },
]

function linkClasses(isActive: boolean): string {
  return `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-ink-800 text-cream-50' : 'text-ink-700 hover:bg-ink-800/5'
  }`
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/10 bg-cream-50/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <NavLink to="/" className="flex items-center gap-2.5" onClick={() => setIsMenuOpen(false)}>
          <LogoMark className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-medium sm:text-xl">{t.brand.name}</span>
            <span className="text-[11px] font-medium tracking-[0.14em] text-terracotta-600">
              PLAY
            </span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => linkClasses(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? t.nav.close : t.nav.menu}
          className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-ink-800/15 md:hidden"
        >
          <span className="sr-only">{isMenuOpen ? t.nav.close : t.nav.menu}</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            {isMenuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </Container>

      {isMenuOpen ? (
        <nav id="mobile-nav" className="border-t border-ink-800/10 bg-cream-50 md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `${linkClasses(isActive)} text-left`}
              >
                {item.label}
              </NavLink>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  )
}
