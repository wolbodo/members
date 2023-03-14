import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByPlaceholder('Use your nickname').fill('klaas');
  await page.getByLabel('Password').fill('test');
  await page.getByLabel('Password').press('Enter');

  await page.getByRole('link', { name: 'Create' }).click();
  await page.getByLabel('name', { exact: true }).fill('New');
  await page.getByLabel('email').fill('new@example.com');
  await page.getByRole('button', { name: 'Submit' }).click();
});