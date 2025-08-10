import { test, expect } from '@playwright/test'

test('Admin Lines page lists metro lines (Supabase REST mocked)', async ({ page }) => {
  await page.route(/\/rest\/v1\/metro_lines.*/, async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'l1', name: 'M1', display_name: 'M1 - A', color: '#ff0000', is_active: true, created_at: new Date().toISOString() },
          { id: 'l2', name: 'M2', display_name: 'M2 - B', color: '#00ff00', is_active: false, created_at: new Date().toISOString() },
        ]),
      })
    }
    return route.fallback()
  })

  await page.addInitScript(() => {
    localStorage.setItem('adminUser', JSON.stringify({ id: 'admin-001', email: 'admin@metrosohbet.com', role: 'admin', created_at: new Date().toISOString() }))
  })

  await page.goto('/admin/lines')
  await expect(page.getByText('Metro Hatları Yönetimi')).toBeVisible()
  await expect(page.getByText('M1 - A')).toBeVisible()
  await expect(page.getByText('M2 - B')).toBeVisible()
})


