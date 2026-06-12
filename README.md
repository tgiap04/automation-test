# Automation Test — ThinkPro

Playwright automation tests for search & filter features on [thinkpro.vn](https://thinkpro.vn).

## Prerequisites

- Node.js >= 18
- npm

## Setup

```bash
npm install
npx playwright install chromium
npx playwright install-deps chromium
```

## Run Tests

```bash
# All tests
npx playwright test

# Specific file
npx playwright test tests/search/ac1-exact-search.spec.ts

# By test name
npx playwright test -g "fuzzy search"

# UI mode (interactive)
npx playwright test --ui

# Debug mode (step-by-step)
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Single worker (sequential)
npx playwright test --workers=1
```

## Reports

```bash
# Generate HTML report
npx playwright test --reporter=html

# Open latest report
npx playwright show-report
```

## Custom Test Data

Tests read from environment variables — set your own data before running:

```bash
# Search keywords
TEST_SEARCH_EXACT_1="macbook" \
TEST_SEARCH_EXACT_2="dell" \
TEST_SEARCH_CASE_UPPER="MACBOOK" \
TEST_SEARCH_MULTI_WORD="macbook air" \
TEST_SEARCH_FUZZY="laptop van phong" \
npx playwright test

# Or export once
export TEST_SEARCH_EXACT_1="iphone"
export TEST_FILTER_BRAND_1="apple"
npx playwright test
```

### Full Variable Reference

| Variable | Default | Description |
|---|---|---|
| `TEST_SEARCH_EXACT_1` | `macbook` | AC-1: keyword #1 |
| `TEST_SEARCH_EXACT_2` | `dell` | AC-1: keyword #2 |
| `TEST_SEARCH_CASE_UPPER` | `MACBOOK` | AC-2: uppercase |
| `TEST_SEARCH_MULTI_WORD` | `macbook air` | AC-2: multi-word |
| `TEST_SEARCH_FUZZY` | `laptop van phong` | AC-2: fuzzy/typo |
| `TEST_FILTER_BRAND_1` | `apple` | AC-3/4: brand #1 |
| `TEST_FILTER_BRAND_2` | `dell` | AC-3: brand #2 |
| `TEST_FILTER_BRAND_SECOND` | `asus` | AC-4: second brand |
| `TEST_FILTER_NHU_CAU_VP` | `van-phong` | AC-3: nhu-cau filter |
| `TEST_FILTER_NHU_CAU_GAMING` | `gaming` | AC-4: gaming filter |
| `TEST_FILTER_BRAND_HP` | `hp` | AC-4: toggle-off brand |
| `TEST_CATEGORY_LAPTOP` | `/laptop` | Category path |

## Project Structure

```
├── playwright.config.ts
├── tests/
│   ├── config/
│   │   └── test-data.ts          # Env-driven test data
│   ├── helpers/
│   │   ├── search-helper.ts       # Search page interactions
│   │   └── filter-helper.ts       # Filter sidebar interactions
│   └── search/
│       ├── ac1-exact-search.spec.ts
│       ├── ac2-fuzzy-search.spec.ts
│       ├── ac3-filter.spec.ts
│       └── ac4-ajax-url.spec.ts
```

## Test Coverage

| AC | Description | Tests |
|----|-------------|-------|
| AC-1 | Search exact keyword | 2 |
| AC-2 | Fuzzy/typo search (uppercase, multi-word, fuzzy) | 3 |
| AC-3 | Multi-criteria filter + URL fragment | 3 |
| AC-4 | Ajax no-reload + URL sync + toggle off | 3 |
| **Total** | | **11** |

## Conventions

- **Locators**: `getByPlaceholder` > `getByRole` > `getByText` — no hard XPath/CSS
- **Waits**: Event-driven (`waitForLoadState`, `waitForResponse`) — minimal `waitForTimeout`
- **Modal Handling**: JS-based force removal (display:none + pointerEvents:none) for persistent overlays
- **Parallel**: 4 workers by default, tests are isolated
- **Browser**: Chromium headless, locale `vi-VN`, timezone `Asia/Ho_Chi_Minh`

## Technical Notes

### ThinkPro Modal Handling

ThinkPro shows a persistent voucher popup on first visit that blocks all interactions. Our solution:

```typescript
// Force-remove modal via JS — Escape/close button don't fully remove it
await page.evaluate(() => {
  document.querySelectorAll('.t-dialog, [class*="dialog"]').forEach((el) => {
    el.style.display = 'none';
    el.style.visibility = 'hidden';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '-9999';
  });
});

// Use force:true for input interactions
await input.fill(keyword, { force: true });
await input.press('Enter');
```

### Search Behavior

ThinkPro navigates to `/tim-kiem?keyword=...` on search. Assertions check:
- URL contains `/tim-kiem`
- Body text contains `"X sản phẩm"` (result count indicator)
- Body does NOT contain `"0 sản phẩm"` (no results)
