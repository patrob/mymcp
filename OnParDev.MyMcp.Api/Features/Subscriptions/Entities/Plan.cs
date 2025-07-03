using OnParDev.MyMcp.Api.Domain.Entities;

namespace OnParDev.MyMcp.Api.Features.Subscriptions.Entities;

public class Plan
{
    public Guid Id { get; set; }
    public required PlanTypeName PlanTypeName { get; set; }
    public required BillingCycle BillingCycle { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

    // Factory method to get the plan type instance
    public PlanType GetPlanType() => PlanTypeName switch
    {
        PlanTypeName.Free => new FreePlanType(),
        PlanTypeName.Individual => new IndividualPlanType(),
        PlanTypeName.Team => new TeamPlanType(),
        _ => throw new InvalidOperationException($"Unknown plan type: {PlanTypeName}")
    };

    // Convenience properties that delegate to PlanType
    public string Name => GetPlanType().Name;
    public string Description => GetPlanType().Description;
    public decimal Price => GetPlanType().GetPricing(BillingCycle).Amount;
    public int MonthlyRequestLimit => GetPlanType().MonthlyRequestLimit;
    public bool AllowsCustomServers => GetPlanType().AllowsCustomServers;
    public bool AllowsTeamManagement => GetPlanType().AllowsTeamManagement;
}