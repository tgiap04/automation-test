import { test, expect } from '@playwright/test';
import {
  navigateToHome,
  searchByKeyword,
  logSearchResults,
  expectHasResults,
} from '../../helpers/search-helper';

test.describe('AC-1: Tìm kiếm với từ khóa chính xác', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test('Tìm kiếm "macbook" — hiển thị kết quả sản phẩm', async ({ page }) => {
    await searchByKeyword(page, 'macbook');
    await logSearchResults(page, 'macbook');
    await expectHasResults(page);
  });

  test('Tìm kiếm "dell" — hiển thị kết quả sản phẩm', async ({ page }) => {
    await searchByKeyword(page, 'dell');
    await logSearchResults(page, 'dell');
    await expectHasResults(page);
  });
});
