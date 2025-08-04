using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using MediatR;

namespace GymAPI.Application.Features.Members.Queries.GetMemberById;

public record GetMemberByIdQuery(Guid Id) : IRequest<Result<MemberDto>>;