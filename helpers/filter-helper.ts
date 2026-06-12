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
  // Remove modal overlay via JS — Escape/close button may not fully remove it
  await page.evaluate(() => {
    document.querySelectorAll('.t-dialog, [class*="dialog"]').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
      (el as HTMLElement).style.pointerEvents = 'none';
    });
  });
  await page.waitForTimeout(500);
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
  await checkbox.click({ force: true });
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

export async function getProductNames(page: Page): Promise<string[]> {
  const cards = page.locator(PRODUCT_CARD);
  const count = await cards.count();
  const names: string[] = [];

  for (let i = 0; i < count; i++) {
    const text = (await cards.nth(i).textContent()) ?? '';
    const name = text.split(/\d{2,3}\.\d{3}/)[0].trim().substring(0, 80);
    names.push(name);
  }

  return names;
}

export async function logFilterResults(page: Page, filters: string) {
  const count = await getProductCount(page);
  const names = await getProductNames(page);
  const url = page.url();

  console.log(`\n  🏷️  Filter: ${filters}`);
  console.log(`  🔗 URL: ${url}`);
  console.log(`  📦 Results: ${count} product(s)`);
  if (names.length > 0) {
    console.log(`  📋 Top products:`);
    names.slice(0, 5).forEach((name, i) => {
      console.log(`     ${i + 1}. ${name}`);
    });
  }
}

export async function expectProductsDifferent(
  page: Page,
  beforeTexts: string[],
): Promise<void> {
  await page.waitForTimeout(1000);
  const afterTexts = await getProductTexts(page);
  const hasDifference = afterTexts.some(
    (text, i) => text !== beforeTexts[i],
  );
  expect(hasDifference).toBe(true);
}
