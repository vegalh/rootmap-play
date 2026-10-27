import { Container } from '../components/ui/Container'
import { LinkButton } from '../components/ui/Button'
import { t } from '../i18n'

export function PrivacyPage() {
  return (
    <Container className="flex flex-col gap-8 py-12 sm:py-16">
      <LinkButton to="/" variant="ghost" className="self-start">
        ← {t.common.backHome}
      </LinkButton>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-medium sm:text-4xl">{t.privacyPage.title}</h1>
        <p className="max-w-2xl text-base text-ink-700/80">{t.privacyPage.intro}</p>
      </div>

      <dl className="flex flex-col gap-6">
        {t.privacyPage.sections.map((section) => (
          <div key={section.title} className="rounded-2xl bg-cream-100 p-6">
            <dt className="text-lg font-medium">{section.title}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink-700/80">{section.body}</dd>
          </div>
        ))}
      </dl>
    </Container>
  )
}
