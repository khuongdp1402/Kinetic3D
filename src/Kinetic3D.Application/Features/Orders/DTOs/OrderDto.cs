using System;
using System.Collections.Generic;

namespace Kinetic3D.Application.Features.Orders.DTOs;

public record OrderDto(
    Guid Id,
    string OrderNumber,
    Guid? UserId,
    string CustomerEmail,
    string CustomerPhone,
    string ShippingFullName,
    string ShippingAddress,
    string ShippingCity,
    string? Note,
    decimal Subtotal,
    decimal ShippingFee,
    decimal Total,
    string Status,
    DateTime CreatedAt,
    List<OrderItemDto> Items);
