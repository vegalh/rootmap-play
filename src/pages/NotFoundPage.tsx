import { Container } from '../components/ui/Container'
import { LinkButton } from '../components/ui/Button'
import { t } from '../i18n'

export function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center gap-5 py-24 text-center">
      <span className="font-display text-6xl text-terracotta-500">404</span>
      <h1 className="text-2xl font-medium sm:text-3xl">{t.notFound.title}</h1>
      <p className="max-w-md text-base text-ink-700/80">{t.notFound.body}</p>
      <LinkButton to="/" variant="primary">
        {t.notFound.cta}
      </LinkButton>
    </Container>
  )
}
