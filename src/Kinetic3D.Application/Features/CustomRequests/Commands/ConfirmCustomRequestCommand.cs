using System;
using System.ComponentModel.DataAnnotations;
using Kinetic3D.Application.Features.CustomRequests.DTOs;
using MediatR;

namespace Kinetic3D.Application.Features.CustomRequests.Commands;

public class ConfirmCustomRequestCommand : IRequest<CustomRequestDto>
{
    [Required]
    public Guid RequestId { get; set; }
}
