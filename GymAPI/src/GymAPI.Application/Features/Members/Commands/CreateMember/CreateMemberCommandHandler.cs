using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using GymAPI.Domain.Entities;
using GymAPI.Domain.Interfaces;
using GymAPI.Domain.ValueObjects;
using MediatR;

namespace GymAPI.Application.Features.Members.Commands.CreateMember;

public class CreateMemberCommandHandler : IRequestHandler<CreateMemberCommand, Result<MemberDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateMemberCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<MemberDto>> Handle(CreateMemberCommand request, CancellationToken cancellationToken)
    {
        // Check if email already exists
        var existingMember = await _unitOfWork.Members.GetByEmailAsync(request.Email, cancellationToken);
        if (existingMember != null)
        {
            return Result<MemberDto>.Failure("A member with this email already exists.");
        }

        var member = new Member
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender,
            JoinDate = DateTime.UtcNow,
            Status = MembershipStatus.Active,
            EmergencyContactName = request.EmergencyContactName,
            EmergencyContactPhone = request.EmergencyContactPhone,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Members.AddAsync(member, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var memberDto = new MemberDto(
            member.Id,
            member.FirstName,
            member.LastName,
            member.Email,
            member.PhoneNumber,
            member.DateOfBirth,
            member.Gender,
            member.JoinDate,
            member.Status,
            member.EmergencyContactName,
            member.EmergencyContactPhone,
            member.CreatedAt,
            member.UpdatedAt
        );

        return Result<MemberDto>.Success(memberDto);
    }
}