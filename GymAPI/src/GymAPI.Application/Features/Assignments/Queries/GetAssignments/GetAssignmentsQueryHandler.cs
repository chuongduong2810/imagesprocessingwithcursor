using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using GymAPI.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GymAPI.Application.Features.Assignments.Queries.GetAssignments;

public class GetAssignmentsQueryHandler : IRequestHandler<GetAssignmentsQuery, Result<IEnumerable<AssignmentDto>>>
{
    private readonly GymDbContext _context;

    public GetAssignmentsQueryHandler(GymDbContext context)
    {
        _context = context;
    }

    public async Task<Result<IEnumerable<AssignmentDto>>> Handle(GetAssignmentsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Assignments
                .Include(a => a.Trainer)
                .Include(a => a.Member)
                .Include(a => a.Media)
                .Include(a => a.Submissions)
                .ThenInclude(s => s.Member)
                .Include(a => a.Submissions)
                .ThenInclude(s => s.Media)
                .AsQueryable();

            // Apply filters
            if (request.TrainerId.HasValue)
            {
                query = query.Where(a => a.TrainerId == request.TrainerId.Value);
            }

            if (request.MemberId.HasValue)
            {
                query = query.Where(a => a.MemberId == request.MemberId.Value || a.IsPublic);
            }

            if (request.IsPublic.HasValue)
            {
                query = query.Where(a => a.IsPublic == request.IsPublic.Value);
            }

            // Apply pagination
            var assignments = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(a => new AssignmentDto(
                    a.Id,
                    a.Title,
                    a.Description,
                    a.TrainerId,
                    $"{a.Trainer.FirstName} {a.Trainer.LastName}",
                    a.MemberId,
                    a.Member != null ? $"{a.Member.FirstName} {a.Member.LastName}" : null,
                    a.DueDate,
                    a.Status,
                    a.Type,
                    a.Instructions,
                    a.Points,
                    a.IsPublic,
                    a.CreatedAt,
                    a.UpdatedAt,
                    a.Media.Select(m => new AssignmentMediaDto(
                        m.Id,
                        m.FileName,
                        m.OriginalFileName,
                        m.ContentType,
                        m.FilePath,
                        m.FileSize,
                        m.MediaType,
                        m.ThumbnailPath,
                        m.Description,
                        m.SortOrder
                    )),
                    a.Submissions.Select(s => new AssignmentSubmissionDto(
                        s.Id,
                        s.AssignmentId,
                        s.MemberId,
                        $"{s.Member.FirstName} {s.Member.LastName}",
                        s.Content,
                        s.SubmittedAt,
                        s.Status,
                        s.Score,
                        s.FeedbackFromTrainer,
                        s.ReviewedAt,
                        s.Media.Select(sm => new SubmissionMediaDto(
                            sm.Id,
                            sm.FileName,
                            sm.OriginalFileName,
                            sm.ContentType,
                            sm.FilePath,
                            sm.FileSize,
                            sm.MediaType,
                            sm.ThumbnailPath,
                            sm.Description
                        ))
                    ))
                ))
                .ToListAsync(cancellationToken);

            return Result<IEnumerable<AssignmentDto>>.Success(assignments);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<AssignmentDto>>.Failure(ex.Message);
        }
    }
}