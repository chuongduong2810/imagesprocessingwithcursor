using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using GymAPI.Domain.ValueObjects;
using MediatR;

namespace GymAPI.Application.Features.Members.Commands.CreateMember;

public record CreateMemberCommand(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    DateTime DateOfBirth,
    Gender Gender,
    string EmergencyContactName,
    string EmergencyContactPhone
) : IRequest<Result<MemberDto>>;