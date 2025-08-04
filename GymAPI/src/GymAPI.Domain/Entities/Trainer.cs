using GymAPI.Domain.Common;
using GymAPI.Domain.ValueObjects;

namespace GymAPI.Domain.Entities;

public class Trainer : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string Certification { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public TrainerStatus Status { get; set; }
    public decimal HourlyRate { get; set; }
    public string Bio { get; set; } = string.Empty;
    
    // Navigation properties
    public ICollection<WorkoutSession> WorkoutSessions { get; set; } = new List<WorkoutSession>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}