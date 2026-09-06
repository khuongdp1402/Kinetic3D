using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.WebAPI.Controllers;

[ApiController]
[Route("api/admin/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public UsersController(IApplicationDbContext context)
    {
        _context = context;
    }

    public record AdminUserDto(
        Guid Id,
        string Email,
        string DisplayName,
        string Role,
        int Credits,
        string? AvatarUrl,
        DateTime CreatedAt,
        int OrdersCount,
        decimal TotalSpent
    );

    [HttpGet]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? search,
        [FromQuery] string? role,
        CancellationToken cancellationToken)
    {
        var query = _context.Users.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(u => u.Email.ToLower().Contains(s) || u.DisplayName.ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(role) && role != "all")
        {
            query = query.Where(u => u.Role.ToLower() == role.Trim().ToLower());
        }

        var users = await query.OrderByDescending(u => u.CreatedAt).ToListAsync(cancellationToken);

        // Calculate statistics for each user
        var userIds = users.Select(u => (Guid?)u.Id).ToList();
        var orders = await _context.Orders
            .Where(o => o.UserId != null && userIds.Contains(o.UserId))
            .Select(o => new { o.UserId, o.Total })
            .ToListAsync(cancellationToken);

        var result = users.Select(u =>
        {
            var userOrders = orders.Where(o => o.UserId == u.Id).ToList();
            return new AdminUserDto(
                Id: u.Id,
                Email: u.Email,
                DisplayName: u.DisplayName,
                Role: u.Role,
                Credits: u.Credits,
                AvatarUrl: u.AvatarUrl,
                CreatedAt: u.CreatedAt,
                OrdersCount: userOrders.Count,
                TotalSpent: userOrders.Sum(o => o.Total)
            );
        }).ToList();

        return Ok(new
        {
            total = result.Count,
            users = result,
            stats = new
            {
                totalUsers = users.Count,
                totalPro = users.Count(u => u.Role == "Pro" || u.Role == "Studio"),
                totalAdmins = users.Count(u => u.Role == "Admin"),
                totalCreditsIssued = users.Sum(u => u.Credits)
            }
        });
    }

    public class UpdateUserRoleRequest
    {
        public string Role { get; set; } = "Customer";
        public int? Credits { get; set; }
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateUserRole(Guid id, [FromBody] UpdateUserRoleRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { id }, cancellationToken);
        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng." });
        }

        user.Role = request.Role;
        if (request.Credits.HasValue)
        {
            user.Credits = request.Credits.Value;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            success = true,
            id = user.Id,
            role = user.Role,
            credits = user.Credits,
            message = "Cập nhật tài khoản người dùng thành công."
        });
    }
}
