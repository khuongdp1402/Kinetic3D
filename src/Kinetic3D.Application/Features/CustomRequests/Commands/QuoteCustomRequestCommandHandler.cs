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

public class QuoteCustomRequestCommandHandler : IRequestHandler<QuoteCustomRequestCommand, CustomRequestDto>
{
    private readonly IApplicationDbContext _context;

    public QuoteCustomRequestCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CustomRequestDto> Handle(QuoteCustomRequestCommand request, CancellationToken cancellationToken)
    {
        var customRequest = await _context.CustomRequests.FirstOrDefaultAsync(r => r.Id == request.RequestId, cancellationToken);
        if (customRequest == null)
        {
            throw new InvalidOperationException("Yêu cầu custom không tồn tại.");
        }

        customRequest.QuotedPrice = request.QuotedPrice;
        customRequest.AdminNote = request.AdminNote;
        customRequest.Status = CustomRequestStatus.Quoted;

        await _context.SaveChangesAsync(cancellationToken);

        return customRequest.ToDto();
    }
}
