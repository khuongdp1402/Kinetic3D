using System;
using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Application.Features.CustomRequests;
using Kinetic3D.Application.Features.CustomRequests.DTOs;
using Kinetic3D.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.Application.Features.CustomRequests.Commands;

public class RejectCustomRequestCommandHandler : IRequestHandler<RejectCustomRequestCommand, CustomRequestDto>
{
    private readonly IApplicationDbContext _context;

    public RejectCustomRequestCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CustomRequestDto> Handle(RejectCustomRequestCommand request, CancellationToken cancellationToken)
    {
        var customRequest = await _context.CustomRequests.FirstOrDefaultAsync(r => r.Id == request.RequestId, cancellationToken);
        if (customRequest == null)
        {
            throw new InvalidOperationException("Yêu cầu custom không tồn tại.");
        }

        customRequest.Status = CustomRequestStatus.Rejected;
        customRequest.AdminNote = request.AdminNote;
        await _context.SaveChangesAsync(cancellationToken);

        return customRequest.ToDto();
    }
}
