using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using MediatR;

namespace GymAPI.Application.Features.Trainers.Queries.GetTrainers;

public record GetTrainersQuery() : IRequest<Result<IEnumerable<TrainerDto>>>;