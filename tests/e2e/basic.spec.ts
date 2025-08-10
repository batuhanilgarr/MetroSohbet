import { test, expect } from '@playwright/test'

test('KVKK modal opens from footer', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'KVKK Aydınlatma Metni' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByText('Kapat').click()
})

test('404 page renders', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await expect(page.getByText('Sayfa bulunamadı')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ana sayfaya dön' })).toBeVisible()
})


