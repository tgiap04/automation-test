import { test, expect } from '@playwright/test';
import {
  navigateToCategory,
  selectFilterCheckbox,
  getProductCount,
  logFilterResults,
  expectUrlContainsFilter,
} from '../../helpers/filter-helper';

test.describe('AC-3: Bộ lọc đa tiêu chí trong danh mục', () => {
  test('Chọn 1 filter thương hiệu — sản phẩm phải khớp', async ({
    page,
  }) => {
    await navigateToCategory(page, '/laptop');
    const countBefore = await getProductCount(page);
    console.log(
      `\n  📂 Category: /laptop — ${countBefore} product(s) loaded`,
    );

    await selectFilterCheckbox(page, { group: 'brand', value: 'apple' });
    await logFilterResults(page, 'brand=apple');

    const countAfter = await getProductCount(page);
    expect(countAfter).toBeGreaterThan(0);
  });

  test('Chọn nhiều filter đồng thời — URL chứa cả hai param', async ({
    page,
  }) => {
    await navigateToCategory(page, '/laptop');

    await selectFilterCheckbox(page, {
      group: 'brand',
      value: 'dell',
    });
    await selectFilterCheckbox(page, {
      group: 'nhu-cau',
      value: 'van-phong',
    });
    await logFilterResults(
      page,
      'brand=dell + nhu-cau=van-phong',
    );

    await expectUrlContainsFilter(page, {
      group: 'brand',
      value: 'dell',
    });
    await expectUrlContainsFilter(page, {
      group: 'nhu-cau',
      value: 'van-phong',
    });
  });

  test('URL thay đổi đúng fragment khi chọn filter', async ({ page }) => {
    await navigateToCategory(page, '/laptop');

    await selectFilterCheckbox(page, {
      group: 'brand',
      value: 'dell',
    });
    await logFilterResults(page, 'brand=dell');

    await expectUrlContainsFilter(page, { group: 'brand', value: 'dell' });
  });

  test('Filter thương hiệu không tồn tại — checkbox không tồn tại', async ({
    page,
  }) => {
    await navigateToCategory(page, '/laptop');

    // A nonexistent brand should NOT have a checkbox in the sidebar
    const checkbox = page.locator(
      '.section-sidebar-filter input[type="checkbox"][value="nonexistentbrandxyz"]',
    );
    const exists = await checkbox.isVisible().catch(() => false);
    console.log(`\n  🔍 Nonexistent brand checkbox visible: ${exists}`);
    expect(exists).toBe(false);
  });

  test('Chọn filter apple — URL phải chứa thuong-hieu, KHÔNG chứa dell', async ({
    page,
  }) => {
    await navigateToCategory(page, '/laptop');

    await selectFilterCheckbox(page, {
      group: 'brand',
      value: 'apple',
    });
    await logFilterResults(page, 'brand=apple');

    const url = page.url();
    expect(url).toContain('thuong-hieu=apple');
    expect(url).not.toContain('thuong-hieu=dell');
  });
});
