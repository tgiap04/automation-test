import { Page, expect } from '@playwright/test';

const SEARCH_PLACEHOLDER = 'Xin chào, bạn đang tìm gì?';

async function dismissModal(page: Page) {
  // Force-remove ThinkPro voucher popup via JS
  await page.evaluate(() => {
    document.querySelectorAll('.t-dialog, [class*="dialog"]').forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.display = 'none';
      htmlEl.style.pointerEvents = 'none';
    });
  });
  await page.waitForTimeout(500);
}

export async function navigateToHome(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await dismissModal(page);
}

export async function searchByKeyword(page: Page, keyword: string) {
  await dismissModal(page);

  const input = page.getByPlaceholder(SEARCH_PLACEHOLDER);
  await expect(input).toBeVisible();

  // pressSequentially triggers Vue @input events correctly
  await input.click({ force: true });
  await input.fill('', { force: true });
  await input.pressSequentially(keyword, { delay: 30 });

  await page.waitForTimeout(500);
  await input.press('Enter');

  // Wait for SPA to navigate to /tim-kiem and render results
  await page.waitForURL(/\/tim-kiem/, { timeout: 15000 }).catch(() => {});
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

export async function getProductCount(page: Page): Promise<number> {
  return page.locator('.t-product-card').count();
}

export async function getResultCountText(page: Page): Promise<string> {
  const body = await page.locator('body').textContent();
  const match = body?.match(/(\d+)\s*sản phẩm/);
  return match?.[0] ?? 'unknown';
}

export async function getProductNames(page: Page): Promise<string[]> {
  const cards = page.locator('.t-product-card');
  const count = await cards.count();
  const names: string[] = [];

  for (let i = 0; i < count; i++) {
    const text = (await cards.nth(i).textContent()) ?? '';
    const name = text.split(/\d{2,3}\.\d{3}/)[0].trim().substring(0, 80);
    names.push(name);
  }

  return names;
}

export async function logSearchResults(page: Page, keyword: string) {
  const count = await getProductCount(page);
  const resultText = await getResultCountText(page);
  const names = await getProductNames(page);

  console.log(`\n  🔍 Search: "${keyword}"`);
  console.log(`  📦 Result text: ${resultText}`);
  console.log(`  🃏 Product cards: ${count}`);
  if (names.length > 0) {
    console.log(`  📋 Top products:`);
    names.slice(0, 5).forEach((name, i) => {
      console.log(`     ${i + 1}. ${name}`);
    });
  }
}

export async function expectHasResults(page: Page) {
  const body = await page.locator('body').textContent();
  expect(body).toContain('sản phẩm');
  expect(body).not.toContain('0 sản phẩm');
}
