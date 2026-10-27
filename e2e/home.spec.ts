import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test('loads with the hero headline and brand name', async ({ page }) => {
    await page.goto('')
    await expect(page).toHaveTitle(/RootMap Play/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('为孩子创造一段')
    await expect(page.getByText('RootMap', { exact: true }).first()).toBeVisible()
  })

  test('shows all three product cards', async ({ page }) => {
    await page.goto('')
    await expect(page.getByRole('heading', { name: '宝宝的口袋宇宙' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '宝宝的隐藏角色' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '我们家的亲戚关系宇宙' })).toBeVisible()
  })

  test('navigates to a product detail page by clicking its card', async ({ page }) => {
    await page.goto('')
    await page.getByRole('link', { name: /宝宝的口袋宇宙/ }).click()
    await expect(page).toHaveURL(/pocket-universe/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('宝宝的口袋宇宙')
  })
})
