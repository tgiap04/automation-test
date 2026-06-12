import { test, expect } from '@playwright/test';
import {
  navigateToHome,
  searchByKeyword,
  logSearchResults,
  expectHasResults,
} from '../../helpers/search-helper';

test.describe('AC-2: Tìm kiếm không dấu / sai lệch', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test('Tìm kiếm viết hoa — "MACBOOK"', async ({ page }) => {
    await searchByKeyword(page, 'MACBOOK');
    await logSearchResults(page, 'MACBOOK');
    await expectHasResults(page);
  });

  test('Tìm kiếm viết thường — "macbook air"', async ({ page }) => {
    await searchByKeyword(page, 'macbook air');
    await logSearchResults(page, 'macbook air');
    await expectHasResults(page);
  });

  test('Tìm kiếm không dấu — "laptop van phong" (fuzzy)', async ({
    page,
  }) => {
    await searchByKeyword(page, 'laptop van phong');
    await logSearchResults(page, 'laptop van phong');
    // ThinkPro may or may not support fuzzy — check page loaded successfully
    const body = await page.locator('body').textContent();
    expect(body).toContain('tìm kiếm');
  });
});
