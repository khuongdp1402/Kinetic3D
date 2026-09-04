# ĐẶC TẢ TÍCH HỢP THANH TOÁN TỰ ĐỘNG QUA CASSO (VIETQR AUTOMATION)
**Hệ thống:** Kinetic3D Platform  
**Phương thức:** Chuyển khoản ngân hàng tự động 24/7 (VietQR + Casso Webhook)  

---

## 1. TỔNG QUAN GIẢI PHÁP (OVERVIEW)

Tại thị trường thương mại điện tử Việt Nam, phương thức chuyển khoản ngân hàng qua mã QR (VietQR) chiếm trên 70% khối lượng giao dịch. Giải pháp **Casso.vn** cho phép Kinetic3D tự động hóa 100% quy trình đối soát giao dịch ngân hàng mà không cần thủ công kiểm tra sao kê.

- **Thời gian xác nhận:** 1 - 3 giây sau khi khách hàng quét mã và bấm chuyển khoản.
- **Chi phí:** Tối ưu, không mất phí phần trăm giao dịch cao như cổng thẻ quốc tế (Visa/Mastercard).
- **Trải nghiệm khách hàng:** Quét mã QR tự động điền đúng số tiền và đúng nội dung chuyển khoản, không sợ sai sót.

---

## 2. QUY TRÌNH THANH TOÁN TOÀN TRÌNH (END-TO-END FLOW)

```
[ Khách Hàng (WebUI) ]                [ Kinetic3D WebAPI ]                 [ Casso.vn Service ]
         │                                      │                                    │
         │── 1. Bấm "Đặt Hàng (VietQR)" ───────>│                                    │
         │                                      │── Sinh OrderId (VD: 1082)          │
         │                                      │   Prefix: KINETIC_1082             │
         │<── 2. Trả về Order & VietQR URL ─────│                                    │
         │                                      │                                    │
    [ Hiển thị VietQR ]                         │                                    │
    [ Khách quét QR & CK ]                      │                                    │
         │                                      │                                    │
    (Ngân Hàng xử lý NAPAS 247)                 │                                    │
         │                                      │                                    │
         │── Biến động số dư tài khoản ─────────────────────────────────────────────>│
         │                                      │                                    │
         │                                      │<── 3. Gửi Webhook biến động SD ────│
         │                                      │    POST /api/payments/casso-webhook│
         │                                      │                                    │
         │                                      │── 4. Xác thực Secure-Token         │
         │                                      │   Khớp mã "KINETIC_1082"           │
         │                                      │   Kiểm tra số tiền == FinalAmount  │
         │                                      │   Đổi PaymentStatus = Paid         │
         │                                      │   Kích hoạt sản xuất in 3D         │
         │                                      │                                    │
         │<── 5. Polling / SSE Báo Thành Công ──│                                    │
         │                                      │                                    │
[ Chuyển trang Success ]                        │                                    │
```

---

## 3. THIẾT KẾ KỸ THUẬT (TECHNICAL DESIGN)

### 3.1. Cấu Hình VietQR Động
Định dạng URL sinh ảnh mã QR chuẩn NAPAS VietQR:
```
https://img.vietqr.io/image/{BANK_ID}-{ACCOUNT_NO}-compact2.png?amount={AMOUNT}&addInfo={DESCRIPTION}&accountName={ACCOUNT_NAME}
```
**Ví dụ thực tế:**
- Ngân hàng: `MB` (MBBank)
- Số tài khoản: `0988888888`
- Tên chủ tài khoản: `CONG TY KINETIC3D`
- Số tiền: `350000`
- Nội dung: `KINETIC_1082`

URL sinh mã QR:
```
https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=350000&addInfo=KINETIC_1082&accountName=CONG%20TY%20KINETIC3D
```

### 3.2. Webhook Endpoint Specification

#### Endpoint
```http
POST /api/payments/casso-webhook
Content-Type: application/json
Secure-Token: <CASSO_WEBHOOK_SECRET_KEY>
```

#### Request Payload từ Casso
```json
{
  "error": 0,
  "data": [
    {
      "id": 482910,
      "tid": "FT2609040001",
      "description": "MBVCB.123456789.KINETIC_1082.CT tu NGUYEN VAN A",
      "amount": 350000,
      "cusum_balance": 15000000,
      "when": "2026-09-04 11:45:00",
      "bank_sub_acc_id": "0988888888"
    }
  ]
}
```

#### Thuật Toán Xử Lý Webhook (.NET 8 C#)
```csharp
[HttpPost("casso-webhook")]
public async Task<IActionResult> HandleCassoWebhook(
    [FromHeader(Name = "Secure-Token")] string secureToken,
    [FromBody] CassoWebhookPayload payload)
{
    // 1. Kiểm tra bí mật Webhook
    if (secureToken != _cassoConfig.WebhookSecret)
        return Unauthorized(new { error = 1, message = "Invalid secure token" });

    foreach (var transaction in payload.Data)
    {
        // 2. Trích xuất mã đơn hàng dạng Regex KINETIC_([0-9a-fA-F-]+)
        var match = Regex.Match(transaction.Description, @"KINETIC_([0-9a-zA-Z-]+)", RegexOptions.IgnoreCase);
        if (!match.Success) continue;

        var orderId = match.Groups[1].Value;

        // 3. Tìm đơn hàng trong DB
        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == orderId || o.OrderNumber == orderId);
        if (order == null) continue;

        // 4. Đối soát số tiền
        if (transaction.Amount >= order.FinalAmount && order.PaymentStatus != PaymentStatus.Paid)
        {
            order.PaymentStatus = PaymentStatus.Paid;
            order.OrderStatus = OrderStatus.Processing;
            order.PaidAt = DateTime.UtcNow;
            order.TransactionReference = transaction.Tid;

            // 5. Bắn domain event OrderPaidEvent -> Gửi email & thông báo xưởng in
            await _mediator.Publish(new OrderPaidEvent(order.Id));
        }
    }

    await _dbContext.SaveChangesAsync();
    return Ok(new { error = 0, message = "Webhook processed successfully" });
}
```

---

## 4. BẢO MẬT & XỬ LÝ LỖI (RESILIENCE & SECURITY)

1. **Chống Replay Attacks (Idempotency):**
   - Lưu trữ mã giao dịch `transaction.Tid` vào bảng `PaymentLogs`.
   - Nếu `Tid` đã được ghi nhận trước đó, bỏ qua không xử lý lặp lại để tránh duplicate đơn hàng.
2. **Khách hàng chuyển thiếu tiền:**
   - Nếu `transaction.Amount < order.FinalAmount`, ghi nhận trạng thái `PartiallyPaid`, tạo thông báo tới Admin để nhân viên hỗ trợ khách hàng bù tiền.
3. **Frontend Polling & Trải Nghiệm:**
   - Trên màn hình hiển thị QR, frontend gửi request nhẹ kiểm tra `GET /api/orders/{id}/payment-status` mỗi 2.5 giây (tối đa 10 phút).
   - Ngay khi backend chuyển `PaymentStatus == "Paid"`, frontend tự động rung chuông, bắn pháo hoa confetti và điều hướng khách hàng tới trang hóa đơn điện tử.
