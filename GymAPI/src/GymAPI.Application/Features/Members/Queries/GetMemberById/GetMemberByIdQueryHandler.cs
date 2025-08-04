using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using GymAPI.Domain.Interfaces;
using MediatR;

namespace GymAPI.Application.Features.Members.Queries.GetMemberById;

public class GetMemberByIdQueryHandler : IRequestHandler<GetMemberByIdQuery, Result<MemberDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetMemberByIdQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<MemberDto>> Handle(GetMemberByIdQuery request, CancellationToken cancellationToken)
    {
        var member = await _unitOfWork.Members.GetByIdAsync(request.Id, cancellationToken);

        if (member == null)
        {
            return Result<MemberDto>.Failure("Member not found.");
        }

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