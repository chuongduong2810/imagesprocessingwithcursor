using GymAPI.Domain.Common;
using GymAPI.Domain.ValueObjects;

namespace GymAPI.Domain.Entities;

public class Exercise : BaseEntity
{
    public Guid WorkoutSessionId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ExerciseCategory Category { get; set; }
    public int Sets { get; set; }
    public int Reps { get; set; }
    public decimal? Weight { get; set; }
    public int? Duration { get; set; } // in seconds
    public decimal? Distance { get; set; } // in km
    public string Notes { get; set; } = string.Empty;
    
    // Navigation properties
    public WorkoutSession WorkoutSession { get; set; } = null!;
}