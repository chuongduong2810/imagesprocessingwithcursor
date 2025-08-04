using GymAPI.Application.Features.Trainers.Commands.CreateTrainer;
using GymAPI.Application.Features.Trainers.Queries.GetTrainers;
using Microsoft.AspNetCore.Mvc;

namespace GymAPI.API.Controllers;

public class TrainersController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetTrainers()
    {
        var result = await Mediator.Send(new GetTrainersQuery());
        return HandleResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTrainer([FromBody] CreateTrainerCommand command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
}