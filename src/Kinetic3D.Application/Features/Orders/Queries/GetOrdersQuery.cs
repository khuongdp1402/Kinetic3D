using System.Collections.Generic;
using Kinetic3D.Application.Features.Orders.DTOs;
using MediatR;

namespace Kinetic3D.Application.Features.Orders.Queries;

public class GetOrdersQuery : IRequest<List<OrderDto>>
{
}
