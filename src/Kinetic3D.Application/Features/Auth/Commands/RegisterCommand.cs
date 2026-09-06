using System.ComponentModel.DataAnnotations;
using Kinetic3D.Application.Features.Auth.DTOs;
using MediatR;

namespace Kinetic3D.Application.Features.Auth.Commands;

public class RegisterCommand : IRequest<AuthResultDto>
{
    [Required(ErrorMessage = "Email là bắt buộc.")]
    [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu là bắt buộc.")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên hiển thị là bắt buộc.")]
    public string DisplayName { get; set; } = string.Empty;

    public string? DeviceHash { get; set; }
}
