namespace GymAPI.Application.Features.WorkoutSuggestions;

public interface IGeminiWorkoutSuggestionService
{
    Task<WorkoutSuggestionResponse> GetWorkoutSuggestionAsync(WorkoutSuggestionRequest request, CancellationToken cancellationToken = default);
}