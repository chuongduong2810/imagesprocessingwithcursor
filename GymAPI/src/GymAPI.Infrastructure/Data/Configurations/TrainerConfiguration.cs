using GymAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GymAPI.Infrastructure.Data.Configurations;

public class TrainerConfiguration : IEntityTypeConfiguration<Trainer>
{
    public void Configure(EntityTypeBuilder<Trainer> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.FirstName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(t => t.LastName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(t => t.Email)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(t => t.Email)
            .IsUnique();

        builder.Property(t => t.PhoneNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(t => t.Specialization)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(t => t.Certification)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Status)
            .HasConversion<int>();

        builder.Property(t => t.HourlyRate)
            .HasColumnType("decimal(18,2)");

        builder.Property(t => t.Bio)
            .HasMaxLength(1000);

        // Relationships
        builder.HasMany(t => t.WorkoutSessions)
            .WithOne(ws => ws.Trainer)
            .HasForeignKey(ws => ws.TrainerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(t => t.Bookings)
            .WithOne(b => b.Trainer)
            .HasForeignKey(b => b.TrainerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}