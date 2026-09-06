using System;

namespace Kinetic3D.Application.Features.Auth.DTOs;

public record AuthResultDto(Guid UserId, string Email, string DisplayName, string Role, string Token, int Credits = 0);
