using Microsoft.EntityFrameworkCore;
using OnParDev.MyMcp.Api.Domain.Entities;
using System.Text.Json;

namespace OnParDev.MyMcp.Api.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<ServerInstance> ServerInstances { get; set; }
    public DbSet<ContainerSpec> ContainerSpecs { get; set; }
    public DbSet<McpServerTemplate> McpServerTemplates { get; set; }
    public DbSet<ServerLog> ServerLogs { get; set; }
    public DbSet<DeploymentAudit> DeploymentAudits { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ClerkUserId).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.ClerkUserId).HasMaxLength(256);
            entity.Property(e => e.FirstName).HasMaxLength(128);
            entity.Property(e => e.LastName).HasMaxLength(128);
        });

        // ServerInstance configuration
        modelBuilder.Entity<ServerInstance>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(128);
            entity.Property(e => e.Description).HasMaxLength(512);
            entity.Property(e => e.ContainerInstanceId).HasMaxLength(256);
            entity.Property(e => e.Status).HasConversion<string>();

            entity.HasOne(e => e.User)
                  .WithMany(u => u.ServerInstances)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.McpServerTemplate)
                  .WithMany(t => t.ServerInstances)
                  .HasForeignKey(e => e.McpServerTemplateId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.ContainerSpec)
                  .WithMany(c => c.ServerInstances)
                  .HasForeignKey(e => e.ContainerSpecId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ContainerSpec configuration
        modelBuilder.Entity<ContainerSpec>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(128);
            entity.Property(e => e.Description).HasMaxLength(512);
            entity.Property(e => e.ImageName).HasMaxLength(256);
            entity.Property(e => e.ImageTag).HasMaxLength(64);

            // JSON serialization for complex types
            entity.Property(e => e.EnvironmentVariables)
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                      v => JsonSerializer.Deserialize<Dictionary<string, string>>(v, (JsonSerializerOptions?)null) ?? new());

            entity.Property(e => e.Ports)
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                      v => JsonSerializer.Deserialize<List<ContainerPort>>(v, (JsonSerializerOptions?)null) ?? new());

            entity.Property(e => e.Volumes)
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                      v => JsonSerializer.Deserialize<List<ContainerVolume>>(v, (JsonSerializerOptions?)null) ?? new());
        });

        // McpServerTemplate configuration
        modelBuilder.Entity<McpServerTemplate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(128);
            entity.Property(e => e.Description).HasMaxLength(512);
            entity.Property(e => e.Version).HasMaxLength(32);
            entity.Property(e => e.Category).HasMaxLength(64);
            entity.Property(e => e.DocumentationUrl).HasMaxLength(512);
            entity.Property(e => e.RepositoryUrl).HasMaxLength(512);

            entity.Property(e => e.Capabilities)
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                      v => JsonSerializer.Deserialize<List<McpServerCapability>>(v, (JsonSerializerOptions?)null) ?? new());

            entity.Property(e => e.DefaultConfiguration)
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                      v => JsonSerializer.Deserialize<Dictionary<string, object>>(v, (JsonSerializerOptions?)null) ?? new());
        });

        // ServerLog configuration
        modelBuilder.Entity<ServerLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Level).HasMaxLength(32);
            entity.Property(e => e.Source).HasMaxLength(128);
            entity.HasIndex(e => new { e.ServerInstanceId, e.Timestamp });

            entity.Property(e => e.Metadata)
                  .HasConversion(
                      v => v == null ? null : JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                      v => v == null ? null : JsonSerializer.Deserialize<Dictionary<string, object>>(v, (JsonSerializerOptions?)null));

            entity.HasOne(e => e.ServerInstance)
                  .WithMany(s => s.ServerLogs)
                  .HasForeignKey(e => e.ServerInstanceId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // DeploymentAudit configuration
        modelBuilder.Entity<DeploymentAudit>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Action).HasMaxLength(64);
            entity.Property(e => e.Status).HasMaxLength(32);
            entity.Property(e => e.ErrorMessage).HasMaxLength(1024);
            entity.HasIndex(e => new { e.ServerInstanceId, e.CreatedAt });

            entity.Property(e => e.Details)
                  .HasConversion(
                      v => v == null ? null : JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                      v => v == null ? null : JsonSerializer.Deserialize<Dictionary<string, object>>(v, (JsonSerializerOptions?)null));

            entity.HasOne(e => e.ServerInstance)
                  .WithMany(s => s.DeploymentAudits)
                  .HasForeignKey(e => e.ServerInstanceId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}