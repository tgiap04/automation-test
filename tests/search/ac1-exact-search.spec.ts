import { test, expect } from '@playwright/test';
import {
  navigateToHome,
  searchByKeyword,
  logSearchResults,
  expectHasResults,
} from '../../helpers/search-helper';
import { SEARCH } from '../../tests/config/test-data';

test.describe('AC-1: Tìm kiếm với từ khóa chính xác', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test(`Tìm kiếm "${SEARCH.EXACT_1}" — hiển thị kết quả sản phẩm`, async ({
    page,
  }) => {
    await searchByKeyword(page, SEARCH.EXACT_1);
    await logSearchResults(page, SEARCH.EXACT_1);
    await expectHasResults(page);
  });

  test(`Tìm kiếm "${SEARCH.EXACT_2}" — hiển thị kết quả sản phẩm`, async ({
    page,
  }) => {
    await searchByKeyword(page, SEARCH.EXACT_2);
    await logSearchResults(page, SEARCH.EXACT_2);
    await expectHasResults(page);
  });
});
