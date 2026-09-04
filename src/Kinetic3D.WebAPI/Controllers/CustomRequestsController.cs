using System;
using System.Threading.Tasks;
using Kinetic3D.Application.Features.CustomRequests.Commands;
using Kinetic3D.Application.Features.CustomRequests.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kinetic3D.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomRequestsController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomRequestsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomRequestCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetAll), new { }, result);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetCustomRequestsQuery());
        return Ok(result);
    }

    [HttpPut("{id}/quote")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Quote(Guid id, [FromBody] QuoteCustomRequestCommand command)
    {
        if (id != command.RequestId)
        {
            return BadRequest();
        }

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id}/confirm")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        var result = await _mediator.Send(new ConfirmCustomRequestCommand { RequestId = id });
        return Ok(result);
    }

    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Reject(Guid id, [FromBody] RejectCustomRequestCommand command)
    {
        if (id != command.RequestId)
        {
            return BadRequest();
        }

        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
