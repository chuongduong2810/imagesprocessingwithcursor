using GymAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GymAPI.Infrastructure.Data;

public class GymDbContext : DbContext
{
    public GymDbContext(DbContextOptions<GymDbContext> options) : base(options)
    {
    }

    public DbSet<Member> Members { get; set; }
    public DbSet<Trainer> Trainers { get; set; }
    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<Membership> Memberships { get; set; }
    public DbSet<MembershipPlan> MembershipPlans { get; set; }
    public DbSet<WorkoutSession> WorkoutSessions { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all configurations from the assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(GymDbContext).Assembly);

        // Global filter for soft delete
        modelBuilder.Entity<Member>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Trainer>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Equipment>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Membership>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<MembershipPlan>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<WorkoutSession>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Exercise>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Booking>().HasQueryFilter(e => !e.IsDeleted);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return await base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is Domain.Common.BaseEntity && 
                       (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            var entity = (Domain.Common.BaseEntity)entry.Entity;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}