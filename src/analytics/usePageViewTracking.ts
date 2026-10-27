import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { analytics } from './manager'

/** Tracks a `page_view` event whenever the route changes. */
export function usePageViewTracking(): void {
  const location = useLocation()

  useEffect(() => {
    analytics.track('page_view', {
      path: location.pathname,
      referrer: document.referrer || undefined,
    })
    // Only re-run when the pathname actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])
}
