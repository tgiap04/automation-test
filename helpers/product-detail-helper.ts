import { Page, expect } from '@playwright/test';

async function dismissOverlays(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('.t-dialog, [class*="dialog"]').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
      (el as HTMLElement).style.pointerEvents = 'none';
    });
  });
  await page.waitForTimeout(500);
}

export async function navigateToProduct(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await dismissOverlays(page);
}

export async function getProductName(page: Page): Promise<string> {
  const text = await page.locator('h1').first().textContent();
  return text?.trim() ?? '';
}

export async function getProductPrice(page: Page): Promise<string> {
  const body = await page.locator('body').textContent();
  const match = body?.match(/(\d{2,3}\.\d{3}\.\d{3})\s*\d{2,3}\.\d{3}\.\d{3}\s*-\d+%/);
  return match?.[1] ?? '';
}

export async function addToCart(page: Page) {
  const btn = page.getByRole('button', { name: 'Thêm vào giỏ' });
  await expect(btn).toBeVisible();
  await btn.click();

  // Wait for toast confirmation
  await expect(page.getByText('Đã thêm sản phẩm vào giỏ hàng')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(1000);
}

export async function navigateToCart(page: Page) {
  await page.goto('/gio-hang');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

export async function getCartQuantity(page: Page): Promise<number> {
  const input = page.locator('input[type="number"]').first();
  await expect(input).toBeVisible();
  const val = await input.inputValue();
  return parseInt(val, 10);
}

export async function getCartTotal(page: Page): Promise<string> {
  const body = await page.locator('body').textContent();
  const match = body?.match(/Tổng cộng\s*(\d[\d.]+)/);
  return match?.[1] ?? '';
}

export async function getCartSubtotal(page: Page): Promise<string> {
  const body = await page.locator('body').textContent();
  const match = body?.match(/Tạm tính\s*(\d[\d.]+)/);
  return match?.[1] ?? '';
}

export async function getCartItemCount(page: Page): Promise<string> {
  const body = await page.locator('body').textContent();
  const match = body?.match(/(\d+)\s*sản phẩm/);
  return match?.[0] ?? '';
}

export async function setCartQuantity(page: Page, qty: number) {
  const input = page.locator('input[type="number"]').first();
  await expect(input).toBeVisible();
  await input.fill(String(qty));
  await input.press('Enter');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

export function parseVietnamPrice(priceStr: string): number {
  return parseInt(priceStr.replace(/\./g, ''), 10);
}
