using GymAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GymAPI.Infrastructure.Data.Configurations;

public class EquipmentConfiguration : IEntityTypeConfiguration<Equipment>
{
    public void Configure(EntityTypeBuilder<Equipment> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Description)
            .HasMaxLength(500);

        builder.Property(e => e.Category)
            .HasConversion<int>();

        builder.Property(e => e.Manufacturer)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.SerialNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(e => e.SerialNumber)
            .IsUnique();

        builder.Property(e => e.PurchasePrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.Status)
            .HasConversion<int>();

        builder.Property(e => e.Location)
            .IsRequired()
            .HasMaxLength(100);

        // Relationships
        builder.HasMany(e => e.Bookings)
            .WithOne(b => b.Equipment)
            .HasForeignKey(b => b.EquipmentId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}