using System;

namespace Kinetic3D.Application.Features.Orders.DTOs;

public record OrderItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    decimal UnitPrice,
    int Quantity,
    string? VariantAttributesSnapshot,
    string? CustomText);
