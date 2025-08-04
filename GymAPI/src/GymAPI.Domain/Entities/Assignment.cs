using GymAPI.Domain.Common;
using GymAPI.Domain.ValueObjects;

namespace GymAPI.Domain.Entities;

public class Assignment : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid TrainerId { get; set; }
    public Guid? MemberId { get; set; } // null means assignment is for all members
    public DateTime DueDate { get; set; }
    public AssignmentStatus Status { get; set; } = AssignmentStatus.Active;
    public AssignmentType Type { get; set; } = AssignmentType.Exercise;
    public string Instructions { get; set; } = string.Empty;
    public int Points { get; set; } = 0; // Points awarded for completion
    public bool IsPublic { get; set; } = true; // Public assignments visible to all members
    
    // Navigation properties
    public Trainer Trainer { get; set; } = null!;
    public Member? Member { get; set; }
    public ICollection<AssignmentMedia> Media { get; set; } = new List<AssignmentMedia>();
    public ICollection<AssignmentSubmission> Submissions { get; set; } = new List<AssignmentSubmission>();
}

public class AssignmentMedia : BaseEntity
{
    public Guid AssignmentId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public MediaType MediaType { get; set; }
    public string? ThumbnailPath { get; set; }
    public string? Description { get; set; }
    public int SortOrder { get; set; }
    
    // Navigation properties
    public Assignment Assignment { get; set; } = null!;
}

public class AssignmentSubmission : BaseEntity
{
    public Guid AssignmentId { get; set; }
    public Guid MemberId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;
    public int? Score { get; set; }
    public string? FeedbackFromTrainer { get; set; }
    public DateTime? ReviewedAt { get; set; }
    
    // Navigation properties
    public Assignment Assignment { get; set; } = null!;
    public Member Member { get; set; } = null!;
    public ICollection<SubmissionMedia> Media { get; set; } = new List<SubmissionMedia>();
}

public class SubmissionMedia : BaseEntity
{
    public Guid SubmissionId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public MediaType MediaType { get; set; }
    public string? ThumbnailPath { get; set; }
    public string? Description { get; set; }
    
    // Navigation properties
    public AssignmentSubmission Submission { get; set; } = null!;
}