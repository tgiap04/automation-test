# Test Cases — ThinkPro Automation

> Target: https://thinkpro.vn
> Framework: Playwright + TypeScript
> Last updated: 2026-06-12

---

## AC-1: Tìm kiếm với từ khóa chính xác

| Mã TC | Title | Input | Expected Result | Test Result |
|-------|-------|-------|-----------------|-------------|
| TC-1.1 | Tìm kiếm "macbook" — hiển thị kết quả sản phẩm | keyword: `macbook` | Kết quả chứa "sản phẩm", không phải "0 sản phẩm" | Pass |
| TC-1.2 | Tìm kiếm "dell" — hiển thị kết quả sản phẩm | keyword: `dell` | Kết quả chứa "sản phẩm", không phải "0 sản phẩm" | Pass |

---

## AC-2: Tìm kiếm không dấu / sai lệch

| Mã TC | Title | Input | Expected Result | Test Result |
|-------|-------|-------|-----------------|-------------|
| TC-2.1 | Tìm kiếm viết hoa — "MACBOOK" | keyword: `MACBOOK` | Kết quả chứa "sản phẩm", không phải "0 sản phẩm" | Pass |
| TC-2.2 | Tìm kiếm multi-word — "macbook air" | keyword: `macbook air` | Kết quả chứa "sản phẩm", không phải "0 sản phẩm" | Pass |
| TC-2.3 | Tìm kiếm fuzzy — "laptop van phong" | keyword: `laptop van phong` | Trang chứa "tìm kiếm" | Pass |

---

## AC-3: Bộ lọc đa tiêu chí trong danh mục

| Mã TC | Title | Input | Expected Result | Test Result |
|-------|-------|-------|-----------------|-------------|
| TC-3.1 | Chọn 1 filter thương hiệu — sản phẩm phải khớp | category: `/laptop`, filter: `brand=apple` | Số sản phẩm > 0 | Pass |
| TC-3.2 | Chọn nhiều filter đồng thời — URL chứa cả hai param | category: `/laptop`, filters: `brand=dell` + `nhu-cau=van-phong` | URL chứa `thuong-hieu=dell` và `nhu-cau=van-phong` | Pass |
| TC-3.3 | URL thay đổi đúng fragment khi chọn filter | category: `/laptop`, filter: `brand=dell` | URL chứa `thuong-hieu=dell` | Pass |

---

## AC-4: Cập nhật real-time qua Ajax (không reload trang)

| Mã TC | Title | Input | Expected Result | Test Result |
|-------|-------|-------|-----------------|-------------|
| TC-4.1 | Chọn filter — không reload trang, sản phẩm cập nhật ngay | category: `/laptop`, filter: `brand=apple` | Không reload trang, sản phẩm thay đổi | Pass |
| TC-4.2 | URL thay đổi tương ứng khi tick filter — có thể copy chia sẻ | category: `/laptop`, filters: `brand=asus` + `nhu-cau=gaming` | URL chứa cả `thuong-hieu=asus` và `nhu-cau=gaming` | Pass |
| TC-4.3 | Bỏ chọn filter — URL thay đổi, sản phẩm cập nhật | category: `/laptop`, toggle: `brand=hp` on then off | URL thay đổi, danh sách sản phẩm khác nhau trước/sau | Pass |

---

## AC-5: Xem chi tiết sản phẩm và thêm vào giỏ hàng

| Mã TC | Title | Input | Expected Result | Test Result |
|-------|-------|-------|-----------------|-------------|
| TC-5.1 | Xem chi tiết sản phẩm — hiển thị đúng tên và giá | product: `/laptop/asus-expertbook-p5-p3405cva-nz0027w?skuId=10887` | Tên chứa "ASUS ExpertBook", giá = `21.790.000` | Pass |
| TC-5.2 | Thêm 1 sản phẩm vào giỏ — số lượng = 1, tổng = giá sản phẩm | product: `/laptop/asus-expertbook-p5-p3405cva-nz0027w?skuId=10887` | Cart có ≥1 "sản phẩm", quantity = 1, subtotal = `21.790.000`, total = `21.790.000` | Pass |
| TC-5.3 | Thay đổi số lượng > 1 — tổng tiền cập nhật đúng | quantity: 2 | Quantity = 2, total = `43.580.000` (= 2 × 21.790.000) | Pass |

---

## Summary

| Suite | Total | Pass | Fail |
|-------|-------|------|------|
| AC-1: Tìm kiếm chính xác | 2 | 2 | 0 |
| AC-2: Tìm kiếm fuzzy | 3 | 3 | 0 |
| AC-3: Bộ lọc đa tiêu chí | 3 | 3 | 0 |
| AC-4: Ajax real-time | 3 | 3 | 0 |
| AC-5: Chi tiết + giỏ hàng | 3 | 3 | 0 |
| **Total** | **14** | **14** | **0** |
