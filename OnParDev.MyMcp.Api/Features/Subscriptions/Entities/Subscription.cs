using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Features.Usage.Entities;

namespace OnParDev.MyMcp.Api.Features.Subscriptions.Entities;

public enum SubscriptionStatus
{
    Active = 0,
    Canceled = 1,
    PastDue = 2,
    Suspended = 3
}

public class Subscription
{
    public Guid Id { get; set; }
    public required Guid UserId { get; set; }
    public required Guid PlanId { get; set; }
    public required SubscriptionStatus Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime NextBillingDate { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Plan Plan { get; set; } = null!;
    public ICollection<UserUsage> UsageRecords { get; set; } = new List<UserUsage>();
    
    // Business logic methods
    public bool IsActive => Status == SubscriptionStatus.Active && 
                           StartDate <= DateTime.UtcNow && 
                           (EndDate == null || EndDate > DateTime.UtcNow);
    
    public bool CanMakeRequest(int currentMonthlyRequests) => 
        IsActive && Plan.GetPlanType().CanMakeRequest(currentMonthlyRequests);
    
    public bool CanCreateServer(int currentServerCount) => 
        IsActive && Plan.GetPlanType().CanCreateServer(currentServerCount);
}