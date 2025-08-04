using GymAPI.Domain.Entities;
using GymAPI.Domain.ValueObjects;

namespace GymAPI.Domain.Interfaces;

public interface IEquipmentRepository : IRepository<Equipment>
{
    Task<IEnumerable<Equipment>> GetAvailableEquipmentAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Equipment>> GetEquipmentByCategoryAsync(EquipmentCategory category, CancellationToken cancellationToken = default);
    Task<IEnumerable<Equipment>> GetEquipmentForMaintenanceAsync(CancellationToken cancellationToken = default);
}