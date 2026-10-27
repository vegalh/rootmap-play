import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test('loads with the hero headline, artwork preview, and brand name', async ({ page }) => {
    await page.goto('')
    await expect(page).toHaveTitle(/RootMap Play/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('把宝宝喜欢的东西')
    await expect(page.getByText('RootMap', { exact: true }).first()).toBeVisible()
    // The hero's artwork preview is the main attraction, not a generic icon.
    await expect(page.getByText('效果示例')).toBeVisible()
  })

  test('shows one primary CTA into Pocket Universe and two secondary experience cards', async ({
    page,
  }) => {
    await page.goto('')
    await expect(page.getByRole('link', { name: /立即制作/ })).toHaveAttribute(
      'href',
      /pocket-universe/,
    )
    await expect(page.getByRole('heading', { name: '宝宝的隐藏角色' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '我们家的亲戚关系宇宙' })).toBeVisible()
    // Pocket Universe is the hero, not a duplicated third card below it.
    await expect(page.getByRole('heading', { name: '宝宝的口袋宇宙' })).toHaveCount(0)
  })

  test('the primary CTA takes the parent straight into Pocket Universe', async ({ page }) => {
    await page.goto('')
    await page.getByRole('link', { name: /立即制作/ }).click()
    await expect(page).toHaveURL(/pocket-universe/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('宝宝的口袋宇宙')
  })

  test('navigates to a secondary experience by clicking its card', async ({ page }) => {
    await page.goto('')
    await page.getByRole('link', { name: /宝宝的隐藏角色/ }).click()
    await expect(page).toHaveURL(/little-hero/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('宝宝的隐藏角色')
  })
})
