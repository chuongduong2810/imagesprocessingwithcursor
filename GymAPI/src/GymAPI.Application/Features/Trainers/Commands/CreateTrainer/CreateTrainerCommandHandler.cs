using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using GymAPI.Domain.Entities;
using GymAPI.Domain.Interfaces;
using GymAPI.Domain.ValueObjects;
using MediatR;

namespace GymAPI.Application.Features.Trainers.Commands.CreateTrainer;

public class CreateTrainerCommandHandler : IRequestHandler<CreateTrainerCommand, Result<TrainerDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateTrainerCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<TrainerDto>> Handle(CreateTrainerCommand request, CancellationToken cancellationToken)
    {
        var trainer = new Trainer
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Specialization = request.Specialization,
            Certification = request.Certification,
            HireDate = DateTime.UtcNow,
            Status = TrainerStatus.Active,
            HourlyRate = request.HourlyRate,
            Bio = request.Bio,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Trainers.AddAsync(trainer, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var trainerDto = new TrainerDto(
            trainer.Id,
            trainer.FirstName,
            trainer.LastName,
            trainer.Email,
            trainer.PhoneNumber,
            trainer.Specialization,
            trainer.Certification,
            trainer.HireDate,
            trainer.Status,
            trainer.HourlyRate,
            trainer.Bio,
            trainer.CreatedAt,
            trainer.UpdatedAt
        );

        return Result<TrainerDto>.Success(trainerDto);
    }
}