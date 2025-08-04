namespace GymAPI.Domain.ValueObjects;

public enum SubmissionStatus
{
    Submitted = 1,
    UnderReview = 2,
    Approved = 3,
    NeedsRevision = 4,
    Rejected = 5
}