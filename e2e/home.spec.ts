import { expect, test } from '@playwright/test'

test.describe('Home page (Little House gallery)', () => {
  test('loads with the welcome headline, house illustration, and brand name', async ({ page }) => {
    await page.goto('')
    await expect(page).toHaveTitle(/RootMap Play/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('欢迎来到')
    await expect(page.getByRole('banner').getByRole('link', { name: /RootMap/ })).toBeVisible()
  })

  test('shows one featured challenge and the rest of the gallery below it', async ({ page }) => {
    await page.goto('')
    const featuredLink = page.getByRole('link', { name: /宝宝的口袋宇宙/ }).first()
    await expect(featuredLink).toBeVisible()
    await expect(featuredLink).toHaveAttribute('href', /\/challenges\/pocket-universe/)

    const gridLink = page.getByRole('link', { name: /宝宝的秘密房间/ }).first()
    await expect(gridLink).toBeVisible()
    await expect(gridLink).toHaveAttribute('href', /\/challenges\/secret-room/)

    // Every example image slot is honestly labeled as a placeholder, never
    // presented as finished artwork.
    await expect(page.getByText('示例插画 · 待替换').first()).toBeVisible()

    // The draft challenge must never reach the public gallery.
    await expect(page.getByText('宝宝的人生电影')).toHaveCount(0)
  })

  test('opening the featured challenge takes the parent into the detail page', async ({ page }) => {
    await page.goto('')
    await page.getByRole('link', { name: /宝宝的口袋宇宙/ }).first().click()
    await expect(page).toHaveURL(/\/challenges\/pocket-universe/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('宝宝的口袋宇宙')
  })

  test('opening a gallery card takes the parent into that challenge', async ({ page }) => {
    await page.goto('')
    await page.getByRole('link', { name: /宝宝的秘密房间/ }).first().click()
    await expect(page).toHaveURL(/\/challenges\/secret-room/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('宝宝的秘密房间')
  })
})
