using GymAPI.Domain.Common;

namespace GymAPI.Domain.Entities;

public class MembershipPlan : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DurationDays { get; set; }
    public bool IsActive { get; set; }
    public int MaxBookingsPerDay { get; set; } = 2;
    public bool HasPoolAccess { get; set; }
    public bool HasSaunaAccess { get; set; }
    public bool HasPersonalTrainerAccess { get; set; }
    
    // Navigation properties
    public ICollection<Membership> Memberships { get; set; } = new List<Membership>();
}