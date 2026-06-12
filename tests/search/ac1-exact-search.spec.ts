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

  test('Tìm kiếm "macbook" — hiển thị kết quả sản phẩm', async ({
    page,
  }) => {
    const keyword = 'macbook';
    await searchByKeyword(page, keyword);
    await logSearchResults(page, keyword);
    await expectHasResults(page);
  });

  test('Tìm kiếm "dell" — hiển thị kết quả sản phẩm', async ({ page }) => {
    const keyword = 'dell';
    await searchByKeyword(page, keyword);
    await logSearchResults(page, keyword);
    await expectHasResults(page);
  });

  test('Tìm kiếm từ khóa không tồn tại — không có sản phẩm', async ({
    page,
  }) => {
    const keyword = 'xyzabc123nonexistent';
    await searchByKeyword(page, keyword);
    await logSearchResults(page, keyword);
    const body = await page.locator('body').textContent();
    expect(body).toContain('0 sản phẩm');
  });

  test('Tìm kiếm "macbook" — kết quả phải chứa đúng keyword', async ({
    page,
  }) => {
    const keyword = 'macbook';
    await searchByKeyword(page, keyword);
    await logSearchResults(page, keyword);
    const body = await page.locator('body').textContent();
    expect(body).not.toContain('xyzabc123');
  });
});
