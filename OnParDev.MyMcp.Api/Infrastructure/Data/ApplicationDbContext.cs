using Microsoft.EntityFrameworkCore;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Features.Subscriptions.Entities;
using OnParDev.MyMcp.Api.Features.Usage.Entities;
using OnParDev.MyMcp.Api.Features.Configuration.Entities;
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
    
    // Subscription feature entities
    public DbSet<Plan> Plans { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    
    // Usage tracking entities
    public DbSet<UserUsage> UserUsages { get; set; }
    public DbSet<RequestLog> RequestLogs { get; set; }
    
    // Configuration entities
    public DbSet<ConfigurationSetting> ConfigurationSettings { get; set; }

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
            entity.Property(e => e.Role).HasConversion<string>();
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

        // Plan configuration
        modelBuilder.Entity<Plan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PlanTypeName).HasConversion<string>();
            entity.Property(e => e.BillingCycle).HasConversion<string>();
            entity.HasIndex(e => new { e.PlanTypeName, e.BillingCycle }).IsUnique();
        });

        // Subscription configuration
        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.StripeSubscriptionId).HasMaxLength(256);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.StripeSubscriptionId).IsUnique();

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Plan)
                  .WithMany(p => p.Subscriptions)
                  .HasForeignKey(e => e.PlanId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // UserUsage configuration
        modelBuilder.Entity<UserUsage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.Year, e.Month }).IsUnique();
            entity.HasIndex(e => e.SubscriptionId);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Subscription)
                  .WithMany(s => s.UsageRecords)
                  .HasForeignKey(e => e.SubscriptionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // RequestLog configuration
        modelBuilder.Entity<RequestLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Endpoint).HasMaxLength(512);
            entity.Property(e => e.Method).HasMaxLength(16);
            entity.HasIndex(e => new { e.UserId, e.RequestTimestamp });
            entity.HasIndex(e => e.UserUsageId);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.UserUsage)
                  .WithMany(u => u.RequestLogs)
                  .HasForeignKey(e => e.UserUsageId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ServerInstance)
                  .WithMany()
                  .HasForeignKey(e => e.ServerInstanceId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ConfigurationSetting configuration
        modelBuilder.Entity<ConfigurationSetting>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Key).HasMaxLength(128);
            entity.Property(e => e.Value).HasMaxLength(1024);
            entity.Property(e => e.Description).HasMaxLength(512);
            entity.Property(e => e.Type).HasConversion<string>();
            entity.HasIndex(e => e.Key).IsUnique();
        });
    }
}