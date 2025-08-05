using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace GymAPI.Application.Features.WorkoutSuggestions;

public class GeminiWorkoutSuggestionService : IGeminiWorkoutSuggestionService
{
    private readonly HttpClient _httpClient;
    private readonly GeminiConfig _config;
    private readonly ILogger<GeminiWorkoutSuggestionService> _logger;

    public GeminiWorkoutSuggestionService(
        HttpClient httpClient,
        IOptions<GeminiConfig> config,
        ILogger<GeminiWorkoutSuggestionService> logger)
    {
        _httpClient = httpClient;
        _config = config.Value;
        _logger = logger;
    }

    public async Task<WorkoutSuggestionResponse> GetWorkoutSuggestionAsync(
        WorkoutSuggestionRequest request, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var prompt = BuildPrompt(request);
            var geminiRequest = new GeminiRequest
            {
                Contents = new List<GeminiContent>
                {
                    new GeminiContent
                    {
                        Parts = new List<GeminiPart>
                        {
                            new GeminiPart { Text = prompt }
                        }
                    }
                }
            };

            var jsonContent = JsonSerializer.Serialize(geminiRequest);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var requestUrl = $"{_config.ApiUrl}?key={_config.ApiKey}";
            var response = await _httpClient.PostAsync(requestUrl, content, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Gemini API request failed: {StatusCode} - {Content}", 
                    response.StatusCode, errorContent);
                
                return new WorkoutSuggestionResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"API request failed: {response.StatusCode}"
                };
            }

            var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseContent);

            if (geminiResponse?.Candidates?.Any() != true)
            {
                return new WorkoutSuggestionResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "No response received from Gemini API"
                };
            }

            var aiText = geminiResponse.Candidates[0].Content.Parts[0].Text;
            var workoutPlan = ParseWorkoutPlan(aiText);

            return new WorkoutSuggestionResponse
            {
                WeeklyPlan = workoutPlan,
                IsSuccess = true,
                AdditionalTips = ExtractAdditionalTips(aiText)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting workout suggestion");
            return new WorkoutSuggestionResponse
            {
                IsSuccess = false,
                ErrorMessage = "An error occurred while processing your request"
            };
        }
    }

    private string BuildPrompt(WorkoutSuggestionRequest request)
    {
        var prompt = $@"Based on the following user profile:
- Gender: {request.Gender}
- Age: {request.Age}
- Weight: {request.Weight}kg
- Height: {request.Height}cm
- Goal: {request.Goal}
- Workout Days: {request.WorkoutDaysPerWeek} days per week
- Equipment: {request.Equipment}
{(string.IsNullOrEmpty(request.AdditionalNotes) ? "" : $"- Additional Notes: {request.AdditionalNotes}")}

Please suggest a detailed 7-day workout plan in the following JSON format:
{{
  ""Monday"": [""Exercise 1"", ""Exercise 2"", ""Exercise 3""],
  ""Tuesday"": [""Exercise 1"", ""Exercise 2"", ""Exercise 3""],
  ""Wednesday"": [""Rest""],
  ""Thursday"": [""Exercise 1"", ""Exercise 2"", ""Exercise 3""],
  ""Friday"": [""Exercise 1"", ""Exercise 2"", ""Exercise 3""],
  ""Saturday"": [""Rest""],
  ""Sunday"": [""Rest""]
}}

Requirements:
- Return ONLY valid JSON format
- Use rest days based on the workout frequency specified
- Each exercise should include sets/reps information (e.g., ""Push-ups 3x10"", ""Plank 3x30sec"")
- Consider the available equipment
- Match exercises to the user's goal
- Provide 3-5 exercises per workout day
- Distribute workout days evenly throughout the week

Also include a brief ""Tips"" section after the JSON with general advice for this user.";

        return prompt;
    }

    private Dictionary<string, List<string>> ParseWorkoutPlan(string aiResponse)
    {
        try
        {
            // Extract JSON from the response
            var jsonMatch = Regex.Match(aiResponse, @"\{[\s\S]*\}", RegexOptions.Multiline);
            if (!jsonMatch.Success)
            {
                _logger.LogWarning("Could not find JSON in AI response");
                return GetDefaultWorkoutPlan();
            }

            var jsonString = jsonMatch.Value;
            var workoutPlan = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(
                jsonString, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return workoutPlan ?? GetDefaultWorkoutPlan();
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Error parsing JSON response from Gemini");
            return GetDefaultWorkoutPlan();
        }
    }

    private string? ExtractAdditionalTips(string aiResponse)
    {
        var tipsMatch = Regex.Match(aiResponse, @"Tips?:?\s*(.+?)(?:\n\n|\Z)", RegexOptions.IgnoreCase | RegexOptions.Singleline);
        return tipsMatch.Success ? tipsMatch.Groups[1].Value.Trim() : null;
    }

    private Dictionary<string, List<string>> GetDefaultWorkoutPlan()
    {
        return new Dictionary<string, List<string>>
        {
            ["Monday"] = new List<string> { "Push-ups 3x10", "Plank 3x30sec", "Squats 3x15" },
            ["Tuesday"] = new List<string> { "Rest" },
            ["Wednesday"] = new List<string> { "Lunges 3x12", "Mountain Climbers 3x15", "Burpees 3x8" },
            ["Thursday"] = new List<string> { "Rest" },
            ["Friday"] = new List<string> { "Pull-ups 3x8", "Jumping Jacks 3x20", "Calf Raises 3x15" },
            ["Saturday"] = new List<string> { "Rest" },
            ["Sunday"] = new List<string> { "Rest" }
        };
    }
}