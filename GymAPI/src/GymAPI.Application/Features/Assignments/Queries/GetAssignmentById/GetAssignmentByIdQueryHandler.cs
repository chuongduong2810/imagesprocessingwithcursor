using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using GymAPI.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GymAPI.Application.Features.Assignments.Queries.GetAssignmentById;

public class GetAssignmentByIdQueryHandler : IRequestHandler<GetAssignmentByIdQuery, Result<AssignmentDto>>
{
    private readonly GymDbContext _context;

    public GetAssignmentByIdQueryHandler(GymDbContext context)
    {
        _context = context;
    }

    public async Task<Result<AssignmentDto>> Handle(GetAssignmentByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var assignment = await _context.Assignments
                .Include(a => a.Trainer)
                .Include(a => a.Member)
                .Include(a => a.Media)
                .Include(a => a.Submissions)
                .ThenInclude(s => s.Member)
                .Include(a => a.Submissions)
                .ThenInclude(s => s.Media)
                .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

            if (assignment == null)
            {
                return Result<AssignmentDto>.Failure("Assignment not found");
            }

            var assignmentDto = new AssignmentDto(
                assignment.Id,
                assignment.Title,
                assignment.Description,
                assignment.TrainerId,
                $"{assignment.Trainer.FirstName} {assignment.Trainer.LastName}",
                assignment.MemberId,
                assignment.Member != null ? $"{assignment.Member.FirstName} {assignment.Member.LastName}" : null,
                assignment.DueDate,
                assignment.Status,
                assignment.Type,
                assignment.Instructions,
                assignment.Points,
                assignment.IsPublic,
                assignment.CreatedAt,
                assignment.UpdatedAt,
                assignment.Media.Select(m => new AssignmentMediaDto(
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
                assignment.Submissions.Select(s => new AssignmentSubmissionDto(
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
            );

            return Result<AssignmentDto>.Success(assignmentDto);
        }
        catch (Exception ex)
        {
            return Result<AssignmentDto>.Failure(ex.Message);
        }
    }
}