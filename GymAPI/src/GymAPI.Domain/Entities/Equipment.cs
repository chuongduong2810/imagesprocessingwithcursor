using GymAPI.Domain.Common;
using GymAPI.Domain.ValueObjects;

namespace GymAPI.Domain.Entities;

public class Equipment : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public EquipmentCategory Category { get; set; }
    public string Manufacturer { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public decimal PurchasePrice { get; set; }
    public EquipmentStatus Status { get; set; }
    public DateTime? LastMaintenanceDate { get; set; }
    public DateTime? NextMaintenanceDate { get; set; }
    public string Location { get; set; } = string.Empty;
    
    // Navigation properties
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}