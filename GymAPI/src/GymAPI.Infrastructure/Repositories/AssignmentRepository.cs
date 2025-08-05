using GymAPI.Domain.Entities;
using GymAPI.Domain.Interfaces;
using GymAPI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GymAPI.Infrastructure.Repositories;

public class AssignmentRepository : Repository<Assignment>, IAssignmentRepository
{
    public AssignmentRepository(GymDbContext context) : base(context)
    {
    }

    public async Task<Assignment?> GetByIdWithIncludesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(a => a.Trainer)
            .Include(a => a.Member)
            .Include(a => a.Media)
            .Include(a => a.Submissions)
            .ThenInclude(s => s.Member)
            .Include(a => a.Submissions)
            .ThenInclude(s => s.Media)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Assignment>> GetWithIncludesAsync(
        Guid? trainerId = null,
        Guid? memberId = null,
        bool? isPublic = null,
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet
            .Include(a => a.Trainer)
            .Include(a => a.Member)
            .Include(a => a.Media)
            .Include(a => a.Submissions)
            .ThenInclude(s => s.Member)
            .Include(a => a.Submissions)
            .ThenInclude(s => s.Media)
            .AsQueryable();

        // Apply filters
        if (trainerId.HasValue)
        {
            query = query.Where(a => a.TrainerId == trainerId.Value);
        }

        if (memberId.HasValue)
        {
            query = query.Where(a => a.MemberId == memberId.Value || a.IsPublic);
        }

        if (isPublic.HasValue)
        {
            query = query.Where(a => a.IsPublic == isPublic.Value);
        }

        // Apply pagination and ordering
        return await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Assignment>> GetByTrainerIdAsync(Guid trainerId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(a => a.Trainer)
            .Include(a => a.Member)
            .Include(a => a.Media)
            .Include(a => a.Submissions)
            .Where(a => a.TrainerId == trainerId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Assignment>> GetByMemberIdAsync(Guid memberId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(a => a.Trainer)
            .Include(a => a.Member)
            .Include(a => a.Media)
            .Include(a => a.Submissions)
            .Where(a => a.MemberId == memberId || a.IsPublic)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Assignment>> GetPublicAssignmentsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(a => a.Trainer)
            .Include(a => a.Member)
            .Include(a => a.Media)
            .Include(a => a.Submissions)
            .Where(a => a.IsPublic)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}