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

## Project Structure

```
├── playwright.config.ts
├── helpers/
│   ├── search-helper.ts       # Search page interactions
│   └── filter-helper.ts       # Filter sidebar interactions
├── tests/search/
│   ├── ac1-exact-search.spec.ts   # AC-1: Exact keyword search
│   ├── ac2-fuzzy-search.spec.ts   # AC-2: Fuzzy/typo search
│   ├── ac3-filter.spec.ts         # AC-3: Multi-criteria filter
│   └── ac4-ajax-url.spec.ts       # AC-4: Ajax real-time + URL sync
```

## Test Coverage

| AC | Description | Tests |
|----|-------------|-------|
| AC-1 | Search exact keyword | 2 |
| AC-2 | Fuzzy search (no-diacritics, typo, lowercase) | 4 |
| AC-3 | Multi-criteria filter + URL fragment | 3 |
| AC-4 | Ajax no-reload + URL sync + toggle off | 3 |
| **Total** | | **12** |

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

ThinkPro is a SPA — search doesn't navigate to a new URL. Results render inline on the same page (`/`). Our assertions check:
- Product cards appear (`.t-product-card`)
- At least one card text contains the search keyword
