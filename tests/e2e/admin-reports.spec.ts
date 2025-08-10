import { test, expect } from '@playwright/test'

test('Admin can view reports list (API mocked)', async ({ page }) => {
  // Mock reports list API
  await page.route('/api/admin/reports/list', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ rows: [
        { report: { id: 'r1', message_id: 'm1', reason: 'spam', created_at: new Date().toISOString() }, message: { id: 'm1', room_id: 'room', nickname: 'ali', content: 'link', created_at: new Date().toISOString() } },
      ] }),
    })
  })

  // Simulate admin login
  await page.addInitScript(() => {
    localStorage.setItem('adminUser', JSON.stringify({ id: 'admin-001', email: 'admin@metrosohbet.com', role: 'admin', created_at: new Date().toISOString() }))
  })

  // Ensure client-side fetch is mocked even if route misses
  await page.addInitScript(() => {
    const orig = window.fetch
    window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : (input as URL).toString()
      if (url.includes('/api/admin/reports/list')) {
        const body = JSON.stringify({ rows: [
          { report: { id: 'r1', message_id: 'm1', reason: 'spam', created_at: new Date().toISOString() }, message: { id: 'm1', room_id: 'room', nickname: 'ali', content: 'link', created_at: new Date().toISOString() } },
        ] })
        return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      return orig(input as any, init)
    }) as any
  })

  await page.goto('/admin/reports')
  await expect(page.getByText('Raporlanan Mesajlar')).toBeVisible()
  await expect(page.getByText(/spam/i)).toBeVisible()
  await expect(page.getByText(/ali: link/i)).toBeVisible()
})


