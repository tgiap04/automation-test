import { Page, expect } from '@playwright/test';

const SIDEBAR_FILTER = '.section-sidebar-filter';
const PRODUCT_CARD = '.t-product-card';

type FilterOption = {
  group: string;
  value: string;
};

const FILTER_URL_MAP: Record<string, string> = {
  brand: 'thuong-hieu',
  'nhu-cau': 'nhu-cau',
  gia: 'gia',
};

async function dismissOverlays(page: Page) {
  const overlay = page.locator('.t-dialog.z-50, .the-menu');
  if (await overlay.first().isVisible().catch(() => false)) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }
}

export async function navigateToCategory(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await dismissOverlays(page);
}

export async function selectFilterCheckbox(page: Page, option: FilterOption) {
  const checkbox = page.locator(
    `${SIDEBAR_FILTER} input[type="checkbox"][value="${option.value}"]`,
  );

  await expect(checkbox).toBeVisible();
  await dismissOverlays(page);
  await checkbox.click();
  // Wait for network + Vue re-render
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
}

export async function getProductCount(page: Page): Promise<number> {
  return page.locator(PRODUCT_CARD).count();
}

export async function getProductTexts(page: Page): Promise<string[]> {
  const cards = page.locator(PRODUCT_CARD);
  const count = await cards.count();
  const texts: string[] = [];

  for (let i = 0; i < count; i++) {
    texts.push((await cards.nth(i).textContent()) ?? '');
  }

  return texts;
}

export async function expectUrlContainsFilter(
  page: Page,
  option: FilterOption,
): Promise<void> {
  const urlKey = FILTER_URL_MAP[option.group] ?? option.group;
  const url = page.url();
  expect(url).toContain(`${urlKey}=${option.value}`);
}

export async function expectProductsDifferent(
  page: Page,
  beforeTexts: string[],
): Promise<void> {
  // Wait for products to update after filter
  await page.waitForTimeout(1000);
  const afterTexts = await getProductTexts(page);
  const hasDifference = afterTexts.some(
    (text, i) => text !== beforeTexts[i],
  );
  expect(hasDifference).toBe(true);
}
