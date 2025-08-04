using GymAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GymAPI.Infrastructure.Data.Configurations;

public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.FirstName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(m => m.LastName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(m => m.Email)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(m => m.Email)
            .IsUnique();

        builder.Property(m => m.PhoneNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(m => m.Gender)
            .HasConversion<int>();

        builder.Property(m => m.Status)
            .HasConversion<int>();

        builder.Property(m => m.EmergencyContactName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.EmergencyContactPhone)
            .IsRequired()
            .HasMaxLength(20);

        // Relationships
        builder.HasMany(m => m.Memberships)
            .WithOne(ms => ms.Member)
            .HasForeignKey(ms => ms.MemberId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(m => m.WorkoutSessions)
            .WithOne(ws => ws.Member)
            .HasForeignKey(ws => ws.MemberId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(m => m.Bookings)
            .WithOne(b => b.Member)
            .HasForeignKey(b => b.MemberId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}