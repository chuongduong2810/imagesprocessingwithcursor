using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using GymAPI.Domain.Interfaces;
using MediatR;

namespace GymAPI.Application.Features.Members.Queries.GetMembers;

public class GetMembersQueryHandler : IRequestHandler<GetMembersQuery, Result<IEnumerable<MemberDto>>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetMembersQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IEnumerable<MemberDto>>> Handle(GetMembersQuery request, CancellationToken cancellationToken)
    {
        var members = await _unitOfWork.Members.GetAllAsync(cancellationToken);

        var memberDtos = members.Select(m => new MemberDto(
            m.Id,
            m.FirstName,
            m.LastName,
            m.Email,
            m.PhoneNumber,
            m.DateOfBirth,
            m.Gender,
            m.JoinDate,
            m.Status,
            m.EmergencyContactName,
            m.EmergencyContactPhone,
            m.CreatedAt,
            m.UpdatedAt
        ));

        return Result<IEnumerable<MemberDto>>.Success(memberDtos);
    }
}