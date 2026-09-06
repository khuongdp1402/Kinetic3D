using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Application.Features.Orders;
using Kinetic3D.Application.Features.Orders.Commands;
using Kinetic3D.Application.Features.Orders.Queries;
using Kinetic3D.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IApplicationDbContext _context;

    public OrdersController(IMediator mediator, IApplicationDbContext context)
    {
        _mediator = mediator;
        _context = context;
    }

    [HttpGet("lookup")]
    public async Task<IActionResult> LookupOrder([FromQuery] string? query, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest(new { message = "Vui lòng nhập mã đơn hàng hoặc số điện thoại." });
        }

        var trimmed = query.Trim();
        Order? order = null;

        // 1. Match by OrderNumber (case-insensitive)
        order = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync(o => o.OrderNumber.ToUpper() == trimmed.ToUpper(), cancellationToken);

        // 2. Match by CustomerPhone
        if (order == null)
        {
            order = await _context.Orders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync(o => o.CustomerPhone == trimmed, cancellationToken);
        }

        // 3. Match by CustomerEmail
        if (order == null && trimmed.Contains('@'))
        {
            order = await _context.Orders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync(o => o.CustomerEmail.ToLower() == trimmed.ToLower(), cancellationToken);
        }

        // 4. Match by Guid
        if (order == null && Guid.TryParse(trimmed, out var guidId))
        {
            order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == guidId, cancellationToken);
        }

        if (order == null)
        {
            return NotFound(new { message = "Không tìm thấy thông tin đơn hàng với mã hoặc số điện thoại này." });
        }

        return Ok(order.ToDto());
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetOrderById), new { id = result.Id }, result);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetOrders()
    {
        var result = await _mediator.Send(new GetOrdersQuery());
        return Ok(result);
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyOrders()
    {
        var result = await _mediator.Send(new GetMyOrdersQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var result = await _mediator.Send(new GetOrderByIdQuery(id));
        if (result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusCommand command)
    {
        if (id != command.OrderId)
        {
            return BadRequest();
        }

        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
