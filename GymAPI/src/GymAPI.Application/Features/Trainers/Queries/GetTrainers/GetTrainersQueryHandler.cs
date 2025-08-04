using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Common.Models;
using GymAPI.Domain.Interfaces;
using MediatR;

namespace GymAPI.Application.Features.Trainers.Queries.GetTrainers;

public class GetTrainersQueryHandler : IRequestHandler<GetTrainersQuery, Result<IEnumerable<TrainerDto>>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetTrainersQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IEnumerable<TrainerDto>>> Handle(GetTrainersQuery request, CancellationToken cancellationToken)
    {
        var trainers = await _unitOfWork.Trainers.GetAllAsync(cancellationToken);

        var trainerDtos = trainers.Select(t => new TrainerDto(
            t.Id,
            t.FirstName,
            t.LastName,
            t.Email,
            t.PhoneNumber,
            t.Specialization,
            t.Certification,
            t.HireDate,
            t.Status,
            t.HourlyRate,
            t.Bio,
            t.CreatedAt,
            t.UpdatedAt
        ));

        return Result<IEnumerable<TrainerDto>>.Success(trainerDtos);
    }
}