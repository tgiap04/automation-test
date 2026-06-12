/**
 * Test data — reads from environment variables with sensible defaults.
 * Override by setting env vars before running tests:
 *   TEST_SEARCH_KEYWORD=macbook TEST_FILTER_BRAND=apple npx playwright test
 */

/* ---------- Search keywords ---------- */
export const SEARCH = {
  /** AC-1: exact keyword #1 */
  EXACT_1: process.env.TEST_SEARCH_EXACT_1 ?? 'macbook',
  /** AC-1: exact keyword #2 */
  EXACT_2: process.env.TEST_SEARCH_EXACT_2 ?? 'dell',
  /** AC-2: uppercase (case-insensitive test) */
  CASE_UPPER: process.env.TEST_SEARCH_CASE_UPPER ?? 'MACBOOK',
  /** AC-2: multi-word keyword */
  MULTI_WORD: process.env.TEST_SEARCH_MULTI_WORD ?? 'macbook air',
  /** AC-2: fuzzy / typo keyword */
  FUZZY: process.env.TEST_SEARCH_FUZZY ?? 'laptop van phong',
};

/* ---------- Filter values ---------- */
export const FILTER = {
  /** AC-3/4: brand filter #1 */
  BRAND_1: process.env.TEST_FILTER_BRAND_1 ?? 'apple',
  /** AC-3/4: brand filter #2 */
  BRAND_2: process.env.TEST_FILTER_BRAND_2 ?? 'dell',
  /** AC-3/4: second brand (multi-filter test) */
  BRAND_SECOND: process.env.TEST_FILTER_BRAND_SECOND ?? 'asus',
  /** AC-3/4: usage filter — "văn phòng" */
  NHU_CAU_VAN_PHONG: process.env.TEST_FILTER_NHU_CAU_VP ?? 'van-phong',
  /** AC-3/4: usage filter — "gaming" */
  NHU_CAU_GAMING: process.env.TEST_FILTER_NHU_CAU_GAMING ?? 'gaming',
  /** AC-3/4: brand filter — "hp" (toggle off test) */
  BRAND_HP: process.env.TEST_FILTER_BRAND_HP ?? 'hp',
};

/* ---------- Category paths ---------- */
export const CATEGORY = {
  LAPTOP: process.env.TEST_CATEGORY_LAPTOP ?? '/laptop',
};
