using GymAPI.Application.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GymAPI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    private IMediator? _mediator;
    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<IMediator>();

    protected IActionResult HandleResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        if (result.ValidationErrors.Any())
        {
            return BadRequest(new
            {
                error = result.Error,
                validationErrors = result.ValidationErrors
            });
        }

        return BadRequest(new { error = result.Error });
    }

    protected IActionResult HandleResult(Result result)
    {
        if (result.IsSuccess)
        {
            return Ok();
        }

        if (result.ValidationErrors.Any())
        {
            return BadRequest(new
            {
                error = result.Error,
                validationErrors = result.ValidationErrors
            });
        }

        return BadRequest(new { error = result.Error });
    }
}