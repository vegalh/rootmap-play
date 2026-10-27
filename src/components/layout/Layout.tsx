import { Outlet } from 'react-router-dom'
import { usePageViewTracking } from '../../analytics'
import { PrivacyNoticeBanner } from '../PrivacyNoticeBanner'
import { Footer } from './Footer'
import { Header } from './Header'

/** Shared page chrome: header, routed content, footer, and the privacy notice. */
export function Layout() {
  usePageViewTracking()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <PrivacyNoticeBanner />
    </div>
  )
}
