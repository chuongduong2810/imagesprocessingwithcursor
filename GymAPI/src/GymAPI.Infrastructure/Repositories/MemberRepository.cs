using GymAPI.Domain.Entities;
using GymAPI.Domain.Interfaces;
using GymAPI.Domain.ValueObjects;
using GymAPI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GymAPI.Infrastructure.Repositories;

public class MemberRepository : Repository<Member>, IMemberRepository
{
    public MemberRepository(GymDbContext context) : base(context)
    {
    }

    public async Task<Member?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(m => m.Email == email, cancellationToken);
    }

    public async Task<IEnumerable<Member>> GetActiveMembersAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(m => m.Status == MembershipStatus.Active)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Member>> GetMembersByJoinDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(m => m.JoinDate >= startDate && m.JoinDate <= endDate)
            .ToListAsync(cancellationToken);
    }
}