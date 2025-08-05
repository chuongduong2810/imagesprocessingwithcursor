using System.ComponentModel.DataAnnotations;

namespace GymAPI.Application.Features.WorkoutSuggestions;

public class WorkoutSuggestionRequest
{
    [Required]
    public string Gender { get; set; } = string.Empty;

    [Required]
    [Range(10, 100, ErrorMessage = "Age must be between 10 and 100")]
    public int Age { get; set; }

    [Required]
    [Range(30, 300, ErrorMessage = "Weight must be between 30 and 300 kg")]
    public decimal Weight { get; set; }

    [Required]
    [Range(100, 250, ErrorMessage = "Height must be between 100 and 250 cm")]
    public decimal Height { get; set; }

    [Required]
    public string Goal { get; set; } = string.Empty; // "Gain Muscle", "Lose Fat", "Maintain"

    [Required]
    [Range(1, 7, ErrorMessage = "Workout days must be between 1 and 7")]
    public int WorkoutDaysPerWeek { get; set; }

    [Required]
    public string Equipment { get; set; } = string.Empty; // "Dumbbells", "Resistance Bands", "No Equipment", etc.

    public string? AdditionalNotes { get; set; }
}