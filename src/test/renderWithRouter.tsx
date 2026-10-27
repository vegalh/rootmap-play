import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, type InitialEntry } from 'react-router-dom'

/**
 * Renders a component wrapped in a MemoryRouter, for tests that use router
 * hooks/links. Entries can be plain path strings, or `{ pathname, state }`
 * objects for tests that need to assert on `location.state` (e.g.
 * `ChallengeCard`'s gallery-source attribution).
 */
export function renderWithRouter(ui: ReactElement, initialEntries: InitialEntry[] = ['/']) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}
