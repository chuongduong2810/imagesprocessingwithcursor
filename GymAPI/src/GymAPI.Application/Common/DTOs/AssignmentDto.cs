using GymAPI.Domain.ValueObjects;

namespace GymAPI.Application.Common.DTOs;

public record AssignmentDto(
    Guid Id,
    string Title,
    string Description,
    Guid TrainerId,
    string TrainerName,
    Guid? MemberId,
    string? MemberName,
    DateTime DueDate,
    AssignmentStatus Status,
    AssignmentType Type,
    string Instructions,
    int Points,
    bool IsPublic,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IEnumerable<AssignmentMediaDto> Media,
    IEnumerable<AssignmentSubmissionDto> Submissions
);

public record AssignmentMediaDto(
    Guid Id,
    string FileName,
    string OriginalFileName,
    string ContentType,
    string FilePath,
    long FileSize,
    MediaType MediaType,
    string? ThumbnailPath,
    string? Description,
    int SortOrder
);

public record AssignmentSubmissionDto(
    Guid Id,
    Guid AssignmentId,
    Guid MemberId,
    string MemberName,
    string Content,
    DateTime SubmittedAt,
    SubmissionStatus Status,
    int? Score,
    string? FeedbackFromTrainer,
    DateTime? ReviewedAt,
    IEnumerable<SubmissionMediaDto> Media
);

public record SubmissionMediaDto(
    Guid Id,
    string FileName,
    string OriginalFileName,
    string ContentType,
    string FilePath,
    long FileSize,
    MediaType MediaType,
    string? ThumbnailPath,
    string? Description
);

public record CreateAssignmentDto(
    string Title,
    string Description,
    Guid TrainerId,
    Guid? MemberId,
    DateTime DueDate,
    AssignmentType Type,
    string Instructions,
    int Points,
    bool IsPublic
);

public record UpdateAssignmentDto(
    string Title,
    string Description,
    Guid? MemberId,
    DateTime DueDate,
    AssignmentType Type,
    string Instructions,
    int Points,
    bool IsPublic,
    AssignmentStatus Status
);

public record CreateAssignmentSubmissionDto(
    Guid AssignmentId,
    Guid MemberId,
    string Content
);

public record UpdateAssignmentSubmissionDto(
    string Content,
    SubmissionStatus Status,
    int? Score,
    string? FeedbackFromTrainer
);

public record CreateAssignmentMediaDto(
    Guid AssignmentId,
    string FileName,
    string OriginalFileName,
    string ContentType,
    string FilePath,
    long FileSize,
    MediaType MediaType,
    string? ThumbnailPath,
    string? Description,
    int SortOrder
);

public record CreateSubmissionMediaDto(
    Guid SubmissionId,
    string FileName,
    string OriginalFileName,
    string ContentType,
    string FilePath,
    long FileSize,
    MediaType MediaType,
    string? ThumbnailPath,
    string? Description
);