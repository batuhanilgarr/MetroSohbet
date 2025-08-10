import { test, expect } from '@playwright/test'

test('Admin Stats page renders cards (Supabase REST mocked)', async ({ page }) => {
  // Mock counts and users queries
  await page.route(/\/rest\/v1\/messages\?.*head=true.*/, async (route) => {
    // count endpoints
    return route.fulfill({ status: 200, headers: { 'content-range': '0-0/123' }, contentType: 'application/json', body: '[]' })
  })
  await page.route(/\/rest\/v1\/messages\?.*select=nickname.*/, async (route) => {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ nickname: 'a' }, { nickname: 'b' }]) })
  })
  await page.route(/\/rest\/v1\/banned_users\?.*head=true.*/, async (route) => {
    return route.fulfill({ status: 200, headers: { 'content-range': '0-0/3' }, contentType: 'application/json', body: '[]' })
  })
  await page.route(/\/rest\/v1\/metro_lines\?.*head=true.*is_active=eq.true.*/, async (route) => {
    return route.fulfill({ status: 200, headers: { 'content-range': '0-0/5' }, contentType: 'application/json', body: '[]' })
  })

  await page.addInitScript(() => {
    localStorage.setItem('adminUser', JSON.stringify({ id: 'admin-001', email: 'admin@metrosohbet.com', role: 'admin', created_at: new Date().toISOString() }))
  })

  await page.goto('/admin/stats')
  await expect(page.getByRole('heading', { name: 'İstatistikler' })).toBeVisible()
  await expect(page.getByText('Toplam Mesaj')).toBeVisible()
  await expect(page.getByText('Aktif Hat')).toBeVisible()
})


