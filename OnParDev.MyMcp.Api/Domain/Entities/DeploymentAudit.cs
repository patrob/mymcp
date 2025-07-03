namespace OnParDev.MyMcp.Api.Domain.Entities;

public class DeploymentAudit
{
    public Guid Id { get; set; }
    public required Guid ServerInstanceId { get; set; }
    public required string Action { get; set; }
    public required string Status { get; set; }
    public string? ErrorMessage { get; set; }
    public Dictionary<string, object>? Details { get; set; }
    public DateTime CreatedAt { get; set; }
    public TimeSpan? Duration { get; set; }

    public ServerInstance ServerInstance { get; set; } = null!;
}