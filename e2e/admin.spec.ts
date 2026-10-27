import { expect, test } from '@playwright/test'

test.describe('Admin dashboard placeholder', () => {
  test('shows a setup-required state with no login form or data', async ({ page }) => {
    await page.goto('admin')

    await expect(page.getByText('后台尚未配置')).toBeVisible()
    await expect(page.getByRole('textbox')).toHaveCount(0)
    await expect(page.locator('input[type="password"]')).toHaveCount(0)
  })
})
