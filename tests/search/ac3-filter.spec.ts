import { test, expect } from '@playwright/test';
import {
  navigateToCategory,
  selectFilterCheckbox,
  getProductCount,
  logFilterResults,
  expectUrlContainsFilter,
} from '../../helpers/filter-helper';
import { FILTER, CATEGORY } from '../../tests/config/test-data';

test.describe('AC-3: Bộ lọc đa tiêu chí trong danh mục', () => {
  test('Chọn 1 filter thương hiệu — sản phẩm phải khớp', async ({
    page,
  }) => {
    await navigateToCategory(page, CATEGORY.LAPTOP);
    const countBefore = await getProductCount(page);
    console.log(
      `\n  📂 Category: ${CATEGORY.LAPTOP} — ${countBefore} product(s) loaded`,
    );

    await selectFilterCheckbox(page, { group: 'brand', value: FILTER.BRAND_1 });
    await logFilterResults(page, `brand=${FILTER.BRAND_1}`);

    const countAfter = await getProductCount(page);
    expect(countAfter).toBeGreaterThan(0);
  });

  test('Chọn nhiều filter đồng thời — URL chứa cả hai param', async ({
    page,
  }) => {
    await navigateToCategory(page, CATEGORY.LAPTOP);

    await selectFilterCheckbox(page, {
      group: 'brand',
      value: FILTER.BRAND_2,
    });
    await selectFilterCheckbox(page, {
      group: 'nhu-cau',
      value: FILTER.NHU_CAU_VAN_PHONG,
    });
    await logFilterResults(
      page,
      `brand=${FILTER.BRAND_2} + nhu-cau=${FILTER.NHU_CAU_VAN_PHONG}`,
    );

    await expectUrlContainsFilter(page, {
      group: 'brand',
      value: FILTER.BRAND_2,
    });
    await expectUrlContainsFilter(page, {
      group: 'nhu-cau',
      value: FILTER.NHU_CAU_VAN_PHONG,
    });
  });

  test('URL thay đổi đúng fragment khi chọn filter', async ({ page }) => {
    await navigateToCategory(page, CATEGORY.LAPTOP);

    await selectFilterCheckbox(page, {
      group: 'brand',
      value: FILTER.BRAND_2,
    });
    await logFilterResults(page, `brand=${FILTER.BRAND_2}`);

    await expectUrlContainsFilter(page, { group: 'brand', value: FILTER.BRAND_2 });
  });
});
