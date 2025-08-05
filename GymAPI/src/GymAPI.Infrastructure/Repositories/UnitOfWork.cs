using GymAPI.Domain.Entities;
using GymAPI.Domain.Interfaces;
using GymAPI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace GymAPI.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly GymDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(GymDbContext context)
    {
        _context = context;
        Members = new MemberRepository(_context);
        Trainers = new TrainerRepository(_context);
        Equipment = new EquipmentRepository(_context);
        Assignments = new AssignmentRepository(_context);
        Memberships = new Repository<Membership>(_context);
        MembershipPlans = new Repository<MembershipPlan>(_context);
        WorkoutSessions = new Repository<WorkoutSession>(_context);
        Exercises = new Repository<Exercise>(_context);
        Bookings = new Repository<Booking>(_context);
    }

    public IMemberRepository Members { get; }
    public ITrainerRepository Trainers { get; }
    public IEquipmentRepository Equipment { get; }
    public IAssignmentRepository Assignments { get; }
    public IRepository<Membership> Memberships { get; }
    public IRepository<MembershipPlan> MembershipPlans { get; }
    public IRepository<WorkoutSession> WorkoutSessions { get; }
    public IRepository<Exercise> Exercises { get; }
    public IRepository<Booking> Bookings { get; }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}