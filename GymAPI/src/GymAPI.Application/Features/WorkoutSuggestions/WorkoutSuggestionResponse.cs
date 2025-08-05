namespace GymAPI.Application.Features.WorkoutSuggestions;

public class WorkoutSuggestionResponse
{
    public Dictionary<string, List<string>> WeeklyPlan { get; set; } = new();
    public string? AdditionalTips { get; set; }
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }
}

public class DayWorkout
{
    public string Day { get; set; } = string.Empty;
    public List<string> Exercises { get; set; } = new();
}