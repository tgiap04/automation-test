import { test, expect } from '@playwright/test';
import {
  navigateToHome,
  searchByKeyword,
  logSearchResults,
  expectHasResults,
} from '../../helpers/search-helper';
import { SEARCH } from '../../tests/config/test-data';

test.describe('AC-2: Tìm kiếm không dấu / sai lệch', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test(`Tìm kiếm viết hoa — "${SEARCH.CASE_UPPER}"`, async ({ page }) => {
    await searchByKeyword(page, SEARCH.CASE_UPPER);
    await logSearchResults(page, SEARCH.CASE_UPPER);
    await expectHasResults(page);
  });

  test(`Tìm kiếm multi-word — "${SEARCH.MULTI_WORD}"`, async ({
    page,
  }) => {
    await searchByKeyword(page, SEARCH.MULTI_WORD);
    await logSearchResults(page, SEARCH.MULTI_WORD);
    await expectHasResults(page);
  });

  test(`Tìm kiếm fuzzy — "${SEARCH.FUZZY}"`, async ({ page }) => {
    await searchByKeyword(page, SEARCH.FUZZY);
    await logSearchResults(page, SEARCH.FUZZY);
    const body = await page.locator('body').textContent();
    expect(body).toContain('tìm kiếm');
  });
});
