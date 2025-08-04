using GymAPI.Domain.Common;
using GymAPI.Domain.ValueObjects;

namespace GymAPI.Domain.Entities;

public class Booking : BaseEntity
{
    public Guid MemberId { get; set; }
    public Guid? TrainerId { get; set; }
    public Guid? EquipmentId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public BookingType Type { get; set; }
    public BookingStatus Status { get; set; }
    public string Notes { get; set; } = string.Empty;
    public DateTime? CancellationDate { get; set; }
    public string? CancellationReason { get; set; }
    
    // Navigation properties
    public Member Member { get; set; } = null!;
    public Trainer? Trainer { get; set; }
    public Equipment? Equipment { get; set; }
}