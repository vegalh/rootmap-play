import { expect, test } from '@playwright/test'

const FIVE_ITEMS = ['恐龙', '猫咪', '小狗', '兔子', '熊猫']

async function selectFiveAndGenerate(page: import('@playwright/test').Page) {
  for (const name of FIVE_ITEMS) {
    await page.getByRole('button', { name, exact: true }).click()
  }
  await page.getByRole('button', { name: /生成我的宇宙/ }).click()
}

test.describe('Pocket Universe creator', () => {
  test('walks through selecting five things, previewing, and returning to edit', async ({ page }) => {
    await page.goto('pocket-universe')

    await expect(page.getByText('0/5')).toBeVisible()
    await expect(page.getByRole('button', { name: /生成我的宇宙/ })).toBeDisabled()

    await selectFiveAndGenerate(page)

    // The composed scene and theme switcher appear once the universe is generated.
    await expect(page.getByRole('img', { name: /插画/ })).toBeVisible()
    await expect(page.getByRole('radiogroup', { name: '选择色调' })).toBeVisible()

    await page.getByRole('button', { name: /重新选择/ }).click()
    await expect(page.getByText('5/5')).toBeVisible()
    await expect(page.getByRole('button', { name: '恐龙', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  test('changes the color theme and regenerates the layout', async ({ page }) => {
    await page.goto('pocket-universe')
    await selectFiveAndGenerate(page)

    const duskTheme = page.getByRole('radio', { name: '黄昏暖阳' })
    await duskTheme.click()
    await expect(duskTheme).toHaveAttribute('aria-checked', 'true')

    const sceneBefore = await page.getByRole('img', { name: /插画/ }).innerHTML()
    await page.getByRole('button', { name: '换一种排列' }).click()
    const sceneAfter = await page.getByRole('img', { name: /插画/ }).innerHTML()
    expect(sceneAfter).not.toEqual(sceneBefore)
  })

  test('downloads a real PNG and surfaces the optional rating prompt', async ({ page }) => {
    await page.goto('pocket-universe')
    await selectFiveAndGenerate(page)

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /下载高清图片/ }).click(),
    ])

    expect(download.suggestedFilename()).toBe('rootmap-play-pocket-universe.png')
    await expect(page.getByText('已保存到你的设备')).toBeVisible()

    await expect(page.getByText('这次创作体验怎么样？')).toBeVisible()
    await page.getByRole('radio', { name: '2 星' }).click()
    await page.getByRole('button', { name: '作品不够好看' }).click()
    await expect(page.getByText('感谢你的反馈')).toBeVisible()
  })
})
