import { Link } from 'react-router-dom'
import { LogoMark } from '../illustrations/LogoMark'
import { t } from '../../i18n'
import { Container } from '../ui/Container'

/** Minimal footer: just the brand mark, the privacy notice link, and a copyright line. */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-800/10 bg-cream-100">
      <Container className="flex flex-col items-center gap-3 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <LogoMark className="h-6 w-6" />
          <span className="font-display text-sm font-medium">
            {t.brand.name} <span className="text-terracotta-600">Play</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-ink-700/60">
          <Link to="/privacy" className="hover:text-ink-800 hover:underline">
            {t.footer.privacyLink}
          </Link>
          <span>{t.footer.copyright}</span>
        </div>
      </Container>
    </footer>
  )
}
