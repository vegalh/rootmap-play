import { expect, test } from '@playwright/test'

test.describe('Routing', () => {
  const routes: Array<[string, string]> = [
    ['', '为孩子创造一段'],
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

  test('header navigation links move between product pages', async ({ page }) => {
    await page.goto('')

    // On narrow viewports the links live behind the hamburger menu.
    const menuToggle = page.getByRole('button', { name: '菜单' })
    if (await menuToggle.isVisible()) {
      await menuToggle.click()
    }
    await page.getByRole('navigation').getByRole('link', { name: '隐藏角色' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('宝宝的隐藏角色')

    if (await menuToggle.isVisible()) {
      await menuToggle.click()
    }
    await page.getByRole('navigation').getByRole('link', { name: '亲戚宇宙' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('我们家的亲戚关系宇宙')
  })
})
