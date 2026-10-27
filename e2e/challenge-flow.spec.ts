import { expect, test } from '@playwright/test'

test.describe('Challenge flow: gallery → detail → generate → copy → edit', () => {
  test('walks all the way through the pocket-universe challenge', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.goto('')
    await page.getByRole('link', { name: /宝宝的口袋宇宙/ }).first().click()
    await expect(page).toHaveURL(/\/challenges\/pocket-universe/)

    // Submitting with the required fields empty blocks progress and explains why.
    await page.getByRole('button', { name: /生成我的创作咒语/ }).click()
    await expect(page.getByRole('alert').first()).toBeVisible()

    await page.getByLabel('宝宝最近最喜欢什么？').fill('恐龙和星星')
    await page.getByRole('radio', { name: '温暖、梦幻' }).click()
    await page.getByRole('button', { name: /生成我的创作咒语/ }).click()

    await expect(page.getByRole('heading', { name: '你的专属创作咒语' })).toBeVisible()
    await expect(page.getByText('恐龙和星星')).toBeVisible()

    await page.getByRole('button', { name: '复制创作咒语' }).click()
    await expect(page.getByRole('button', { name: /已复制/ })).toBeVisible()

    const chatGptLink = page.getByRole('link', { name: '打开 ChatGPT' })
    await expect(chatGptLink).toHaveAttribute('href', 'https://chat.openai.com/')
    await expect(chatGptLink).toHaveAttribute('target', '_blank')

    // "修改我的回答" returns to the form with the previous answer preserved.
    await page.getByRole('button', { name: /修改我的回答/ }).click()
    await expect(page.getByLabel('宝宝最近最喜欢什么？')).toHaveValue('恐龙和星星')
  })

  test('an unknown challenge slug shows a friendly not-found state with a way back', async ({
    page,
  }) => {
    await page.goto('challenges/does-not-exist')
    await expect(page.getByText('这个挑战还没准备好')).toBeVisible()
    await page.getByRole('link', { name: '← 回到小屋' }).click()
    await expect(page).toHaveURL(/\/rootmap-play\/?$/)
  })
})
