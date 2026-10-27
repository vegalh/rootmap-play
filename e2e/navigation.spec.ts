import { expect, test } from '@playwright/test'

test.describe('Routing', () => {
  const routes: Array<[string, string]> = [
    ['', '欢迎来到'],
    ['challenges/pocket-universe', '宝宝的口袋宇宙'],
    ['challenges/secret-room', '宝宝的秘密房间'],
    ['pocket-universe', '宝宝的口袋宇宙'],
    ['little-hero', '宝宝的隐藏角色'],
    ['family-universe', '我们家的亲戚关系宇宙'],
    ['privacy', '隐私说明'],
  ]

  for (const [path, heading] of routes) {
    test(`direct navigation to /${path} renders without a broken route`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.ok()).toBeTruthy()
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)
    })
  }

  test('an unknown route shows a friendly 404 with a way back home', async ({ page }) => {
    await page.goto('this-page-does-not-exist')
    await expect(page.getByText('404')).toBeVisible()
    await page.getByRole('link', { name: '回到首页' }).click()
    await expect(page).toHaveURL(/\/rootmap-play\/?$/)
  })

  test('the header has no hamburger menu on mobile — only the logo and a privacy link', async ({
    page,
  }) => {
    await page.goto('')
    await expect(page.getByRole('button', { name: /菜单|menu/i })).toHaveCount(0)
    await expect(page.getByRole('banner').getByRole('link', { name: '隐私说明' })).toBeVisible()
  })

  test('the logo always returns to the homepage from a product page', async ({ page }) => {
    await page.goto('little-hero')
    await page.getByRole('banner').getByRole('link', { name: /RootMap/ }).click()
    await expect(page).toHaveURL(/\/rootmap-play\/?$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('欢迎来到')
  })

  test('the header privacy link is reachable from any page', async ({ page }) => {
    await page.goto('pocket-universe')
    await page.getByRole('banner').getByRole('link', { name: '隐私说明' }).click()
    await expect(page).toHaveURL(/privacy/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('隐私说明')
  })
})
