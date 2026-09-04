using System;

namespace Kinetic3D.Application.Features.CustomRequests.DTOs;

public record CustomRequestDto(
    Guid Id,
    Guid? UserId,
    string? CustomerEmail,
    string ReferenceImageUrl,
    string? SketchImageUrl,
    string Description,
    string Status,
    decimal? QuotedPrice,
    string? AdminNote,
    DateTime CreatedAt);
