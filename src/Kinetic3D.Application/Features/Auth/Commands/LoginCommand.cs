using System.ComponentModel.DataAnnotations;
using Kinetic3D.Application.Features.Auth.DTOs;
using MediatR;

namespace Kinetic3D.Application.Features.Auth.Commands;

public class LoginCommand : IRequest<AuthResultDto>
{
    [Required(ErrorMessage = "Email là bắt buộc.")]
    [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu là bắt buộc.")]
    public string Password { get; set; } = string.Empty;
}
