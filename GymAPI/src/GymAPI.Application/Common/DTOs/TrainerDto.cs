using GymAPI.Domain.ValueObjects;

namespace GymAPI.Application.Common.DTOs;

public record TrainerDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string Specialization,
    string Certification,
    DateTime HireDate,
    TrainerStatus Status,
    decimal HourlyRate,
    string Bio,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateTrainerDto(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string Specialization,
    string Certification,
    decimal HourlyRate,
    string Bio
);

public record UpdateTrainerDto(
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Specialization,
    string Certification,
    decimal HourlyRate,
    string Bio
);