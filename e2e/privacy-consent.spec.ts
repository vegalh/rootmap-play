import { expect, test } from '@playwright/test'

test.describe('Privacy notice', () => {
  test('appears on first visit and disappears after accepting', async ({ page }) => {
    await page.goto('')

    const notice = page.getByText('匿名使用数据')
    await expect(notice).toBeVisible()

    await page.getByRole('button', { name: '好的，我知道了' }).click()
    await expect(notice).not.toBeVisible()
  })

  test('does not reappear on a later visit after a choice is made', async ({ page }) => {
    await page.goto('')
    await page.getByRole('button', { name: '暂不同意' }).click()

    await page.reload()
    await expect(page.getByText('匿名使用数据')).not.toBeVisible()
  })
})
