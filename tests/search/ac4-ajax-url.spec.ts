import { test, expect } from '@playwright/test';
import {
  navigateToCategory,
  selectFilterCheckbox,
  getProductTexts,
  logFilterResults,
  expectUrlContainsFilter,
  expectProductsDifferent,
} from '../../helpers/filter-helper';
import { FILTER, CATEGORY } from '../../tests/config/test-data';

test.describe('AC-4: Cập nhật real-time qua Ajax (không reload trang)', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCategory(page, CATEGORY.LAPTOP);
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

    await selectFilterCheckbox(page, {
      group: 'brand',
      value: FILTER.BRAND_1,
    });
    await logFilterResults(page, `brand=${FILTER.BRAND_1} (no-reload check)`);

    expect(pageReloaded).toBe(false);
    await expectProductsDifferent(page, initialTexts);
  });

  test('URL thay đổi tương ứng khi tick filter — có thể copy chia sẻ', async ({
    page,
  }) => {
    await selectFilterCheckbox(page, {
      group: 'brand',
      value: FILTER.BRAND_SECOND,
    });
    await logFilterResults(page, `brand=${FILTER.BRAND_SECOND}`);
    await expectUrlContainsFilter(page, {
      group: 'brand',
      value: FILTER.BRAND_SECOND,
    });

    await selectFilterCheckbox(page, {
      group: 'nhu-cau',
      value: FILTER.NHU_CAU_GAMING,
    });
    await logFilterResults(
      page,
      `brand=${FILTER.BRAND_SECOND} + nhu-cau=${FILTER.NHU_CAU_GAMING}`,
    );
    await expectUrlContainsFilter(page, {
      group: 'brand',
      value: FILTER.BRAND_SECOND,
    });
    await expectUrlContainsFilter(page, {
      group: 'nhu-cau',
      value: FILTER.NHU_CAU_GAMING,
    });
  });

  test('Bỏ chọn filter — URL thay đổi, sản phẩm cập nhật', async ({
    page,
  }) => {
    await selectFilterCheckbox(page, { group: 'brand', value: FILTER.BRAND_HP });
    await logFilterResults(page, `brand=${FILTER.BRAND_HP} (filtered)`);
    await expectUrlContainsFilter(page, {
      group: 'brand',
      value: FILTER.BRAND_HP,
    });

    const filteredTexts = await getProductTexts(page);

    await selectFilterCheckbox(page, { group: 'brand', value: FILTER.BRAND_HP });
    await logFilterResults(page, `brand=${FILTER.BRAND_HP} (toggled off)`);

    const unfilteredTexts = await getProductTexts(page);
    const hasDifference = unfilteredTexts.some(
      (text, i) => text !== filteredTexts[i],
    );
    expect(hasDifference).toBe(true);
  });
});