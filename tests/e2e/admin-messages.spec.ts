import { test, expect } from '@playwright/test'

test('Admin Messages page lists messages (Supabase REST mocked)', async ({ page }) => {
  // Mock Supabase REST for messages select
  await page.route(/\/rest\/v1\/messages.*/, async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'm1', room_id: 'room-1', nickname: 'tester', content: 'hello world', created_at: new Date().toISOString() },
        ]),
      })
    }
    return route.fallback()
  })

  // Simulate admin login
  await page.addInitScript(() => {
    localStorage.setItem('adminUser', JSON.stringify({ id: 'admin-001', email: 'admin@metrosohbet.com', role: 'admin', created_at: new Date().toISOString() }))
  })

  await page.goto('/admin/messages')
  await expect(page.getByText('Mesaj Yönetimi')).toBeVisible()
  await expect(page.getByText('tester')).toBeVisible()
  await expect(page.getByText('hello world')).toBeVisible()
})


