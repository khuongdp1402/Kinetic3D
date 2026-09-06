using System;
using System.Threading;
using System.Threading.Tasks;
using BCrypt.Net;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Application.Features.Auth.Commands;
using Kinetic3D.Application.Features.Auth.DTOs;
using Kinetic3D.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IHttpClientFactory _httpClientFactory;

    public AuthController(
        IMediator mediator,
        IApplicationDbContext context,
        IJwtTokenGenerator jwtTokenGenerator,
        IHttpClientFactory httpClientFactory)
    {
        _mediator = mediator;
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    public class GoogleAuthRequest
    {
        public string? IdToken { get; set; }
        public string? Email { get; set; }
        public string? DisplayName { get; set; }
        public string? PhotoUrl { get; set; }
        public string? GoogleId { get; set; }
        public string? DeviceHash { get; set; }
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest request, CancellationToken cancellationToken)
    {
        string? verifiedEmail = request.Email;
        string? verifiedName = request.DisplayName;
        string? verifiedPicture = request.PhotoUrl;
        string? verifiedGoogleId = request.GoogleId;

        // If IdToken provided, verify with Google OAuth2 TokenInfo API
        if (!string.IsNullOrWhiteSpace(request.IdToken))
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetAsync($"https://oauth2.googleapis.com/tokeninfo?id_token={request.IdToken}", cancellationToken);
                if (response.IsSuccessStatusCode)
                {
                    var jsonStr = await response.Content.ReadAsStringAsync(cancellationToken);
                    using var doc = System.Text.Json.JsonDocument.Parse(jsonStr);
                    var root = doc.RootElement;
                    if (root.TryGetProperty("email", out var emailProp))
                    {
                        verifiedEmail = emailProp.GetString();
                    }
                    if (root.TryGetProperty("name", out var nameProp))
                    {
                        verifiedName = nameProp.GetString();
                    }
                    if (root.TryGetProperty("picture", out var picProp))
                    {
                        verifiedPicture = picProp.GetString();
                    }
                    if (root.TryGetProperty("sub", out var subProp))
                    {
                        verifiedGoogleId = subProp.GetString();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Google token verification exception: {ex.Message}");
            }
        }

        if (string.IsNullOrWhiteSpace(verifiedEmail))
        {
            return BadRequest(new { message = "Email không được để trống hoặc token Google không hợp lệ." });
        }

        var normalizedEmail = verifiedEmail.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (user == null)
        {
            // Check device fingerprint for free 30 credits
            int initialCredits = 0;
            bool shouldRecordClaim = false;

            if (!string.IsNullOrWhiteSpace(request.DeviceHash))
            {
                var alreadyClaimed = await _context.DeviceClaims.AnyAsync(d => d.DeviceHash == request.DeviceHash, cancellationToken);
                if (!alreadyClaimed)
                {
                    initialCredits = 30;
                    shouldRecordClaim = true;
                }
            }
            else
            {
                initialCredits = 30;
            }

            user = new User
            {
                Id = Guid.NewGuid(),
                Email = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString("N")),
                DisplayName = !string.IsNullOrWhiteSpace(verifiedName) ? verifiedName : normalizedEmail.Split('@')[0],
                Role = "Customer",
                Credits = initialCredits,
                DeviceHash = request.DeviceHash,
                GoogleId = verifiedGoogleId,
                AvatarUrl = verifiedPicture,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);

            if (shouldRecordClaim && !string.IsNullOrWhiteSpace(request.DeviceHash))
            {
                _context.DeviceClaims.Add(new DeviceClaim
                {
                    Id = Guid.NewGuid(),
                    DeviceHash = request.DeviceHash,
                    UserId = user.Id,
                    ClaimedAt = DateTime.UtcNow
                });
            }

            // Link any past guest orders with this email to the new account
            var pastOrders = await _context.Orders
                .Where(o => o.CustomerEmail.ToLower() == normalizedEmail && o.UserId == null)
                .ToListAsync(cancellationToken);

            foreach (var order in pastOrders)
            {
                order.UserId = user.Id;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
        else
        {
            if (!string.IsNullOrWhiteSpace(verifiedGoogleId) && string.IsNullOrWhiteSpace(user.GoogleId))
            {
                user.GoogleId = verifiedGoogleId;
            }
            if (!string.IsNullOrWhiteSpace(verifiedPicture) && string.IsNullOrWhiteSpace(user.AvatarUrl))
            {
                user.AvatarUrl = verifiedPicture;
            }
            if (!string.IsNullOrWhiteSpace(verifiedName) && string.IsNullOrWhiteSpace(user.DisplayName))
            {
                user.DisplayName = verifiedName;
            }
            await _context.SaveChangesAsync(cancellationToken);
        }

        var token = _jwtTokenGenerator.GenerateToken(user);
        return Ok(new AuthResultDto(user.Id, user.Email, user.DisplayName, user.Role, token, user.Credits));
    }

    public class SetGuestPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? DeviceHash { get; set; }
    }

    [HttpPost("set-password-for-guest")]
    public async Task<IActionResult> SetPasswordForGuest([FromBody] SetGuestPasswordRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email và mật khẩu không được để trống." });
        }

        var normalizedEmail = request.Email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (user == null)
        {
            int initialCredits = 0;
            bool shouldRecordClaim = false;

            if (!string.IsNullOrWhiteSpace(request.DeviceHash))
            {
                var alreadyClaimed = await _context.DeviceClaims.AnyAsync(d => d.DeviceHash == request.DeviceHash, cancellationToken);
                if (!alreadyClaimed)
                {
                    initialCredits = 30;
                    shouldRecordClaim = true;
                }
            }
            else
            {
                initialCredits = 30;
            }

            user = new User
            {
                Id = Guid.NewGuid(),
                Email = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                DisplayName = !string.IsNullOrWhiteSpace(request.DisplayName) ? request.DisplayName : normalizedEmail.Split('@')[0],
                Role = "Customer",
                Credits = initialCredits,
                DeviceHash = request.DeviceHash,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);

            if (shouldRecordClaim && !string.IsNullOrWhiteSpace(request.DeviceHash))
            {
                _context.DeviceClaims.Add(new DeviceClaim
                {
                    Id = Guid.NewGuid(),
                    DeviceHash = request.DeviceHash,
                    UserId = user.Id,
                    ClaimedAt = DateTime.UtcNow
                });
            }

            // Link past guest orders
            var pastOrders = await _context.Orders
                .Where(o => o.CustomerEmail.ToLower() == normalizedEmail && o.UserId == null)
                .ToListAsync(cancellationToken);

            foreach (var order in pastOrders)
            {
                order.UserId = user.Id;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
        else
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var token = _jwtTokenGenerator.GenerateToken(user);
        return Ok(new AuthResultDto(user.Id, user.Email, user.DisplayName, user.Role, token, user.Credits));
    }
}
