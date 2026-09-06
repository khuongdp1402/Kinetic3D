using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Kinetic3D.Infrastructure.Services;

public class TelegramNotificationService : ITelegramNotificationService
{
    private static readonly HttpClient _httpClient = new();
    private readonly IConfiguration _configuration;
    private readonly ILogger<TelegramNotificationService> _logger;

    public TelegramNotificationService(
        IConfiguration configuration,
        ILogger<TelegramNotificationService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    private (string botToken, string chatId, bool enabled) GetSettings()
    {
        var botToken = _configuration["TelegramSettings:BotToken"] 
                       ?? Environment.GetEnvironmentVariable("TELEGRAM_BOT_TOKEN") 
                       ?? string.Empty;

        var chatId = _configuration["TelegramSettings:ChatId"] 
                     ?? Environment.GetEnvironmentVariable("TELEGRAM_CHAT_ID") 
                     ?? string.Empty;

        var enabledStr = _configuration["TelegramSettings:Enabled"] 
                         ?? Environment.GetEnvironmentVariable("TELEGRAM_ENABLED");

        var enabled = true;
        if (!string.IsNullOrWhiteSpace(enabledStr) && bool.TryParse(enabledStr, out var parsedEnabled))
        {
            enabled = parsedEnabled;
        }

        return (botToken.Trim(), chatId.Trim(), enabled);
    }

    public async Task SendOrderCreatedNotificationAsync(Order order, CancellationToken cancellationToken = default)
    {
        var sb = new StringBuilder();
        sb.AppendLine("🚀 <b>ĐƠN HÀNG MỚI ĐÃ ĐƯỢC TẠO TẠI KINETIC3D!</b>");
        sb.AppendLine($"📦 <b>Mã đơn hàng:</b> <code>{order.OrderNumber}</code>");
        sb.AppendLine($"👤 <b>Khách hàng:</b> {order.ShippingFullName}");
        sb.AppendLine($"📞 <b>Số điện thoại:</b> {order.CustomerPhone}");
        sb.AppendLine($"✉️ <b>Email:</b> {order.CustomerEmail}");
        sb.AppendLine($"📍 <b>Địa chỉ:</b> {order.ShippingAddress}, {order.ShippingCity}");
        if (!string.IsNullOrWhiteSpace(order.Note))
        {
            sb.AppendLine($"📝 <b>Ghi chú:</b> {order.Note}");
        }

        sb.AppendLine();
        sb.AppendLine("🛒 <b>Danh sách sản phẩm chế tác:</b>");
        if (order.Items != null && order.Items.Count > 0)
        {
            int idx = 1;
            foreach (var item in order.Items)
            {
                sb.AppendLine($"  {idx}. <b>{item.ProductName}</b> x{item.Quantity} — {item.UnitPrice:N0}₫");
                if (!string.IsNullOrWhiteSpace(item.CustomText))
                {
                    sb.AppendLine($"     └ Khắc chữ: <i>{item.CustomText}</i>");
                }
                idx++;
            }
        }
        else
        {
            sb.AppendLine("  (Đang tải chi tiết các mục)");
        }

        sb.AppendLine();
        sb.AppendLine($"💰 <b>Tạm tính:</b> {order.Subtotal:N0}₫");
        sb.AppendLine($"🚚 <b>Phí vận chuyển:</b> {order.ShippingFee:N0}₫");
        sb.AppendLine($"💵 <b>Tổng thanh toán:</b> <b>{order.Total:N0}₫</b>");
        sb.AppendLine($"⏳ <b>Trạng thái:</b> Chờ thanh toán VietQR (Casso) / Xác nhận COD");
        sb.AppendLine($"🕒 <b>Thời gian tạo:</b> {DateTime.UtcNow.AddHours(7):dd/MM/yyyy HH:mm:ss} (GMT+7)");

        await SendHtmlMessageAsync(sb.ToString(), cancellationToken);
    }

    public async Task SendPaymentSuccessNotificationAsync(Order order, decimal paidAmount, string transactionRef, CancellationToken cancellationToken = default)
    {
        var sb = new StringBuilder();
        sb.AppendLine("🎉 <b>THANH TOÁN THÀNH CÔNG QUA CASSO VIETQR!</b>");
        sb.AppendLine($"📦 <b>Mã đơn hàng:</b> <code>{order.OrderNumber}</code>");
        sb.AppendLine($"👤 <b>Khách hàng:</b> {order.ShippingFullName} ({order.CustomerPhone})");
        sb.AppendLine($"💵 <b>Số tiền đã nhận:</b> <b>{paidAmount:N0}₫</b>");
        sb.AppendLine($"🏦 <b>Mã giao dịch ngân hàng:</b> <code>{transactionRef}</code>");
        sb.AppendLine($"⚙️ <b>Lệnh sản xuất:</b> Đơn hàng đã chuyển trạng thái <b>ĐANG CHẾ TÁC / IN 3D</b>");
        sb.AppendLine($"🕒 <b>Thời gian xác nhận:</b> {DateTime.UtcNow.AddHours(7):dd/MM/yyyy HH:mm:ss} (GMT+7)");

        await SendHtmlMessageAsync(sb.ToString(), cancellationToken);
    }

    public async Task<bool> SendTestMessageAsync(string customMessage, CancellationToken cancellationToken = default)
    {
        var msg = $"🔔 <b>THÔNG BÁO TEST TỪ HỆ THỐNG KINETIC3D</b>\n\n{customMessage}\n\n<i>Thời gian: {DateTime.UtcNow.AddHours(7):dd/MM/yyyy HH:mm:ss}</i>";
        return await SendHtmlMessageAsync(msg, cancellationToken);
    }

    private async Task<bool> SendHtmlMessageAsync(string htmlContent, CancellationToken cancellationToken)
    {
        var (botToken, chatId, enabled) = GetSettings();

        if (!enabled)
        {
            _logger.LogInformation("[TelegramNotification] Đã tắt thông báo Telegram theo cấu hình.");
            return false;
        }

        if (string.IsNullOrWhiteSpace(botToken) || string.IsNullOrWhiteSpace(chatId))
        {
            _logger.LogWarning("[TelegramNotification] Chưa cấu hình TelegramSettings:BotToken hoặc ChatId. Nội dung tin nhắn chuẩn bị gửi:\n{Message}", htmlContent);
            return false;
        }

        try
        {
            var url = $"https://api.telegram.org/bot{botToken}/sendMessage";
            var payload = new
            {
                chat_id = chatId,
                text = htmlContent,
                parse_mode = "HTML",
                disable_web_page_preview = true
            };

            var json = JsonSerializer.Serialize(payload);
            using var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content, cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("[TelegramNotification] Gửi thông báo Telegram thành công tới ChatId: {ChatId}", chatId);
                return true;
            }
            else
            {
                var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("[TelegramNotification] Gửi thất bại HTTP {Status}: {Error}", response.StatusCode, errorBody);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[TelegramNotification] Lỗi ngoại lệ khi gửi thông báo Telegram.");
            return false;
        }
    }
}
