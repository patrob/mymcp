using AutoFixture;
using Shouldly;
using OnParDev.MyMcp.Api.Features.Subscriptions.Entities;
using Xunit;

namespace OnParDev.MyMcp.Api.UnitTests.Features.Subscriptions;

public class SubscriptionTests
{
    private readonly Fixture _fixture = new();

    public SubscriptionTests()
    {
        _fixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList()
            .ForEach(b => _fixture.Behaviors.Remove(b));
        _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    private Plan CreateTestPlan(PlanTypeName planTypeName)
    {
        return _fixture.Build<Plan>()
            .With(p => p.PlanTypeName, planTypeName)
            .Without(p => p.Subscriptions)
            .Create();
    }

    private Subscription CreateTestSubscription(SubscriptionStatus status, DateTime startDate, DateTime? endDate, Plan plan)
    {
        return _fixture.Build<Subscription>()
            .With(s => s.Status, status)
            .With(s => s.StartDate, startDate)
            .With(s => s.EndDate, endDate)
            .With(s => s.Plan, plan)
            .Without(s => s.User)
            .Without(s => s.UsageRecords)
            .Create();
    }

    [Fact]
    public void IsActive_WithActiveStatusAndCurrentDate_ShouldReturnTrue()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);
        var subscription = CreateTestSubscription(
            SubscriptionStatus.Active,
            DateTime.UtcNow.AddDays(-1),
            DateTime.UtcNow.AddDays(30),
            plan);

        // Act
        var result = subscription.IsActive;

        // Assert
        result.ShouldBeTrue();
    }

    [Fact]
    public void IsActive_WithCanceledStatus_ShouldReturnFalse()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);
        var subscription = CreateTestSubscription(
            SubscriptionStatus.Canceled,
            DateTime.UtcNow.AddDays(-1),
            DateTime.UtcNow.AddDays(30),
            plan);

        // Act
        var result = subscription.IsActive;

        // Assert
        result.ShouldBeFalse();
    }

    [Fact]
    public void IsActive_WithFutureStartDate_ShouldReturnFalse()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);
        var subscription = CreateTestSubscription(
            SubscriptionStatus.Active,
            DateTime.UtcNow.AddDays(1),
            DateTime.UtcNow.AddDays(30),
            plan);

        // Act
        var result = subscription.IsActive;

        // Assert
        result.ShouldBeFalse();
    }

    [Fact]
    public void IsActive_WithPastEndDate_ShouldReturnFalse()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);
        var subscription = CreateTestSubscription(
            SubscriptionStatus.Active,
            DateTime.UtcNow.AddDays(-30),
            DateTime.UtcNow.AddDays(-1),
            plan);

        // Act
        var result = subscription.IsActive;

        // Assert
        result.ShouldBeFalse();
    }

    [Fact]
    public void IsActive_WithNullEndDate_ShouldReturnTrue()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);
        var subscription = CreateTestSubscription(
            SubscriptionStatus.Active,
            DateTime.UtcNow.AddDays(-1),
            null,
            plan);

        // Act
        var result = subscription.IsActive;

        // Assert
        result.ShouldBeTrue();
    }

    [Fact]
    public void CanMakeRequest_WithActiveSubscriptionAndWithinLimit_ShouldReturnTrue()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);
        var subscription = CreateTestSubscription(
            SubscriptionStatus.Active,
            DateTime.UtcNow.AddDays(-1),
            DateTime.UtcNow.AddDays(30),
            plan);

        const int currentMonthlyRequests = 50;

        // Act
        var result = subscription.CanMakeRequest(currentMonthlyRequests);

        // Assert
        result.ShouldBeTrue();
    }

    [Fact]
    public void CanMakeRequest_WithInactiveSubscription_ShouldReturnFalse()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);
        var subscription = CreateTestSubscription(
            SubscriptionStatus.Canceled,
            DateTime.UtcNow.AddDays(-1),
            DateTime.UtcNow.AddDays(30),
            plan);

        const int currentMonthlyRequests = 50;

        // Act
        var result = subscription.CanMakeRequest(currentMonthlyRequests);

        // Assert
        result.ShouldBeFalse();
    }

    [Fact]
    public void CanMakeRequest_WithExceededLimit_ShouldReturnFalse()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);
        var subscription = CreateTestSubscription(
            SubscriptionStatus.Active,
            DateTime.UtcNow.AddDays(-1),
            DateTime.UtcNow.AddDays(30),
            plan);

        const int currentMonthlyRequests = 150;

        // Act
        var result = subscription.CanMakeRequest(currentMonthlyRequests);

        // Assert
        result.ShouldBeFalse();
    }

    [Fact]
    public void CanCreateServer_WithActiveSubscriptionAndWithinLimit_ShouldReturnTrue()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Individual);
        var subscription = CreateTestSubscription(
            SubscriptionStatus.Active,
            DateTime.UtcNow.AddDays(-1),
            DateTime.UtcNow.AddDays(30),
            plan);

        const int currentServerCount = 5;

        // Act
        var result = subscription.CanCreateServer(currentServerCount);

        // Assert
        result.ShouldBeTrue();
    }

    [Fact]
    public void CanCreateServer_WithInactiveSubscription_ShouldReturnFalse()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Individual);
        var subscription = CreateTestSubscription(
            SubscriptionStatus.Suspended,
            DateTime.UtcNow.AddDays(-1),
            DateTime.UtcNow.AddDays(30),
            plan);

        const int currentServerCount = 5;

        // Act
        var result = subscription.CanCreateServer(currentServerCount);

        // Assert
        result.ShouldBeFalse();
    }
}