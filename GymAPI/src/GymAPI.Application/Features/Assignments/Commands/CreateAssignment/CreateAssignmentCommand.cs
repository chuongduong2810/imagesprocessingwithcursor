using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using MediatR;

namespace GymAPI.Application.Features.Assignments.Commands.CreateAssignment;

public record CreateAssignmentCommand(CreateAssignmentDto Assignment) : IRequest<Result<AssignmentDto>>;