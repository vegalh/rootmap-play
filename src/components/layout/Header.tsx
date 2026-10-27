import { NavLink } from 'react-router-dom'
import { LogoMark } from '../illustrations/LogoMark'
import { t } from '../../i18n'
import { Container } from '../ui/Container'

/**
 * Minimal brand header — this is a lightweight interactive mini-experience,
 * not a multi-section app, so there is nothing to hide behind a hamburger
 * menu. The two links cover everything a visitor needs: return to the
 * homepage (via the logo) and read the privacy notice.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/10 bg-cream-50/90 backdrop-blur">
      <Container className="flex h-14 items-center justify-between sm:h-16">
        <NavLink to="/" end className="flex items-center gap-2">
          <LogoMark className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className="flex items-baseline gap-1.5 font-display text-base font-medium sm:text-lg">
            {t.brand.name}
            <span className="text-[11px] font-semibold tracking-[0.14em] text-terracotta-600">
              PLAY
            </span>
          </span>
        </NavLink>

        <NavLink
          to="/privacy"
          className="text-sm font-medium text-ink-700/70 transition-colors hover:text-ink-800"
        >
          {t.nav.privacy}
        </NavLink>
      </Container>
    </header>
  )
}
