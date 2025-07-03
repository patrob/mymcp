namespace OnParDev.MyMcp.Api.Domain.Entities;

public class ServerLog
{
    public Guid Id { get; set; }
    public required Guid ServerInstanceId { get; set; }
    public required string Level { get; set; }
    public required string Message { get; set; }
    public string? Source { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
    public DateTime Timestamp { get; set; }

    public ServerInstance ServerInstance { get; set; } = null!;
}