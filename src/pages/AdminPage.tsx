import { appConfig } from '../config/env'
import { Container } from '../components/ui/Container'
import { LinkButton } from '../components/ui/Button'
import { t } from '../i18n'

/**
 * Private admin dashboard entry point.
 *
 * PHASE 1 ships only the secure "not configured" state described in the
 * product spec: no hardcoded password, no frontend-only access control,
 * and no data of any kind (real or mock) until a real backend with
 * administrator authentication exists (PHASE 3/4).
 */
export function AdminPage() {
  // Reserved for PHASE 3: once Supabase + admin auth exist, this flag will
  // gate rendering the real dashboard instead of this setup notice.
  const isBackendReady = appConfig.isSupabaseConfigured

  return (
    <Container className="flex flex-col gap-8 py-12 sm:py-16">
      <div>
        <h1 className="text-2xl font-medium sm:text-3xl">{t.admin.title}</h1>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-ink-800/20 bg-cream-100 p-6 sm:p-8">
        <h2 className="text-xl font-medium text-terracotta-600">{t.admin.setupRequiredTitle}</h2>
        <p className="text-base text-ink-700/85">{t.admin.setupRequiredBody}</p>

        <ol className="flex flex-col gap-2 text-sm text-ink-700/85">
          <li>1. {t.admin.requirement1}</li>
          <li>2. {t.admin.requirement2}</li>
          <li>3. {t.admin.requirement3}</li>
        </ol>

        <p className="text-sm text-ink-700/70">{t.admin.note}</p>

        {isBackendReady ? (
          // Even with env vars present, PHASE 1 intentionally does not add
          // any authentication or data fetching yet — that is PHASE 3/4 work.
          <p className="text-sm font-medium text-pine-700">
            检测到 Supabase 配置，但管理员身份验证尚未实现，因此仍不会显示任何数据。
          </p>
        ) : null}
      </div>

      <LinkButton to="/" variant="ghost" className="self-start">
        ← {t.common.backHome}
      </LinkButton>
    </Container>
  )
}
