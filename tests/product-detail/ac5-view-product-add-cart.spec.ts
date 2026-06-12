import { test, expect } from '@playwright/test';
import {
  navigateToProduct,
  getProductName,
  getProductPrice,
  addToCart,
  navigateToCart,
  getCartQuantity,
  getCartTotal,
  getCartSubtotal,
  getCartItemCount,
  setCartQuantity,
  parseVietnamPrice,
} from '../../helpers/product-detail-helper';

const PRODUCT_URL = '/laptop/asus-expertbook-p5-p3405cva-nz0027w?skuId=10887';
const UNIT_PRICE = '21.790.000';

test.describe('AC-5: Xem chi tiết sản phẩm và thêm vào giỏ hàng', () => {
  test('Xem chi tiết sản phẩm — hiển thị đúng tên và giá', async ({
    page,
  }) => {
    await navigateToProduct(page, PRODUCT_URL);

    const name = await getProductName(page);
    console.log(`\n  📦 Product name: ${name}`);
    expect(name).toContain('ASUS ExpertBook');

    const price = await getProductPrice(page);
    console.log(`  💰 Price: ${price}`);
    expect(price).toBe(UNIT_PRICE);
  });

  test('Thêm 1 sản phẩm vào giỏ — số lượng = 1, tổng = giá sản phẩm', async ({
    page,
  }) => {
    await navigateToProduct(page, PRODUCT_URL);
    await addToCart(page);

    await navigateToCart(page);

    const countText = await getCartItemCount(page);
    console.log(`\n  📦 Cart item count: ${countText}`);
    // 3 items = 1 product + 2 auto-added gifts
    expect(countText).toContain('sản phẩm');

    const qty = await getCartQuantity(page);
    console.log(`  🔢 Quantity: ${qty}`);
    expect(qty).toBe(1);

    const subtotal = await getCartSubtotal(page);
    console.log(`  💵 Subtotal: ${subtotal}`);
    expect(subtotal).toBe(UNIT_PRICE);

    const total = await getCartTotal(page);
    console.log(`  💵 Total: ${total}`);
    expect(total).toBe(UNIT_PRICE);
  });

  test('Thay đổi số lượng > 1 — tổng tiền cập nhật đúng', async ({
    page,
  }) => {
    await navigateToProduct(page, PRODUCT_URL);
    await addToCart(page);

    await navigateToCart(page);

    const qtyBefore = await getCartQuantity(page);
    expect(qtyBefore).toBe(1);

    const newQty = 2;
    await setCartQuantity(page, newQty);

    const qtyAfter = await getCartQuantity(page);
    console.log(`\n  🔢 Quantity changed: ${qtyBefore} → ${qtyAfter}`);
    expect(qtyAfter).toBe(newQty);

    const unitPrice = parseVietnamPrice(UNIT_PRICE);
    const expectedTotal = unitPrice * newQty;
    const expectedTotalStr = expectedTotal.toLocaleString('vi-VN');

    const total = await getCartTotal(page);
    console.log(`  💵 Total: ${total} (expected: ${expectedTotalStr})`);
    expect(parseVietnamPrice(total)).toBe(expectedTotal);
  });

  test('Thêm sản phẩm vào giỏ — tổng tiền KHÔNG phải 0', async ({
    page,
  }) => {
    await navigateToProduct(page, PRODUCT_URL);
    await addToCart(page);

    await navigateToCart(page);

    const total = await getCartTotal(page);
    console.log(`\n  💵 Total: ${total}`);
    expect(total).not.toBe('0');
    expect(total).not.toBe('');
  });

  test('Thêm sản phẩm vào giỏ — giá trong giỏ phải khớp giá sản phẩm', async ({
    page,
  }) => {
    await navigateToProduct(page, PRODUCT_URL);
    const priceOnDetail = await getProductPrice(page);
    console.log(`\n  💰 Price on detail: ${priceOnDetail}`);

    await addToCart(page);
    await navigateToCart(page);

    const subtotal = await getCartSubtotal(page);
    console.log(`  💵 Subtotal in cart: ${subtotal}`);
    expect(subtotal).toBe(priceOnDetail);
  });

  test('Thay đổi số lượng = 3 — tổng = 3 × đơn giá', async ({
    page,
  }) => {
    await navigateToProduct(page, PRODUCT_URL);
    await addToCart(page);

    await navigateToCart(page);

    const newQty = 3;
    await setCartQuantity(page, newQty);

    const qty = await getCartQuantity(page);
    expect(qty).toBe(newQty);

    const unitPrice = parseVietnamPrice(UNIT_PRICE);
    const expectedTotal = unitPrice * newQty;

    const total = await getCartTotal(page);
    console.log(`\n  🔢 Qty: ${newQty}, Total: ${total}, Expected: ${expectedTotal}`);
    expect(parseVietnamPrice(total)).toBe(expectedTotal);
  });
});
