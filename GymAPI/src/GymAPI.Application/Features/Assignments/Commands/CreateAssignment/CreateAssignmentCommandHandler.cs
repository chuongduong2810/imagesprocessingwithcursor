using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using GymAPI.Domain.Entities;
using GymAPI.Domain.Interfaces;
using MediatR;

namespace GymAPI.Application.Features.Assignments.Commands.CreateAssignment;

public class CreateAssignmentCommandHandler : IRequestHandler<CreateAssignmentCommand, Result<AssignmentDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateAssignmentCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<AssignmentDto>> Handle(CreateAssignmentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var dto = request.Assignment;

            // Verify trainer exists
            var trainer = await _unitOfWork.Trainers.GetByIdAsync(dto.TrainerId, cancellationToken);
            if (trainer == null)
            {
                return Result<AssignmentDto>.Failure("Trainer not found");
            }

            // Verify member exists if specified
            Member? member = null;
            if (dto.MemberId.HasValue)
            {
                member = await _unitOfWork.Members.GetByIdAsync(dto.MemberId.Value, cancellationToken);
                if (member == null)
                {
                    return Result<AssignmentDto>.Failure("Member not found");
                }
            }

            var assignment = new Assignment
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                TrainerId = dto.TrainerId,
                MemberId = dto.MemberId,
                DueDate = dto.DueDate,
                Type = dto.Type,
                Instructions = dto.Instructions,
                Points = dto.Points,
                IsPublic = dto.IsPublic
            };

            await _unitOfWork.Assignments.AddAsync(assignment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Reload with navigation properties
            var createdAssignment = await _unitOfWork.Assignments.GetByIdWithIncludesAsync(assignment.Id, cancellationToken);

            var assignmentDto = new AssignmentDto(
                createdAssignment!.Id,
                createdAssignment.Title,
                createdAssignment.Description,
                createdAssignment.TrainerId,
                $"{createdAssignment.Trainer.FirstName} {createdAssignment.Trainer.LastName}",
                createdAssignment.MemberId,
                createdAssignment.Member != null ? $"{createdAssignment.Member.FirstName} {createdAssignment.Member.LastName}" : null,
                createdAssignment.DueDate,
                createdAssignment.Status,
                createdAssignment.Type,
                createdAssignment.Instructions,
                createdAssignment.Points,
                createdAssignment.IsPublic,
                createdAssignment.CreatedAt,
                createdAssignment.UpdatedAt,
                createdAssignment.Media.Select(m => new AssignmentMediaDto(
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
                createdAssignment.Submissions.Select(s => new AssignmentSubmissionDto(
                    s.Id,
                    s.AssignmentId,
                    s.MemberId,
                    "",
                    s.Content,
                    s.SubmittedAt,
                    s.Status,
                    s.Score,
                    s.FeedbackFromTrainer,
                    s.ReviewedAt,
                    Enumerable.Empty<SubmissionMediaDto>()
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