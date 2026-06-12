# Test Cases — ThinkPro Automation

> Target: https://thinkpro.vn Framework: Playwright + TypeScript Last updated: 2026-06-12

---

## AC-1: Tìm kiếm với từ khóa chính xác

| Mã TC | Title | Input | Expected Result | Test Result |
| --- | --- | --- | --- | --- |
| TC-1.1 | Tìm kiếm "macbook" — hiển thị kết quả sản phẩm | keyword: `macbook` | Kết quả chứa "sản phẩm", không phải "0 sản phẩm" | Pass |
| TC-1.2 | Tìm kiếm "dell" — hiển thị kết quả sản phẩm | keyword: `dell` | Kết quả chứa "sản phẩm", không phải "0 sản phẩm" | Pass |
| TC-1.3 | Tìm kiếm từ khóa không tồn tại — 0 sản phẩm | keyword: `xyzabc123nonexistent` | Kết quả chứa "0 sản phẩm" | Pass |
| TC-1.4 | Tìm kiếm "macbook" — kết quả không chứa từ vô nghĩa | keyword: `macbook` | Kết quả KHÔNG chứa "xyzabc123" | Pass |

---

## AC-2: Tìm kiếm không dấu / sai lệch

| Mã TC | Title | Input | Expected Result | Test Result |
| --- | --- | --- | --- | --- |
| TC-2.1 | Tìm kiếm viết hoa — "MACBOOK" | keyword: `MACBOOK` | Kết quả chứa "sản phẩm", không phải "0 sản phẩm" | Pass |
| TC-2.2 | Tìm kiếm multi-word — "macbook air" | keyword: `macbook air` | Kết quả chứa "sản phẩm", không phải "0 sản phẩm" | Pass |
| TC-2.3 | Tìm kiếm fuzzy — "laptop van phong" | keyword: `laptop van phong` | Trang chứa "tìm kiếm" | Pass |

---

## AC-3: Bộ lọc đa tiêu chí trong danh mục

| Mã TC | Title | Input | Expected Result | Test Result |
| --- | --- | --- | --- | --- |
| TC-3.1 | Chọn 1 filter thương hiệu — sản phẩm phải khớp | category: `/laptop`, filter: `brand=apple` | Số sản phẩm &gt; 0 | Pass |
| TC-3.2 | Chọn nhiều filter đồng thời — URL chứa cả hai param | category: `/laptop`, filters: `brand=dell` + `nhu-cau=van-phong` | URL chứa `thuong-hieu=dell` và `nhu-cau=van-phong` | Pass |
| TC-3.3 | URL thay đổi đúng fragment khi chọn filter | category: `/laptop`, filter: `brand=dell` | URL chứa `thuong-hieu=dell` | Pass |
| TC-3.4 | Filter thương hiệu không tồn tại — checkbox không có | category: `/laptop`, value: `nonexistentbrandxyz` | Checkbox không tồn tại trong sidebar | Pass |
| TC-3.5 | Filter apple — URL chứa apple, KHÔNG chứa dell | category: `/laptop`, filter: `brand=apple` | URL chứa `thuong-hieu=apple`, KHÔNG chứa `thuong-hieu=dell` | Pass |

---

## AC-4: Cập nhật real-time qua Ajax (không reload trang)

| Mã TC | Title | Input | Expected Result | Test Result |
| --- | --- | --- | --- | --- |
| TC-4.1 | Chọn filter — không reload trang, sản phẩm cập nhật ngay | category: `/laptop`, filter: `brand=apple` | Không reload trang, sản phẩm thay đổi | Pass |
| TC-4.2 | URL thay đổi tương ứng khi tick filter — có thể copy chia sẻ | category: `/laptop`, filters: `brand=asus` + `nhu-cau=gaming` | URL chứa cả `thuong-hieu=asus` và `nhu-cau=gaming` | Pass |
| TC-4.3 | Bỏ chọn filter — URL thay đổi, sản phẩm cập nhật | category: `/laptop`, toggle: `brand=hp` on then off | URL thay đổi, danh sách sản phẩm khác nhau trước/sau | Pass |

---

## AC-5: Xem chi tiết sản phẩm và thêm vào giỏ hàng

| Mã TC | Title | Input | Expected Result | Test Result |
| --- | --- | --- | --- | --- |
| TC-5.1 | Xem chi tiết sản phẩm — hiển thị đúng tên và giá | product URL | Tên chứa "ASUS ExpertBook", giá = `21.790.000` | Pass |
| TC-5.2 | Thêm 1 sản phẩm vào giỏ — số lượng = 1, tổng = giá SP | product URL | Cart ≥1 "sản phẩm", qty=1, subtotal=total=`21.790.000` | Pass |
| TC-5.3 | Thay đổi số lượng = 2 — tổng tiền cập nhật đúng | qty: 2 | Qty=2, total=`43.580.000` (= 2 × 21.790.000) | Pass |
| TC-5.4 | Thêm SP vào giỏ — tổng tiền KHÔNG phải 0 | product URL | Total != "0" và != "" | Pass |
| TC-5.5 | Thêm SP vào giỏ — giá trong giỏ phải khớp giá sản phẩm | product URL | Subtotal in cart = price on detail page | Pass |
| TC-5.6 | Thay đổi số lượng = 3 — tổng = 3 × đơn giá | qty: 3 | Qty=3, total = 3 × 21.790.000 = `65.370.000` | Pass |

---

## TC-F: Các trường hợp unexpected — website không đáp ứng đúng

| Mã TC | Title | Input | Expected Result | Test Result |
| --- | --- | --- | --- | --- |
| TC-F.1 | Tìm kiếm "cơm tấm" — kỳ vọng 0 kết quả laptop | keyword: `cơm tấm` | Trả về kết quả khớp với từ khoas | Fail |
| TC-F.2 | Tìm kiếm "!@#$%^&\*" — kỳ vọng ở trang /tim-kiem | keyword: `!@#$%^&*` | URL chứa `/tim-kiem` (site redirect về homepage thay vì show 0 results) | Fail |
| TC-F.3 | URL SP không tồn tại — kỳ vọng redirect trang chủ | URL: `/laptop/this-laptop-does-not-exist-xyz123` | HTTP 200 (redirect) thay vì 404 | Fail |
| TC-F.4 | URL SP không tồn tại — kỳ vọng tên SP trong h1 | URL: `/laptop/macbook-air-m4-fake-sku-999` | h1 không hiển thị "Không thể tải trang này" | Fail |
| TC-F.5 | Giỏ hàng trống — kỳ vọng Tổng cộng &gt; 0 | URL: `/gio-hang` (cart empty) | Tổng cộng &gt; 0 (logic sai) | Fail |
| TC-F.6 | Thêm SP 21.790.000 — kỳ vọng Tổng = 50.000.000 | qty: 1, price: `21.790.000` | Tổng = `50.000.000` (expected sai) | Fail |
| TC-F.7 | Tìm kiếm "điện thoại iPhone" — kỳ vọng ở trang /tim-kiem | keyword: `điện thoại iPhone` | URL chứa `/tim-kiem` | Pass |

---

## Summary

| Suite | Total | Pass | Fail |
| --- | --- | --- | --- |
| AC-1: Tìm kiếm chính xác | 4 | 4 | 0 |
| AC-2: Tìm kiếm fuzzy | 3 | 3 | 0 |
| AC-3: Bộ lọc đa tiêu chí | 5 | 5 | 0 |
| AC-4: Ajax real-time | 3 | 3 | 0 |
| AC-5: Chi tiết + giỏ hàng | 6 | 6 | 0 |
| TC-F: Unexpected/failure cases | 7 | 2 | 5 |
| **Total** | **28** | **23** | **5** |
