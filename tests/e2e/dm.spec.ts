import { test, expect } from '@playwright/test'

test('DM thread optimistic send works with mocked Supabase', async ({ page }) => {
  // Mock Supabase REST for DMs select/insert
  await page.route(/\/rest\/v1\/dms.*/, async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    }
    if (route.request().method() === 'POST') {
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify([{ id: 'srv-1' }]) })
    }
    return route.fallback()
  })

  await page.addInitScript(() => {
    try { localStorage.setItem('nickname', 'dm_tester') } catch {}
  })

  await page.goto('/dm/someone')
  await expect(page.getByText('someone')).toBeVisible()

  const input = page.getByPlaceholder('Mesaj yazın')
  await input.fill('Merhaba DM')
  await page.getByRole('button', { name: 'Gönder' }).click()

  // Optimistic bubble should appear immediately
  await expect(page.getByText('Merhaba DM')).toBeVisible()
})


