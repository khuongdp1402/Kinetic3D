using System;
using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Application.Features.CustomRequests.DTOs;
using Kinetic3D.Domain.Entities;
using Kinetic3D.Domain.Enums;
using MediatR;

namespace Kinetic3D.Application.Features.CustomRequests.Commands;

public class CreateCustomRequestCommandHandler : IRequestHandler<CreateCustomRequestCommand, CustomRequestDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateCustomRequestCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<CustomRequestDto> Handle(CreateCustomRequestCommand request, CancellationToken cancellationToken)
    {
        var customRequest = new CustomRequest
        {
            Id = Guid.NewGuid(),
            UserId = _currentUserService.UserId,
            CustomerEmail = request.CustomerEmail,
            ReferenceImageUrl = request.ReferenceImageUrl,
            SketchImageUrl = request.SketchImageUrl,
            Description = request.Description,
            Status = CustomRequestStatus.PendingReview
        };

        _context.CustomRequests.Add(customRequest);
        await _context.SaveChangesAsync(cancellationToken);

        return customRequest.ToDto();
    }
}
