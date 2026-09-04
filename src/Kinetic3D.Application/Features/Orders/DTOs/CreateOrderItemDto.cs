using System;
using System.ComponentModel.DataAnnotations;

namespace Kinetic3D.Application.Features.Orders.DTOs;

public class CreateOrderItemDto
{
    [Required(ErrorMessage = "ProductId là bắt buộc.")]
    public Guid ProductId { get; set; }

    public Guid? VariantId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0.")]
    public int Quantity { get; set; } = 1;

    public string? CustomText { get; set; }
}
