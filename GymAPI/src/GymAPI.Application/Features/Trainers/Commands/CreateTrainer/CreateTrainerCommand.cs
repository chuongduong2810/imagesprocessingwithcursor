using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using MediatR;

namespace GymAPI.Application.Features.Trainers.Commands.CreateTrainer;

public record CreateTrainerCommand(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string Specialization,
    string Certification,
    decimal HourlyRate,
    string Bio
) : IRequest<Result<TrainerDto>>;