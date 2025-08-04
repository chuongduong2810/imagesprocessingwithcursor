using GymAPI.Domain.Entities;
using GymAPI.Domain.Interfaces;
using GymAPI.Domain.ValueObjects;
using GymAPI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GymAPI.Infrastructure.Repositories;

public class TrainerRepository : Repository<Trainer>, ITrainerRepository
{
    public TrainerRepository(GymDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Trainer>> GetActiveTrainersAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.Status == TrainerStatus.Active)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Trainer>> GetTrainersBySpecializationAsync(string specialization, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.Specialization.Contains(specialization) && t.Status == TrainerStatus.Active)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Trainer>> GetAvailableTrainersAsync(DateTime startTime, DateTime endTime, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.Status == TrainerStatus.Active &&
                       !t.Bookings.Any(b => b.StartTime < endTime && b.EndTime > startTime && 
                                            b.Status == BookingStatus.Confirmed))
            .ToListAsync(cancellationToken);
    }
}