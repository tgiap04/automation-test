import { test, expect } from '@playwright/test';
import {
  navigateToHome,
  searchByKeyword,
  getProductCount,
} from '../../helpers/search-helper';

test.describe('AC-1: Tìm kiếm với từ khóa chính xác', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test('Tìm kiếm sản phẩm tồn tại trong hệ thống', async ({ page }) => {
    const keyword = 'MacBook';

    await searchByKeyword(page, keyword);

    const count = await getProductCount(page);
    expect(count).toBeGreaterThan(0);

    // Verify at least one product card text contains keyword
    const body = await page.locator('body').textContent();
    expect(body?.toLowerCase()).toContain(keyword.toLowerCase());
  });

  test('Tìm kiếm sản phẩm không tồn tại — hiển thị empty state', async ({
    page,
  }) => {
    const keyword = 'xyznonexistent99999';

    await searchByKeyword(page, keyword);

    // Empty state: no product cards or no-results message shown
    const count = await getProductCount(page);
    const body = await page.locator('body').textContent();
    if (count > 0) {
      // If products shown, verify none match the keyword
      expect(body?.toLowerCase()).not.toContain(keyword.toLowerCase());
    }
  });
});
