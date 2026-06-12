import { test, expect } from '@playwright/test';
import {
  navigateToCategory,
  selectFilterCheckbox,
  getProductCount,
  getProductTexts,
  logFilterResults,
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
    console.log(`\n  📂 Initial products: ${initialTexts.length}`);

    let pageReloaded = false;
    page.on('load', () => {
      pageReloaded = true;
    });

    await selectFilterCheckbox(page, { group: 'brand', value: 'apple' });
    await logFilterResults(page, 'brand=apple (no-reload check)');

    expect(pageReloaded).toBe(false);
    await expectProductsDifferent(page, initialTexts);
  });

  test('URL thay đổi tương ứng khi tick filter — có thể copy chia sẻ', async ({
    page,
  }) => {
    await selectFilterCheckbox(page, { group: 'brand', value: 'asus' });
    await logFilterResults(page, 'brand=asus');
    await expectUrlContainsFilter(page, { group: 'brand', value: 'asus' });

    await selectFilterCheckbox(page, { group: 'nhu-cau', value: 'gaming' });
    await logFilterResults(page, 'brand=asus + nhu-cau=gaming');
    await expectUrlContainsFilter(page, { group: 'brand', value: 'asus' });
    await expectUrlContainsFilter(page, { group: 'nhu-cau', value: 'gaming' });
  });

  test('Bỏ chọn filter — URL thay đổi, sản phẩm cập nhật', async ({ page }) => {
    await selectFilterCheckbox(page, { group: 'brand', value: 'hp' });
    await logFilterResults(page, 'brand=hp (filtered)');
    await expectUrlContainsFilter(page, { group: 'brand', value: 'hp' });

    const filteredTexts = await getProductTexts(page);

    await selectFilterCheckbox(page, { group: 'brand', value: 'hp' });
    await logFilterResults(page, 'brand=hp (toggled off)');

    const unfilteredTexts = await getProductTexts(page);
    const hasDifference = unfilteredTexts.some(
      (text, i) => text !== filteredTexts[i],
    );
    expect(hasDifference).toBe(true);
  });
});
