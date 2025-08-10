import { test, expect } from '@playwright/test'

test('Chat page allows sending a message with mocked APIs', async ({ page }) => {
  // Mock Supabase line active check in chat layout
  await page.route(/\/rest\/v1\/metro_lines.*name=eq\./, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ is_active: true }]) })
  })
  // Mock message send API
  await page.route('/api/messages/send', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
  })

  await page.addInitScript(() => {
    try { localStorage.setItem('nickname', 'test_user1') } catch {}
  })

  await page.goto('/chat/M10')
  // Wait for header visible
  await expect(page.getByText('Metro Sohbet Odası')).toBeVisible()

  const textarea = page.getByPlaceholder('Mesajınızı yazın...')
  await textarea.fill('Playwright test mesajı')
  await textarea.press('Enter')

  // Optimistic UI should show the message bubble immediately
  await expect(page.getByText('Playwright test mesajı')).toBeVisible()
})


