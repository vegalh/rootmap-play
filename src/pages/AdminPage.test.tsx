import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/renderWithRouter'
import { AdminPage } from './AdminPage'

describe('AdminPage', () => {
  it('shows a setup-required state instead of any data or a login form', () => {
    renderWithRouter(<AdminPage />)

    expect(screen.getByText('后台尚未配置')).toBeInTheDocument()
    // No real or mock dashboard data, and no password/login field, should ever render here.
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/密码/)).not.toBeInTheDocument()
  })
})
