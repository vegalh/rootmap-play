import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AdminPage } from './pages/AdminPage'
import { FamilyUniversePage } from './pages/FamilyUniversePage'
import { HomePage } from './pages/HomePage'
import { LittleHeroPage } from './pages/LittleHeroPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PocketUniversePage } from './pages/PocketUniversePage'
import { PrivacyPage } from './pages/PrivacyPage'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="pocket-universe" element={<PocketUniversePage />} />
        <Route path="little-hero" element={<LittleHeroPage />} />
        <Route path="family-universe" element={<FamilyUniversePage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
