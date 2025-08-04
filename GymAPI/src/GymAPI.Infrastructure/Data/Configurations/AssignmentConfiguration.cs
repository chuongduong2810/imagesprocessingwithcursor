using GymAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GymAPI.Infrastructure.Data.Configurations;

public class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
{
    public void Configure(EntityTypeBuilder<Assignment> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.Description)
            .HasMaxLength(1000);

        builder.Property(a => a.Instructions)
            .HasMaxLength(2000);

        builder.Property(a => a.Status)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(a => a.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(a => a.DueDate)
            .IsRequired();

        builder.Property(a => a.Points)
            .HasDefaultValue(0);

        builder.Property(a => a.IsPublic)
            .HasDefaultValue(true);

        // Foreign key relationships
        builder.HasOne(a => a.Trainer)
            .WithMany()
            .HasForeignKey(a => a.TrainerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Member)
            .WithMany()
            .HasForeignKey(a => a.MemberId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        // One-to-many relationships
        builder.HasMany(a => a.Media)
            .WithOne(m => m.Assignment)
            .HasForeignKey(m => m.AssignmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(a => a.Submissions)
            .WithOne(s => s.Assignment)
            .HasForeignKey(s => s.AssignmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(a => a.TrainerId);
        builder.HasIndex(a => a.MemberId);
        builder.HasIndex(a => a.DueDate);
        builder.HasIndex(a => a.Status);
        builder.HasIndex(a => a.IsPublic);
    }
}

public class AssignmentMediaConfiguration : IEntityTypeConfiguration<AssignmentMedia>
{
    public void Configure(EntityTypeBuilder<AssignmentMedia> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.OriginalFileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.ContentType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.FilePath)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(m => m.ThumbnailPath)
            .HasMaxLength(500);

        builder.Property(m => m.Description)
            .HasMaxLength(500);

        builder.Property(m => m.MediaType)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(m => m.SortOrder)
            .HasDefaultValue(0);

        // Indexes
        builder.HasIndex(m => m.AssignmentId);
        builder.HasIndex(m => m.MediaType);
    }
}

public class AssignmentSubmissionConfiguration : IEntityTypeConfiguration<AssignmentSubmission>
{
    public void Configure(EntityTypeBuilder<AssignmentSubmission> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Content)
            .HasMaxLength(5000);

        builder.Property(s => s.Status)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(s => s.SubmittedAt)
            .IsRequired();

        builder.Property(s => s.FeedbackFromTrainer)
            .HasMaxLength(2000);

        builder.Property(s => s.Score)
            .HasPrecision(5, 2);

        // Foreign key relationships
        builder.HasOne(s => s.Assignment)
            .WithMany(a => a.Submissions)
            .HasForeignKey(s => s.AssignmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.Member)
            .WithMany()
            .HasForeignKey(s => s.MemberId)
            .OnDelete(DeleteBehavior.Restrict);

        // One-to-many relationships
        builder.HasMany(s => s.Media)
            .WithOne(m => m.Submission)
            .HasForeignKey(m => m.SubmissionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(s => s.AssignmentId);
        builder.HasIndex(s => s.MemberId);
        builder.HasIndex(s => s.SubmittedAt);
        builder.HasIndex(s => s.Status);

        // Composite unique index to prevent duplicate submissions
        builder.HasIndex(s => new { s.AssignmentId, s.MemberId })
            .IsUnique();
    }
}

public class SubmissionMediaConfiguration : IEntityTypeConfiguration<SubmissionMedia>
{
    public void Configure(EntityTypeBuilder<SubmissionMedia> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.OriginalFileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.ContentType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.FilePath)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(m => m.ThumbnailPath)
            .HasMaxLength(500);

        builder.Property(m => m.Description)
            .HasMaxLength(500);

        builder.Property(m => m.MediaType)
            .IsRequired()
            .HasConversion<int>();

        // Indexes
        builder.HasIndex(m => m.SubmissionId);
        builder.HasIndex(m => m.MediaType);
    }
}