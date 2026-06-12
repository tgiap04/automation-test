import { test, expect } from '@playwright/test';
import {
  navigateToHome,
  searchByKeyword,
} from '../../helpers/search-helper';
import {
  navigateToProduct,
  navigateToCart,
  addToCart,
  getCartTotal,
} from '../../helpers/product-detail-helper';

test.describe('TC-F: Các trường hợp unexpected — website không đáp ứng đúng', () => {
  test('Tìm kiếm "cơm tấm" — kỳ vọng 0 sản phẩm laptop, nhưng site trả về nhiều kết quả', async ({
    page,
  }) => {
    await navigateToHome(page);
    await searchByKeyword(page, 'cơm tấm');

    const cardCount = await page.locator('.t-product-card').count();
    const body = await page.locator('body').textContent();
    const hasZero = body?.includes('0 sản phẩm');

    console.log(`\n  🔍 Search "cơm tấm"`);
    console.log(`  📦 Product cards: ${cardCount}`);
    console.log(`  Has "0 sản phẩm": ${hasZero}`);

    // Site returns results for unrelated keyword OR shows "0 sản phẩm"
    // Either way is a failure: wrong results or no results for a valid query
    expect(cardCount).toBeGreaterThan(0);
    // The results are laptops, not "cơm tấm" — expect keyword mismatch
    expect(body).toContain('cơm tấm');
  });

  test('Tìm kiếm "!@#$%^&*" — kỳ vọng 0 sản phẩm, site redirect về homepage thay vì hiển thị lỗi', async ({
    page,
  }) => {
    await navigateToHome(page);
    await searchByKeyword(page, '!@#$%^&*');

    const url = page.url();
    console.log(`\n  🔍 Search "!@#$%^&*"`);
    console.log(`  🔗 URL: ${url}`);

    // Site silently redirects to homepage — no search results page shown
    // Expect to FAIL: search should show /tim-kiem page with 0 results
    expect(url).toContain('/tim-kiem');
  });

  test('URL sản phẩm không tồn tại — kỳ vọng redirect về trang chủ, nhưng site trả 404', async ({
    page,
  }) => {
    const resp = await page.goto(
      '/laptop/this-laptop-definitely-does-not-exist-xyz123',
    );
    console.log(`\n  🔗 Fake URL: /laptop/this-laptop-definitely-does-not-exist-xyz123`);
    console.log(`  📊 Status: ${resp?.status()}`);

    // Expect to FAIL: site should redirect to home (301/302), but returns 404
    expect(resp?.status()).toBe(200);
  });

  test('URL sản phẩm không tồn tại — kỳ vọng h1 là tên SP, nhưng site hiển thị "Không thể tải trang"', async ({
    page,
  }) => {
    await page.goto('/laptop/macbook-air-m4-fake-sku-999');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const h1 = await page.locator('h1').first().textContent();
    console.log(`\n  🔗 Fake URL: /laptop/macbook-air-m4-fake-sku-999`);
    console.log(`  📝 h1 text: "${h1?.trim()}"`);

    // Expect to FAIL: h1 shows error page, not product name
    expect(h1?.trim()).not.toBe('Không thể tải trang này');
  });

  test('Giỏ hàng trống — kỳ vọng Tổng cộng > 0, nhưng thực tế = 0', async ({
    page,
  }) => {
    await navigateToCart(page);

    const body = await page.locator('body').textContent();
    const totalMatch = body?.match(/Tổng cộng\s*(\d[\d.]+)/);
    const total = totalMatch?.[1] ?? '';

    console.log(`\n  🛒 Empty cart`);
    console.log(`  💵 Total: "${total || '(not found)'}"`);

    // Expect to FAIL: empty cart should have 0 total
    expect(total).not.toBe('');
    expect(parseInt(total.replace(/\./g, ''), 10)).toBeGreaterThan(0);
  });

  test('Thêm SP giá 21.790.000 vào giỏ — kỳ vọng Tổng = 50.000.000 (sai)', async ({
    page,
  }) => {
    await navigateToProduct(
      page,
      '/laptop/asus-expertbook-p5-p3405cva-nz0027w?skuId=10887',
    );
    await addToCart(page);
    await navigateToCart(page);

    const total = await getCartTotal(page);
    console.log(`\n  🛒 Cart total: ${total}`);
    console.log(`  ❌ Expected 50.000.000 but got ${total}`);

    // Expect to FAIL: wrong expected total
    expect(total).toBe('50.000.000');
  });

  test('Tìm kiếm "điện thoại iPhone" — kỳ vọng có kết quả, nhưng search redirect về trang chủ', async ({
    page,
  }) => {
    await navigateToHome(page);
    await searchByKeyword(page, 'điện thoại iPhone');

    const url = page.url();
    const isSearchPage = url.includes('/tim-kiem');
    console.log(`\n  🔍 Search "điện thoại iPhone"`);
    console.log(`  🔗 URL: ${url}`);
    console.log(`  ❌ Expected /tim-kiem page, but redirected to: ${url}`);

    // Expect to FAIL: should stay on search page, not redirect
    expect(isSearchPage).toBe(true);
  });
});
