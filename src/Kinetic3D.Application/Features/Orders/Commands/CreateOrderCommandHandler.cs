using System;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Application.Features.Orders.DTOs;
using Kinetic3D.Domain.Entities;
using Kinetic3D.Application.Features.Orders;
using Kinetic3D.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.Application.Features.Orders.Commands;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, OrderDto>
{
    private const decimal FixedShippingFee = 30000m;

    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ITelegramNotificationService _telegramNotificationService;

    public CreateOrderCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        ITelegramNotificationService telegramNotificationService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _telegramNotificationService = telegramNotificationService;
    }

    public async Task<OrderDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderNumber = GenerateOrderNumber(),
            UserId = _currentUserService.UserId,
            CustomerEmail = request.CustomerEmail,
            CustomerPhone = request.CustomerPhone,
            ShippingFullName = request.ShippingFullName,
            ShippingAddress = request.ShippingAddress,
            ShippingCity = request.ShippingCity,
            Note = request.Note,
            Status = OrderStatus.Pending
        };

        decimal subtotal = 0;

        foreach (var itemRequest in request.Items)
        {
            var product = await _context.Products
                .Include(p => p.Variants)
                .FirstOrDefaultAsync(p => p.Id == itemRequest.ProductId, cancellationToken);

            if (product == null)
            {
                throw new InvalidOperationException($"Sản phẩm {itemRequest.ProductId} không tồn tại.");
            }

            ProductVariant? variant = null;
            if (itemRequest.VariantId.HasValue)
            {
                variant = product.Variants?.FirstOrDefault(v => v.Id == itemRequest.VariantId.Value);
            }

            var unitPrice = variant?.Price ?? product.BasePrice;
            subtotal += unitPrice * itemRequest.Quantity;

            order.Items.Add(new OrderItem
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                ProductId = product.Id,
                ProductName = product.Name,
                UnitPrice = unitPrice,
                Quantity = itemRequest.Quantity,
                VariantAttributesSnapshot = variant != null ? JsonSerializer.Serialize(variant.Attributes) : null,
                CustomText = itemRequest.CustomText
            });
        }

        order.Subtotal = subtotal;
        order.ShippingFee = FixedShippingFee;
        order.Total = subtotal + FixedShippingFee;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);

        // Fire and forget or await telegram notification safely
        _ = _telegramNotificationService.SendOrderCreatedNotificationAsync(order, cancellationToken);

        return order.ToDto();
    }

    private static string GenerateOrderNumber()
    {
        return $"KN3D-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";
    }
}
