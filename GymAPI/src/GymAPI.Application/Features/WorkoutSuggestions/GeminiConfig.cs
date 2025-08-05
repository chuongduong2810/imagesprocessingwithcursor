namespace GymAPI.Application.Features.WorkoutSuggestions;

public class GeminiConfig
{
    public const string SectionName = "Gemini";
    
    public string ApiKey { get; set; } = string.Empty;
    public string ApiUrl { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
}