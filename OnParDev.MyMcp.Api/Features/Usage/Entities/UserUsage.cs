using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Features.Subscriptions.Entities;

namespace OnParDev.MyMcp.Api.Features.Usage.Entities;

public class UserUsage
{
    public Guid Id { get; set; }
    public required Guid UserId { get; set; }
    public required Guid SubscriptionId { get; set; }
    public required int Year { get; set; }
    public required int Month { get; set; }
    public int RequestCount { get; set; } = 0;
    public DateTime LastUpdated { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Subscription Subscription { get; set; } = null!;
    public ICollection<RequestLog> RequestLogs { get; set; } = new List<RequestLog>();
    
    // Business logic
    public bool HasExceededLimit(int monthlyLimit) => RequestCount >= monthlyLimit;
    
    public void IncrementRequestCount()
    {
        RequestCount++;
        LastUpdated = DateTime.UtcNow;
    }
}