# US-001: Chức năng Tìm kiếm & Bộ lọc Sản phẩm trên ThinkPro

## 1. User Story

> **Là một** khách hàng mua sắm thiết bị công nghệ trên website **ThinkPro (thinkpro.vn)**,
> **Tôi muốn** tìm kiếm sản phẩm bằng từ khóa tự do và sử dụng bộ lọc linh hoạt (thương hiệu, mức giá, nhu cầu sử dụng),
> **Để** nhanh chóng chọn được laptop hoặc phụ kiện phù hợp giữa hàng ngàn sản phẩm trên web.

---

## 2. Acceptance Criteria

### AC-1: Tìm kiếm với từ khóa chính xác

**Scenario:** Tìm kiếm sản phẩm tồn tại trong hệ thống

| Step | Actor | Action |
|------|-------|--------|
| Given | Người dùng | Đang truy cập bất kỳ trang nào có thanh tìm kiếm trên `thinkpro.vn` |
| When | Người dùng | Nhập từ khóa chính xác (VD: "MacBook M3") và nhấn **Enter** hoặc biểu tượng kính lúp |
| Then | Hệ thống | Trả về danh sách sản phẩm có tiêu đề chứa "MacBook M3" |

**Scenario:** Tìm kiếm sản phẩm không tồn tại

| Step | Actor | Action |
|------|-------|--------|
| Given | Người dùng | Đang thao tác trên thanh tìm kiếm |
| When | Người dùng | Nhập từ khóa không khớp bất kỳ sản phẩm nào |
| Then | Hệ thống | Hiển thị giao diện "Không tìm thấy sản phẩm" kèm gợi ý sản phẩm thay thế |

---

### AC-2: Tìm kiếm thông minh (Fuzzy Search — không dấu, sai lệch)

| Step | Actor | Action |
|------|-------|--------|
| Given | Người dùng | Đang thao tác trên thanh tìm kiếm |
| When | Người dùng | Nhập từ khóa thiếu dấu, viết thường hoặc gõ nhanh (VD: "macbok m3", "macbook") |
| Then | Hệ thống | Tự động xử lý chuỗi và trả về kết quả tương đương với từ khóa gốc "MacBook M3" |

---

### AC-3: Bộ lọc đa tiêu chí (Filter) trong danh mục

| Step | Actor | Action |
|------|-------|--------|
| Given | Người dùng | Đang ở trang danh mục cụ thể (VD: `thinkpro.vn/laptop`) |
| When | Người dùng | Chọn kết hợp nhiều thuộc tính trên cột bộ lọc (VD: Thương hiệu = "Apple", Khoảng giá = "Trên 30 triệu", Nhu cầu = "Văn phòng") |
| Then | Hệ thống | Lưới sản phẩm chỉ hiển thị các dòng máy thỏa mãn **đồng thời tất cả** điều kiện đã chọn |

---

### AC-4: Cập nhật real-time qua Ajax (không reload trang)

| Step | Actor | Action |
|------|-------|--------|
| Given | Người dùng | Đang thao tác trên giao diện bộ lọc |
| When | Người dùng | Tick chọn hoặc bỏ chọn một tiêu chí bất kỳ |
| Then | Hệ thống | Danh sách sản phẩm cập nhật ngay lập tức mà **không reload** toàn bộ trang |
| And | Hệ thống | URL thay đổi tương ứng (VD: `thinkpro.vn/laptop?brand=apple&price=30-50`) để người dùng có thể copy link chia sẻ |

---

## 3. Non-Functional Requirements

### 3.1. Stack Công nghệ

| Thành phần | Lựa chọn | Ghi chú |
|------------|----------|---------|
| Framework | **Playwright (Node.js)** | Giao tiếp CDP → bắt Ajax event chính xác hơn Selenium |
| Ngôn ngữ | **TypeScript** | Strict-type, dễ định nghĩa interface cho API response |
| Test Runner | **`@playwright/test`** | Hỗ trợ parallel execution, xuất report HTML/Allure |
| Assertion | Playwright Assertions | Auto-retrying `expect` — không fail ngay lập tức |

---

### 3.2. Thuật toán & Locators Strategy

**Tìm kiếm (Exact/Fuzzy Match):**

- **Cấm** so sánh chuỗi tuyệt đối (`===`)
- **Bắt buộc** dùng Regex hoặc cờ `ignoreCase: true`
- Độ phức tạp: `O(N)` — duyệt mảng phần tử UI, trích `textContent`, đối chiếu chuỗi

**Bắt Ajax Response (Filter):**

- **Cấm** dùng `page.waitForTimeout(3000)` (hard sleep)
- **Bắt buộc** dùng `page.waitForResponse()` hoặc `page.waitForLoadState('networkidle')`
- Event-driven → wait-time `O(1)` thực tế

**Locators (theo thứ tự ưu tiên):**

1. `getByPlaceholder()` — ưu tiên cao nhất
2. `getByRole()` — semantic, stable nhất
3. `getByText()` — backup
4. **Cấm** XPath/CSS selector cứng — dễ hỏng khi HTML thay đổi

---

### 3.3. Performance Standards

| Tiêu chí | Yêu cầu |
|----------|---------|
| Auto-waiting | Event-driven, **không** dùng `waitForTimeout` |
| Browser context | Tái sử dụng context giữa các test case — tránh khởi động lại trình duyệt |
| Parallel execution | Thiết lập `test.describe.configure({ mode: 'parallel' })` — 4 workers giảm thời gian ~4x |
| CI/CD | Tương thích GitHub Actions / GitLab CI |

---

## 4. Out of Scope

- Thanh toán / giỏ hàng
- So sánh sản phẩm (compare)
- Tìm kiếm bằng hình ảnh (image search)
- Lịch sử tìm kiếm (search history)
- Đa ngôn ngữ / i18n
