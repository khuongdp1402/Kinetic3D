using System;
using System.Threading;
using System.Threading.Tasks;
using BCrypt.Net;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Application.Features.Auth.DTOs;
using Kinetic3D.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.Application.Features.Auth.Commands;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResultDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public RegisterCommandHandler(IApplicationDbContext context, IJwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResultDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken);
        if (emailExists)
        {
            throw new InvalidOperationException("Email đã được sử dụng.");
        }

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

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            DisplayName = request.DisplayName,
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

        await _context.SaveChangesAsync(cancellationToken);

        var token = _jwtTokenGenerator.GenerateToken(user);
        return new AuthResultDto(user.Id, user.Email, user.DisplayName, user.Role, token);
    }
}
