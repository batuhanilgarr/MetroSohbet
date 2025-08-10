import { test, expect } from '@playwright/test'

test('Admin Settings page renders and can toggle switches', async ({ page }) => {
  // Simulate admin login
  await page.addInitScript(() => {
    localStorage.setItem('adminUser', JSON.stringify({ id: 'admin-001', email: 'admin@metrosohbet.com', role: 'admin', created_at: new Date().toISOString() }))
  })
  await page.goto('/admin/settings')
  await expect(page.getByText('Sistem Ayarları')).toBeVisible()
  const anon = page.getByLabel('Anonim kullanıma izin ver')
  await anon.check()
  await anon.uncheck()
  await expect(anon).toBeVisible()
})


