using System.ComponentModel.DataAnnotations;
using Kinetic3D.Application.Features.CustomRequests.DTOs;
using MediatR;

namespace Kinetic3D.Application.Features.CustomRequests.Commands;

public class CreateCustomRequestCommand : IRequest<CustomRequestDto>
{
    public string? CustomerEmail { get; set; }

    [Required(ErrorMessage = "Ảnh tham khảo là bắt buộc.")]
    public string ReferenceImageUrl { get; set; } = string.Empty;

    public string? SketchImageUrl { get; set; }

    [Required(ErrorMessage = "Mô tả yêu cầu là bắt buộc.")]
    public string Description { get; set; } = string.Empty;
}
