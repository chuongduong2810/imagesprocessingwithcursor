using GymAPI.Domain.Entities;

namespace GymAPI.Domain.Interfaces;

public interface IAssignmentRepository : IRepository<Assignment>
{
    Task<Assignment?> GetByIdWithIncludesAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Assignment>> GetWithIncludesAsync(
        Guid? trainerId = null,
        Guid? memberId = null,
        bool? isPublic = null,
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);
    Task<IEnumerable<Assignment>> GetByTrainerIdAsync(Guid trainerId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Assignment>> GetByMemberIdAsync(Guid memberId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Assignment>> GetPublicAssignmentsAsync(CancellationToken cancellationToken = default);
}