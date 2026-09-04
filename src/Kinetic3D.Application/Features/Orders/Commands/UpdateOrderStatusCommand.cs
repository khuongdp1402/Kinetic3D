using System;
using System.ComponentModel.DataAnnotations;
using Kinetic3D.Application.Features.Orders.DTOs;
using Kinetic3D.Domain.Enums;
using MediatR;

namespace Kinetic3D.Application.Features.Orders.Commands;

public class UpdateOrderStatusCommand : IRequest<OrderDto>
{
    [Required]
    public Guid OrderId { get; set; }

    [Required]
    public OrderStatus Status { get; set; }
}
