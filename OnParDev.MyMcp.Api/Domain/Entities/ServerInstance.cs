namespace OnParDev.MyMcp.Api.Domain.Entities;

public class ServerInstance
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required Guid UserId { get; set; }
    public required Guid McpServerTemplateId { get; set; }
    public required Guid ContainerSpecId { get; set; }
    public ServerStatus Status { get; set; } = ServerStatus.Stopped;
    public string? ContainerInstanceId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? LastStartedAt { get; set; }
    public DateTime? LastStoppedAt { get; set; }

    public User User { get; set; } = null!;
    public McpServerTemplate McpServerTemplate { get; set; } = null!;
    public ContainerSpec ContainerSpec { get; set; } = null!;
    public ICollection<ServerLog> ServerLogs { get; set; } = new List<ServerLog>();
    public ICollection<DeploymentAudit> DeploymentAudits { get; set; } = new List<DeploymentAudit>();
}

public enum ServerStatus
{
    Stopped,
    Starting,
    Running,
    Stopping,
    Failed,
    Unknown
}