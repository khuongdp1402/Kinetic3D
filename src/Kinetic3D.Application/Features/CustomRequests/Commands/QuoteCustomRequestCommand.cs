using System;
using System.ComponentModel.DataAnnotations;
using Kinetic3D.Application.Features.CustomRequests.DTOs;
using MediatR;

namespace Kinetic3D.Application.Features.CustomRequests.Commands;

public class QuoteCustomRequestCommand : IRequest<CustomRequestDto>
{
    [Required]
    public Guid RequestId { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Giá báo phải lớn hơn hoặc bằng 0.")]
    public decimal QuotedPrice { get; set; }

    public string? AdminNote { get; set; }
}
