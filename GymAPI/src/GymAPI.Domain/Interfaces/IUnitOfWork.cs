namespace GymAPI.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IMemberRepository Members { get; }
    ITrainerRepository Trainers { get; }
    IEquipmentRepository Equipment { get; }
    IRepository<Entities.Membership> Memberships { get; }
    IRepository<Entities.MembershipPlan> MembershipPlans { get; }
    IRepository<Entities.WorkoutSession> WorkoutSessions { get; }
    IRepository<Entities.Exercise> Exercises { get; }
    IRepository<Entities.Booking> Bookings { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}