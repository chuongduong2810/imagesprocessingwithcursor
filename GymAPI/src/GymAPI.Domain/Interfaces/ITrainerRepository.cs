using GymAPI.Domain.Entities;
using GymAPI.Domain.ValueObjects;

namespace GymAPI.Domain.Interfaces;

public interface ITrainerRepository : IRepository<Trainer>
{
    Task<IEnumerable<Trainer>> GetActiveTrainersAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Trainer>> GetTrainersBySpecializationAsync(string specialization, CancellationToken cancellationToken = default);
    Task<IEnumerable<Trainer>> GetAvailableTrainersAsync(DateTime startTime, DateTime endTime, CancellationToken cancellationToken = default);
}