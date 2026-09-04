using System.Linq;
using Kinetic3D.Application.Features.Orders.DTOs;
using Kinetic3D.Domain.Entities;

namespace Kinetic3D.Application.Features.Orders;

public static class OrderMappingExtensions
{
    public static OrderDto ToDto(this Order order)
    {
        return new OrderDto(
            order.Id,
            order.OrderNumber,
            order.UserId,
            order.CustomerEmail,
            order.CustomerPhone,
            order.ShippingFullName,
            order.ShippingAddress,
            order.ShippingCity,
            order.Note,
            order.Subtotal,
            order.ShippingFee,
            order.Total,
            order.Status.ToString(),
            order.CreatedAt,
            order.Items.Select(i => new OrderItemDto(
                i.Id, i.ProductId, i.ProductName, i.UnitPrice, i.Quantity, i.VariantAttributesSnapshot, i.CustomText)).ToList());
    }
}
