using OnParDev.MyMcp.Api.Domain.Entities;

namespace OnParDev.MyMcp.Api.Features.Usage.Entities;

public class RequestLog
{
    public Guid Id { get; set; }
    public required Guid UserId { get; set; }
    public required Guid UserUsageId { get; set; }
    public required Guid ServerInstanceId { get; set; }
    public required string Endpoint { get; set; }
    public required string Method { get; set; }
    public int ResponseCode { get; set; }
    public long ResponseTimeMs { get; set; }
    public DateTime RequestTimestamp { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public UserUsage UserUsage { get; set; } = null!;
    public ServerInstance ServerInstance { get; set; } = null!;
}