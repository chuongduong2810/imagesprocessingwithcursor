using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using MediatR;

namespace GymAPI.Application.Features.Assignments.Queries.GetAssignmentById;

public record GetAssignmentByIdQuery(Guid Id) : IRequest<Result<AssignmentDto>>;