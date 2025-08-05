using GymAPI.Application.Features.WorkoutSuggestions;
using Microsoft.AspNetCore.Mvc;

namespace GymAPI.API.Controllers;

[Route("api/[controller]")]
public class ScheduleController : BaseApiController
{
    private readonly IGeminiWorkoutSuggestionService _workoutSuggestionService;

    public ScheduleController(IGeminiWorkoutSuggestionService workoutSuggestionService)
    {
        _workoutSuggestionService = workoutSuggestionService;
    }

    /// <summary>
    /// Get AI-powered workout schedule suggestions based on user profile
    /// </summary>
    /// <param name="request">User profile information for workout suggestion</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Weekly workout plan with exercises</returns>
    [HttpPost("suggest")]
    [ProducesResponseType(typeof(WorkoutSuggestionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<WorkoutSuggestionResponse>> SuggestWorkout(
        [FromBody] WorkoutSuggestionRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _workoutSuggestionService.GetWorkoutSuggestionAsync(request, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Workout Suggestion Failed",
                    Detail = result.ErrorMessage,
                    Status = StatusCodes.Status400BadRequest
                });
            }

            return Ok(result);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "Internal Server Error",
                Detail = "An unexpected error occurred while processing your request",
                Status = StatusCodes.Status500InternalServerError
            });
        }
    }
}