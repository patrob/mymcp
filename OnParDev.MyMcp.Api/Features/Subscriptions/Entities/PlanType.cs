namespace OnParDev.MyMcp.Api.Features.Subscriptions.Entities;

public enum PlanTypeName
{
    Free = 0,
    Individual = 1,
    Team = 2
}

public enum BillingCycle
{
    Monthly = 1,
    Yearly = 12
}

public record PlanPricing(decimal Amount, BillingCycle Cycle)
{
    public decimal MonthlyEquivalent => Cycle == BillingCycle.Monthly ? Amount : Amount / 12;
    public decimal YearlyEquivalent => Cycle == BillingCycle.Yearly ? Amount : Amount * 12;
}

public abstract class PlanType
{
    public abstract string Name { get; }
    public abstract string Description { get; }
    public abstract List<PlanPricing> AvailablePricing { get; }
    public abstract int MonthlyRequestLimit { get; }
    public abstract bool AllowsCustomServers { get; }
    public abstract bool AllowsTeamManagement { get; }

    public abstract bool CanCreateServer(int currentServerCount);
    public abstract bool CanMakeRequest(int currentMonthlyRequests);

    public PlanPricing GetPricing(BillingCycle cycle) =>
        AvailablePricing.FirstOrDefault(p => p.Cycle == cycle) ??
        throw new InvalidOperationException($"Pricing for {cycle} cycle not available for {Name} plan");
}

public class FreePlanType : PlanType
{
    public override string Name => "Free";
    public override string Description => "Perfect for testing and small projects";
    public override List<PlanPricing> AvailablePricing =>
        [new PlanPricing(0m, BillingCycle.Monthly)];
    public override int MonthlyRequestLimit => 100;
    public override bool AllowsCustomServers => false;
    public override bool AllowsTeamManagement => false;

    public override bool CanCreateServer(int currentServerCount) => currentServerCount < 1;

    public override bool CanMakeRequest(int currentMonthlyRequests) =>
        currentMonthlyRequests < MonthlyRequestLimit;
}

public class IndividualPlanType : PlanType
{
    public override string Name => "Individual";
    public override string Description => "For individual developers building production applications";
    public override List<PlanPricing> AvailablePricing =>
    [
        new PlanPricing(10m, BillingCycle.Monthly),
        new PlanPricing(100m, BillingCycle.Yearly) // ~$8.33/month when billed yearly
    ];
    public override int MonthlyRequestLimit => 10000;
    public override bool AllowsCustomServers => true;
    public override bool AllowsTeamManagement => false;

    public override bool CanCreateServer(int currentServerCount) => currentServerCount < 10;

    public override bool CanMakeRequest(int currentMonthlyRequests) =>
        currentMonthlyRequests < MonthlyRequestLimit;
}

public class TeamPlanType : PlanType
{
    public override string Name => "Team";
    public override string Description => "For teams building enterprise applications";
    public override List<PlanPricing> AvailablePricing =>
    [
        new PlanPricing(100m, BillingCycle.Monthly),
        new PlanPricing(1000m, BillingCycle.Yearly) // ~$83.33/month when billed yearly
    ];
    public override int MonthlyRequestLimit => 100000;
    public override bool AllowsCustomServers => true;
    public override bool AllowsTeamManagement => true;

    public override bool CanCreateServer(int currentServerCount) => currentServerCount < 50;

    public override bool CanMakeRequest(int currentMonthlyRequests) =>
        currentMonthlyRequests < MonthlyRequestLimit;
}