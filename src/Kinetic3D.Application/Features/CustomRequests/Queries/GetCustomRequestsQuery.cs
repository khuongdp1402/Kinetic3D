using System.Collections.Generic;
using Kinetic3D.Application.Features.CustomRequests.DTOs;
using MediatR;

namespace Kinetic3D.Application.Features.CustomRequests.Queries;

public class GetCustomRequestsQuery : IRequest<List<CustomRequestDto>>
{
}
