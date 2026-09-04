using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Kinetic3D.Application.Features.Orders.DTOs;
using MediatR;

namespace Kinetic3D.Application.Features.Orders.Commands;

public class CreateOrderCommand : IRequest<OrderDto>
{
    [Required(ErrorMessage = "Email là bắt buộc.")]
    [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
    public string CustomerEmail { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
    public string CustomerPhone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Họ tên người nhận là bắt buộc.")]
    public string ShippingFullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Địa chỉ giao hàng là bắt buộc.")]
    public string ShippingAddress { get; set; } = string.Empty;

    [Required(ErrorMessage = "Thành phố là bắt buộc.")]
    public string ShippingCity { get; set; } = string.Empty;

    public string? Note { get; set; }

    [Required(ErrorMessage = "Đơn hàng phải có ít nhất 1 sản phẩm.")]
    [MinLength(1, ErrorMessage = "Đơn hàng phải có ít nhất 1 sản phẩm.")]
    public List<CreateOrderItemDto> Items { get; set; } = new List<CreateOrderItemDto>();
}
