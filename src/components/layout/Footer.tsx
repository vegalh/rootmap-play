import { Link } from 'react-router-dom'
import { LogoMark } from '../illustrations/LogoMark'
import { t } from '../../i18n'
import { Container } from '../ui/Container'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-800/10 bg-cream-100">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark className="h-8 w-8" />
          <div>
            <p className="font-display text-base font-medium">
              {t.brand.name} <span className="text-terracotta-600">Play</span>
            </p>
            <p className="max-w-sm text-sm text-ink-700/70">{t.footer.aboutBody}</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 text-sm text-ink-700/70 sm:items-end">
          <Link to="/privacy" className="font-medium text-ink-800 hover:underline">
            {t.footer.privacyLink}
          </Link>
          <p>{t.footer.copyright}</p>
        </div>
      </Container>
    </footer>
  )
}
