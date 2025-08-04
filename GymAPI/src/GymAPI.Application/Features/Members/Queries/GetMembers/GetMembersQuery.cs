using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using MediatR;

namespace GymAPI.Application.Features.Members.Queries.GetMembers;

public record GetMembersQuery() : IRequest<Result<IEnumerable<MemberDto>>>;