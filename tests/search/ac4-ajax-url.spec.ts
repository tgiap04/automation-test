import { test, expect } from '@playwright/test';
import {
  navigateToCategory,
  selectFilterCheckbox,
  getProductCount,
  getProductTexts,
  expectUrlContainsFilter,
  expectProductsDifferent,
} from '../../helpers/filter-helper';

test.describe('AC-4: Cập nhật real-time qua Ajax (không reload trang)', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCategory(page, '/laptop');
  });

  test('Chọn filter — không reload trang, sản phẩm cập nhật ngay', async ({
    page,
  }) => {
    const initialTexts = await getProductTexts(page);
    expect(initialTexts.length).toBeGreaterThan(0);

    let pageReloaded = false;
    page.on('load', () => {
      pageReloaded = true;
    });

    await selectFilterCheckbox(page, { group: 'brand', value: 'apple' });

    expect(pageReloaded).toBe(false);
    await expectProductsDifferent(page, initialTexts);
  });

  test('URL thay đổi tương ứng khi tick filter — có thể copy chia sẻ', async ({
    page,
  }) => {
    await selectFilterCheckbox(page, { group: 'brand', value: 'asus' });
    await expectUrlContainsFilter(page, { group: 'brand', value: 'asus' });

    await selectFilterCheckbox(page, { group: 'nhu-cau', value: 'gaming' });
    await expectUrlContainsFilter(page, { group: 'brand', value: 'asus' });
    await expectUrlContainsFilter(page, { group: 'nhu-cau', value: 'gaming' });
  });

  test('Bỏ chọn filter — URL thay đổi, sản phẩm cập nhật', async ({ page }) => {
    // Select filter
    await selectFilterCheckbox(page, { group: 'brand', value: 'hp' });
    await expectUrlContainsFilter(page, { group: 'brand', value: 'hp' });

    const filteredTexts = await getProductTexts(page);

    // Toggle off same filter
    await selectFilterCheckbox(page, { group: 'brand', value: 'hp' });

    const unfilteredTexts = await getProductTexts(page);
    // Products should differ after unselecting filter
    const hasDifference = unfilteredTexts.some(
      (text, i) => text !== filteredTexts[i],
    );
    expect(hasDifference).toBe(true);
  });
});
