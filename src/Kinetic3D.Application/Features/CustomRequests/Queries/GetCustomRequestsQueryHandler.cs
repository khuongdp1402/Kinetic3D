using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Application.Features.CustomRequests;
using Kinetic3D.Application.Features.CustomRequests.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.Application.Features.CustomRequests.Queries;

public class GetCustomRequestsQueryHandler : IRequestHandler<GetCustomRequestsQuery, List<CustomRequestDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCustomRequestsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CustomRequestDto>> Handle(GetCustomRequestsQuery request, CancellationToken cancellationToken)
    {
        var requests = await _context.CustomRequests
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);

        return requests.Select(r => r.ToDto()).ToList();
    }
}
