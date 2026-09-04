using Kinetic3D.Application.Features.CustomRequests.DTOs;
using Kinetic3D.Domain.Entities;

namespace Kinetic3D.Application.Features.CustomRequests;

public static class CustomRequestMappingExtensions
{
    public static CustomRequestDto ToDto(this CustomRequest request)
    {
        return new CustomRequestDto(
            request.Id,
            request.UserId,
            request.CustomerEmail,
            request.ReferenceImageUrl,
            request.SketchImageUrl,
            request.Description,
            request.Status.ToString(),
            request.QuotedPrice,
            request.AdminNote,
            request.CreatedAt);
    }
}
