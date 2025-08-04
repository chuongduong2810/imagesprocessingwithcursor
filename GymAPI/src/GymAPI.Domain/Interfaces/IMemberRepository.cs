using GymAPI.Domain.Entities;

namespace GymAPI.Domain.Interfaces;

public interface IMemberRepository : IRepository<Member>
{
    Task<Member?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<IEnumerable<Member>> GetActiveMembersAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Member>> GetMembersByJoinDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
}