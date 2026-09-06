using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Domain.Entities;
using Kinetic3D.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Kinetic3D.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ITelegramNotificationService _telegramService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(
        IApplicationDbContext context,
        ITelegramNotificationService telegramService,
        IConfiguration configuration,
        ILogger<PaymentsController> logger)
    {
        _context = context;
        _telegramService = telegramService;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("casso-webhook")]
    public async Task<IActionResult> HandleCassoWebhook(
        [FromHeader(Name = "Secure-Token")] string? secureToken,
        [FromBody] CassoWebhookPayload payload,
        CancellationToken cancellationToken)
    {
        var configuredToken = _configuration["CassoSettings:WebhookSecret"] 
                              ?? Environment.GetEnvironmentVariable("CASSO_WEBHOOK_SECRET");

        // Validate secure token if configured
        if (!string.IsNullOrWhiteSpace(configuredToken) && secureToken != configuredToken)
        {
            _logger.LogWarning("[CassoWebhook] Sai Secure-Token từ Casso: {Token}", secureToken);
            return Unauthorized(new { error = 1, message = "Invalid secure token" });
        }

        if (payload?.Data == null || payload.Data.Count == 0)
        {
            return Ok(new { error = 0, message = "No transactions to process" });
        }

        int processedCount = 0;

        foreach (var tx in payload.Data)
        {
            _logger.LogInformation("[CassoWebhook] Giao dịch mới: ID={Id}, TID={Tid}, Số tiền={Amount}, Nội dung={Desc}", 
                tx.Id, tx.Tid, tx.Amount, tx.Description);

            // Match regex for order number KN3D-YYYYMMDD-XXXXXX or KINETIC_...
            var match = Regex.Match(tx.Description, @"(KN3D-\d{8}-[A-Z0-9]{6}|KINETIC_[A-Za-z0-9_-]+)", RegexOptions.IgnoreCase);
            string? matchedOrderNumber = match.Success ? match.Value.ToUpperInvariant() : null;

            Order? order = null;

            if (!string.IsNullOrEmpty(matchedOrderNumber))
            {
                order = await _context.Orders
                    .Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.OrderNumber.ToUpper() == matchedOrderNumber, cancellationToken);
            }

            // Fallback: search for OrderNumber inside the description directly
            if (order == null)
            {
                var pendingOrders = await _context.Orders
                    .Include(o => o.Items)
                    .Where(o => o.Status == OrderStatus.Pending)
                    .ToListAsync(cancellationToken);

                order = pendingOrders.FirstOrDefault(o => 
                    tx.Description.Contains(o.OrderNumber, StringComparison.OrdinalIgnoreCase) ||
                    (!string.IsNullOrEmpty(o.CustomerPhone) && tx.Description.Contains(o.CustomerPhone)));
            }

            if (order == null)
            {
                _logger.LogWarning("[CassoWebhook] Không tìm thấy đơn hàng tương ứng với giao dịch TID={Tid}, Desc='{Desc}'", tx.Tid, tx.Description);
                continue;
            }

            // Verify amount
            if (tx.Amount >= order.Total && order.Status == OrderStatus.Pending)
            {
                order.Status = OrderStatus.Processing;
                order.Note = $"[Đã TT Casso VietQR: TID={tx.Tid} - {tx.Amount:N0}đ lúc {tx.When}] " + (order.Note ?? "");

                await _context.SaveChangesAsync(cancellationToken);
                processedCount++;

                _logger.LogInformation("[CassoWebhook] Đơn hàng {OrderNumber} đã thanh toán thành công qua Casso!", order.OrderNumber);

                // Notify workshop via Telegram
                _ = _telegramService.SendPaymentSuccessNotificationAsync(order, tx.Amount, tx.Tid, cancellationToken);
            }
        }

        return Ok(new { error = 0, message = $"Successfully processed {processedCount} transactions" });
    }

    [HttpGet("order-status/{idOrOrderNumber}")]
    public async Task<IActionResult> GetOrderStatus(string idOrOrderNumber, CancellationToken cancellationToken)
    {
        Order? order = null;

        if (Guid.TryParse(idOrOrderNumber, out var guidId))
        {
            order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == guidId, cancellationToken);
        }

        if (order == null)
        {
            order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderNumber.ToUpper() == idOrOrderNumber.ToUpper(), cancellationToken);
        }

        if (order == null)
        {
            return NotFound(new { message = "Không tìm thấy đơn hàng." });
        }

        bool isPaid = order.Status == OrderStatus.Processing || 
                      order.Status == OrderStatus.Confirmed || 
                      order.Status == OrderStatus.Shipped || 
                      order.Status == OrderStatus.Completed;

        return Ok(new
        {
            orderId = order.Id,
            orderNumber = order.OrderNumber,
            status = order.Status.ToString(),
            isPaid,
            total = order.Total,
            note = order.Note,
            createdAt = order.CreatedAt
        });
    }

    [HttpPost("simulate-casso-payment/{idOrOrderNumber}")]
    public async Task<IActionResult> SimulateCassoPayment(string idOrOrderNumber, CancellationToken cancellationToken)
    {
        Order? order = null;

        if (Guid.TryParse(idOrOrderNumber, out var guidId))
        {
            order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == guidId, cancellationToken);
        }

        if (order == null)
        {
            order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.OrderNumber.ToUpper() == idOrOrderNumber.ToUpper(), cancellationToken);
        }

        if (order == null)
        {
            return NotFound(new { message = "Không tìm thấy đơn hàng để giả lập thanh toán." });
        }

        var fakeTid = $"FT{DateTime.UtcNow:yyMMddHHmmss}{new Random().Next(100, 999)}";
        order.Status = OrderStatus.Processing;
        order.Note = $"[Giả lập thanh toán Casso VietQR thành công: TID={fakeTid} - {order.Total:N0}đ] " + (order.Note ?? "");

        await _context.SaveChangesAsync(cancellationToken);

        // Notify telegram
        _ = _telegramService.SendPaymentSuccessNotificationAsync(order, order.Total, fakeTid, cancellationToken);

        return Ok(new
        {
            success = true,
            message = $"Đã giả lập đối soát Casso thành công cho đơn hàng {order.OrderNumber}!",
            orderId = order.Id,
            orderNumber = order.OrderNumber,
            status = order.Status.ToString(),
            transactionRef = fakeTid
        });
    }

    [HttpPost("test-telegram")]
    public async Task<IActionResult> TestTelegram([FromBody] TestTelegramRequest? request, CancellationToken cancellationToken)
    {
        var message = request?.Message ?? "Đây là tin nhắn kiểm tra kết nối từ hệ thống Kinetic3D.";
        var success = await _telegramService.SendTestMessageAsync(message, cancellationToken);
        return Ok(new
        {
            sent = success,
            message = success 
                ? "Gửi tin nhắn Telegram thành công! Vui lòng kiểm tra nhóm/kênh Telegram của bạn."
                : "Chưa cấu hình Telegram BotToken/ChatId hoặc gửi thất bại. Vui lòng kiểm tra log backend."
        });
    }
}

public class CassoWebhookPayload
{
    public int Error { get; set; }
    public List<CassoTransactionData> Data { get; set; } = new();
}

public class CassoTransactionData
{
    public long Id { get; set; }
    public string Tid { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal CusumBalance { get; set; }
    public string When { get; set; } = string.Empty;
    public string BankSubAccId { get; set; } = string.Empty;
}

public class TestTelegramRequest
{
    public string? Message { get; set; }
}
