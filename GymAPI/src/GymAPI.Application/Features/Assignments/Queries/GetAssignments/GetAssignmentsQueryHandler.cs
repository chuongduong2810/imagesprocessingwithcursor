using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using GymAPI.Domain.Interfaces;
using MediatR;

namespace GymAPI.Application.Features.Assignments.Queries.GetAssignments;

public class GetAssignmentsQueryHandler : IRequestHandler<GetAssignmentsQuery, Result<IEnumerable<AssignmentDto>>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAssignmentsQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IEnumerable<AssignmentDto>>> Handle(GetAssignmentsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var assignments = await _unitOfWork.Assignments.GetWithIncludesAsync(
                request.TrainerId,
                request.MemberId,
                request.IsPublic,
                request.Page,
                request.PageSize,
                cancellationToken);

            var assignmentDtos = assignments.Select(a => new AssignmentDto(
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
            ));

            return Result<IEnumerable<AssignmentDto>>.Success(assignmentDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<AssignmentDto>>.Failure(ex.Message);
        }
    }
}