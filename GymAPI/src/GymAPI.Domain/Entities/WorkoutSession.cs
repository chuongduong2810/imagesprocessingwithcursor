using GymAPI.Domain.Common;
using GymAPI.Domain.ValueObjects;

namespace GymAPI.Domain.Entities;

public class WorkoutSession : BaseEntity
{
    public Guid MemberId { get; set; }
    public Guid? TrainerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public SessionType Type { get; set; }
    public WorkoutStatus Status { get; set; }
    public string Notes { get; set; } = string.Empty;
    public int CaloriesBurned { get; set; }
    
    // Navigation properties
    public Member Member { get; set; } = null!;
    public Trainer? Trainer { get; set; }
    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
}