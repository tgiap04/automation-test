import { test, expect } from '@playwright/test';
import {
  navigateToHome,
  searchByKeyword,
  getProductCount,
} from '../../helpers/search-helper';

test.describe('AC-2: Tìm kiếm thông minh (Fuzzy Search)', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test('Tìm kiếm không dấu phải trả kết quả tương đương', async ({
    page,
  }) => {
    await searchByKeyword(page, 'laptop van phong');
    const count = await getProductCount(page);
    expect(count).toBeGreaterThan(0);
  });

  test('Tìm kiếm viết thường phải trả kết quả', async ({ page }) => {
    await searchByKeyword(page, 'macbook');
    const count = await getProductCount(page);
    expect(count).toBeGreaterThan(0);
  });

  test('Tìm kiếm sai chính tả nhẹ phải gợi ý kết quả', async ({ page }) => {
    await searchByKeyword(page, 'macbok m3');
    const count = await getProductCount(page);
    expect(count).toBeGreaterThan(0);
  });

  test('Tìm kiếm từ khóa ngắn vẫn trả kết quả', async ({ page }) => {
    await searchByKeyword(page, 'dell');
    const count = await getProductCount(page);
    expect(count).toBeGreaterThan(0);
  });
});
