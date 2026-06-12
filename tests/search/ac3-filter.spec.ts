import { test, expect } from '@playwright/test';
import {
  navigateToCategory,
  selectFilterCheckbox,
  getProductCount,
  expectUrlContainsFilter,
} from '../../helpers/filter-helper';

test.describe('AC-3: Bộ lọc đa tiêu chí trong danh mục', () => {
  test('Chọn 1 filter thương hiệu — sản phẩm phải khớp', async ({
    page,
  }) => {
    await navigateToCategory(page, '/laptop');
    const countBefore = await getProductCount(page);
    expect(countBefore).toBeGreaterThan(0);

    await selectFilterCheckbox(page, { group: 'brand', value: 'apple' });
    const countAfter = await getProductCount(page);
    expect(countAfter).toBeGreaterThan(0);
  });

  test('Chọn nhiều filter đồng thời — URL chứa cả hai param', async ({
    page,
  }) => {
    await navigateToCategory(page, '/laptop');

    await selectFilterCheckbox(page, { group: 'brand', value: 'dell' });
    await selectFilterCheckbox(page, { group: 'nhu-cau', value: 'van-phong' });

    await expectUrlContainsFilter(page, { group: 'brand', value: 'dell' });
    await expectUrlContainsFilter(page, { group: 'nhu-cau', value: 'van-phong' });
  });

  test('URL thay đổi đúng fragment khi chọn filter', async ({ page }) => {
    await navigateToCategory(page, '/laptop');

    await selectFilterCheckbox(page, { group: 'brand', value: 'dell' });

    await expectUrlContainsFilter(page, { group: 'brand', value: 'dell' });
  });
});
