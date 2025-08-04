using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using MediatR;

namespace GymAPI.Application.Features.Assignments.Queries.GetAssignments;

public record GetAssignmentsQuery(
    Guid? TrainerId = null,
    Guid? MemberId = null,
    bool? IsPublic = null,
    int Page = 1,
    int PageSize = 10
) : IRequest<Result<IEnumerable<AssignmentDto>>>;