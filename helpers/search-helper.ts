import { Page, expect } from '@playwright/test';

const SEARCH_PLACEHOLDER = 'Xin chào, bạn đang tìm gì?';

export async function navigateToHome(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

export async function searchByKeyword(page: Page, keyword: string) {
  const input = page.getByPlaceholder(SEARCH_PLACEHOLDER);
  await input.fill(keyword);
  await input.press('Enter');
  await page.waitForLoadState('networkidle');
}

export async function getProductCount(page: Page): Promise<number> {
  return page.locator('.t-product-card').count();
}

export async function expectProductTitlesContain(
  page: Page,
  keyword: string,
): Promise<void> {
  const cards = page.locator('.t-product-card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);

  const keywordLower = keyword.toLowerCase();
  let matchCount = 0;

  for (let i = 0; i < count; i++) {
    const text = (await cards.nth(i).textContent()) ?? '';
    if (text.toLowerCase().includes(keywordLower)) {
      matchCount++;
    }
  }

  expect(matchCount).toBeGreaterThan(0);
}

export async function expectNoResults(page: Page): Promise<void> {
  const cards = page.locator('.t-product-card');
  const count = await cards.count();
  // Either no product cards shown, or page shows "không tìm thấy" message
  if (count === 0) return;
  const body = await page.locator('body').textContent();
  expect(body?.toLowerCase()).toContain('không tìm thấy');
}
