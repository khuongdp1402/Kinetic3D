using System;
using Kinetic3D.Application.Features.Orders.DTOs;
using MediatR;

namespace Kinetic3D.Application.Features.Orders.Queries;

public class GetOrderByIdQuery : IRequest<OrderDto?>
{
    public Guid OrderId { get; set; }

    public GetOrderByIdQuery(Guid orderId)
    {
        OrderId = orderId;
    }
}
