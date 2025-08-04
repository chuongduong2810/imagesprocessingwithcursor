using GymAPI.Domain.Entities;
using GymAPI.Domain.Interfaces;
using GymAPI.Domain.ValueObjects;
using GymAPI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GymAPI.Infrastructure.Repositories;

public class EquipmentRepository : Repository<Equipment>, IEquipmentRepository
{
    public EquipmentRepository(GymDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Equipment>> GetAvailableEquipmentAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(e => e.Status == EquipmentStatus.Available)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Equipment>> GetEquipmentByCategoryAsync(EquipmentCategory category, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(e => e.Category == category && e.Status == EquipmentStatus.Available)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Equipment>> GetEquipmentForMaintenanceAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.Today;
        return await _dbSet
            .Where(e => e.NextMaintenanceDate <= today || e.Status == EquipmentStatus.Maintenance)
            .ToListAsync(cancellationToken);
    }
}