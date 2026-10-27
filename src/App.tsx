import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AdminPage } from './pages/AdminPage'
import { ChallengeDetailPage } from './pages/ChallengeDetailPage'
import { FamilyUniversePage } from './pages/FamilyUniversePage'
import { HomePage } from './pages/HomePage'
import { LittleHeroPage } from './pages/LittleHeroPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PocketUniversePage } from './pages/PocketUniversePage'
import { PrivacyPage } from './pages/PrivacyPage'

// Experimental 3D room (experiments/3d-room/). Lazy so three.js stays out
// of the main bundle; unlinked, reachable at /3d-lab only.
const ThreeDLabPage = lazy(() => import('./pages/ThreeDLabPage').then((m) => ({ default: m.ThreeDLabPage })))

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="challenges/:slug" element={<ChallengeDetailPage />} />
        {/*
          The three routes below predate the Phase 2 product pivot (see
          docs/PRODUCT_PIVOT.md §12). They're no longer linked from the
          homepage — the challenge gallery above replaces them as the
          public experience — but are kept reachable by direct URL rather
          than deleted, until the replacement has been fully validated.
        */}
        <Route path="pocket-universe" element={<PocketUniversePage />} />
        <Route path="little-hero" element={<LittleHeroPage />} />
        <Route path="family-universe" element={<FamilyUniversePage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route
          path="3d-lab"
          element={
            <Suspense fallback={null}>
              <ThreeDLabPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
