using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CreditsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreditsController(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public record CreditPackageDto(
        string Id,
        string Name,
        int Credits,
        int BonusCredits,
        decimal PriceVnd,
        decimal PriceUsd,
        string Badge,
        string Description,
        bool IsPopular
    );

    [HttpGet("packages")]
    public IActionResult GetPackages()
    {
        var packages = new List<CreditPackageDto>
        {
            new CreditPackageDto(
                Id: "pkg-100",
                Name: "Starter Pack",
                Credits: 100,
                BonusCredits: 0,
                PriceVnd: 49000,
                PriceUsd: 1.99m,
                Badge: "Trải Nghiệm",
                Description: "Phù hợp tạo thử 1-2 mô hình 3D nháp hoặc kiểm tra độ phân giải lưới.",
                IsPopular: false
            ),
            new CreditPackageDto(
                Id: "pkg-500",
                Name: "Creator Pack",
                Credits: 500,
                BonusCredits: 50,
                PriceVnd: 199000,
                PriceUsd: 7.99m,
                Badge: "Tặng +50",
                Description: "Dành cho nhà sáng tạo cá nhân: Text-to-3D độ chi tiết cao, xuất file GLB/OBJ.",
                IsPopular: false
            ),
            new CreditPackageDto(
                Id: "pkg-2000",
                Name: "Pro Workshop",
                Credits: 2000,
                BonusCredits: 300,
                PriceVnd: 599000,
                PriceUsd: 23.99m,
                Badge: "Phổ Biến Nhất",
                Description: "Tối ưu cho xưởng & nhà thiết kế: Ưu tiên render cao nhất, remesh quad lưới mượt.",
                IsPopular: true
            ),
            new CreditPackageDto(
                Id: "pkg-5000",
                Name: "Studio Lab",
                Credits: 5000,
                BonusCredits: 1000,
                PriceVnd: 1290000,
                PriceUsd: 49.99m,
                Badge: "Tiết Kiệm 35%",
                Description: "Dành cho đội ngũ chuyên nghiệp: Không giới hạn concurrent tasks, hỗ trợ kỹ thuật 1-1.",
                IsPopular: false
            )
        };

        return Ok(packages);
    }

    public class CreateCreditOrderRequest
    {
        public string PackageId { get; set; } = string.Empty;
        public string Currency { get; set; } = "VND"; // "VND" or "USD"
        public string? Email { get; set; }
        public Guid? UserId { get; set; }
    }

    [HttpPost("order")]
    [Authorize]
    public IActionResult CreateCreditOrder([FromBody] CreateCreditOrderRequest request, CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId ?? request.UserId;
        if (currentUserId == null)
        {
            return Unauthorized(new { message = "Vui lòng đăng nhập để nạp credit." });
        }

        var packages = (GetPackages() as OkObjectResult)?.Value as List<CreditPackageDto>;
        var pkg = packages?.FirstOrDefault(p => p.Id == request.PackageId) ?? packages?.FirstOrDefault();
        if (pkg == null)
        {
            return BadRequest(new { message = "Không tìm thấy gói credit hợp lệ." });
        }

        var topupCode = $"KINETIC_CREDITS_{DateTime.UtcNow:MMddHHmm}_{Guid.NewGuid().ToString("N")[..4].ToUpper()}";
        decimal amount = request.Currency.ToUpper() == "USD" ? pkg.PriceUsd : pkg.PriceVnd;

        // Casso VietQR Details for Timo (Ban Viet Bank)
        var bankId = "TIMO";
        var accountNo = "9021597313131";
        var accountName = "DO PHU KHUONG";
        var qrUrl = $"https://img.vietqr.io/image/{bankId}-{accountNo}-compact2.png?amount={(long)pkg.PriceVnd}&addInfo={topupCode}&accountName={Uri.EscapeDataString(accountName)}";

        return Ok(new
        {
            TopupCode = topupCode,
            Package = pkg,
            Amount = amount,
            Currency = request.Currency.ToUpper(),
            TotalCredits = pkg.Credits + pkg.BonusCredits,
            VietQr = new
            {
                BankId = bankId,
                AccountNo = accountNo,
                AccountName = accountName,
                QrUrl = qrUrl,
                Description = topupCode
            }
        });
    }

    public class ConfirmCreditTestRequest
    {
        public Guid UserId { get; set; }
        public int CreditsToAdd { get; set; }
    }

    [HttpPost("confirm-test")]
    public async Task<IActionResult> ConfirmCreditTest([FromBody] ConfirmCreditTestRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken);
        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng." });
        }

        user.Credits += request.CreditsToAdd;
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            success = true,
            userId = user.Id,
            newCredits = user.Credits,
            message = $"Đã nạp thành công {request.CreditsToAdd} credits vào tài khoản."
        });
    }
}
