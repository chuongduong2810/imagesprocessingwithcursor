using GymAPI.Domain.ValueObjects;

namespace GymAPI.Application.Common.DTOs;

public record MemberDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    DateTime DateOfBirth,
    Gender Gender,
    DateTime JoinDate,
    MembershipStatus Status,
    string EmergencyContactName,
    string EmergencyContactPhone,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateMemberDto(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    DateTime DateOfBirth,
    Gender Gender,
    string EmergencyContactName,
    string EmergencyContactPhone
);

public record UpdateMemberDto(
    string FirstName,
    string LastName,
    string PhoneNumber,
    string EmergencyContactName,
    string EmergencyContactPhone
);