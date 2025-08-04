using GymAPI.Application.Features.Members.Commands.CreateMember;
using GymAPI.Application.Features.Members.Queries.GetMemberById;
using GymAPI.Application.Features.Members.Queries.GetMembers;
using Microsoft.AspNetCore.Mvc;

namespace GymAPI.API.Controllers;

public class MembersController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetMembers()
    {
        var result = await Mediator.Send(new GetMembersQuery());
        return HandleResult(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMemberById(Guid id)
    {
        var result = await Mediator.Send(new GetMemberByIdQuery(id));
        return HandleResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMember([FromBody] CreateMemberCommand command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
}