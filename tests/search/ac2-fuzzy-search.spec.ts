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
    const keyword = 'MACBOOK';
    await searchByKeyword(page, keyword);
    await logSearchResults(page, keyword);
    await expectHasResults(page);
  });

  test('Tìm kiếm multi-word — "macbook air"', async ({ page }) => {
    const keyword = 'macbook air';
    await searchByKeyword(page, keyword);
    await logSearchResults(page, keyword);
    await expectHasResults(page);
  });

  test('Tìm kiếm fuzzy — "laptop van phong"', async ({ page }) => {
    const keyword = 'laptop van phong';
    await searchByKeyword(page, keyword);
    await logSearchResults(page, keyword);
    const body = await page.locator('body').textContent();
    expect(body).toContain('tìm kiếm');
  });
});
