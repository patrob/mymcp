using AutoFixture;
using FluentAssertions;
using OnParDev.MyMcp.Api.Features.Subscriptions.Entities;
using Xunit;

namespace OnParDev.MyMcp.Api.UnitTests.Features.Subscriptions;

public class SubscriptionTests
{
    private readonly Fixture _fixture = new();

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
        result.Should().BeTrue();
    }

    [Fact]
    public void IsActive_WithCanceledStatus_ShouldReturnFalse()
    {
        // Arrange
        var subscription = _fixture.Build<Subscription>()
            .With(s => s.Status, SubscriptionStatus.Canceled)
            .With(s => s.StartDate, DateTime.UtcNow.AddDays(-1))
            .With(s => s.EndDate, DateTime.UtcNow.AddDays(30))
            .Create();

        // Act
        var result = subscription.IsActive;

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void IsActive_WithFutureStartDate_ShouldReturnFalse()
    {
        // Arrange
        var subscription = _fixture.Build<Subscription>()
            .With(s => s.Status, SubscriptionStatus.Active)
            .With(s => s.StartDate, DateTime.UtcNow.AddDays(1))
            .With(s => s.EndDate, DateTime.UtcNow.AddDays(30))
            .Create();

        // Act
        var result = subscription.IsActive;

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void IsActive_WithPastEndDate_ShouldReturnFalse()
    {
        // Arrange
        var subscription = _fixture.Build<Subscription>()
            .With(s => s.Status, SubscriptionStatus.Active)
            .With(s => s.StartDate, DateTime.UtcNow.AddDays(-30))
            .With(s => s.EndDate, DateTime.UtcNow.AddDays(-1))
            .Create();

        // Act
        var result = subscription.IsActive;

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void IsActive_WithNullEndDate_ShouldReturnTrue()
    {
        // Arrange
        var subscription = _fixture.Build<Subscription>()
            .With(s => s.Status, SubscriptionStatus.Active)
            .With(s => s.StartDate, DateTime.UtcNow.AddDays(-1))
            .With(s => s.EndDate, (DateTime?)null)
            .Create();

        // Act
        var result = subscription.IsActive;

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void CanMakeRequest_WithActiveSubscriptionAndWithinLimit_ShouldReturnTrue()
    {
        // Arrange
        var plan = _fixture.Build<Plan>()
            .With(p => p.PlanTypeName, PlanTypeName.Free)
            .Without(p => p.Subscriptions)
            .Create();
        
        var subscription = _fixture.Build<Subscription>()
            .With(s => s.Status, SubscriptionStatus.Active)
            .With(s => s.StartDate, DateTime.UtcNow.AddDays(-1))
            .With(s => s.EndDate, DateTime.UtcNow.AddDays(30))
            .With(s => s.Plan, plan)
            .Without(s => s.User)
            .Without(s => s.UsageRecords)
            .Create();

        const int currentMonthlyRequests = 50;

        // Act
        var result = subscription.CanMakeRequest(currentMonthlyRequests);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void CanMakeRequest_WithInactiveSubscription_ShouldReturnFalse()
    {
        // Arrange
        var plan = _fixture.Build<Plan>()
            .With(p => p.PlanTypeName, PlanTypeName.Free)
            .Create();
        
        var subscription = _fixture.Build<Subscription>()
            .With(s => s.Status, SubscriptionStatus.Canceled)
            .With(s => s.Plan, plan)
            .Create();

        const int currentMonthlyRequests = 50;

        // Act
        var result = subscription.CanMakeRequest(currentMonthlyRequests);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void CanMakeRequest_WithExceededLimit_ShouldReturnFalse()
    {
        // Arrange
        var plan = _fixture.Build<Plan>()
            .With(p => p.PlanTypeName, PlanTypeName.Free)
            .Create();
        
        var subscription = _fixture.Build<Subscription>()
            .With(s => s.Status, SubscriptionStatus.Active)
            .With(s => s.StartDate, DateTime.UtcNow.AddDays(-1))
            .With(s => s.EndDate, DateTime.UtcNow.AddDays(30))
            .With(s => s.Plan, plan)
            .Create();

        const int currentMonthlyRequests = 150;

        // Act
        var result = subscription.CanMakeRequest(currentMonthlyRequests);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void CanCreateServer_WithActiveSubscriptionAndWithinLimit_ShouldReturnTrue()
    {
        // Arrange
        var plan = _fixture.Build<Plan>()
            .With(p => p.PlanTypeName, PlanTypeName.Individual)
            .Create();
        
        var subscription = _fixture.Build<Subscription>()
            .With(s => s.Status, SubscriptionStatus.Active)
            .With(s => s.StartDate, DateTime.UtcNow.AddDays(-1))
            .With(s => s.EndDate, DateTime.UtcNow.AddDays(30))
            .With(s => s.Plan, plan)
            .Create();

        const int currentServerCount = 5;

        // Act
        var result = subscription.CanCreateServer(currentServerCount);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void CanCreateServer_WithInactiveSubscription_ShouldReturnFalse()
    {
        // Arrange
        var plan = _fixture.Build<Plan>()
            .With(p => p.PlanTypeName, PlanTypeName.Individual)
            .Create();
        
        var subscription = _fixture.Build<Subscription>()
            .With(s => s.Status, SubscriptionStatus.Suspended)
            .With(s => s.Plan, plan)
            .Create();

        const int currentServerCount = 5;

        // Act
        var result = subscription.CanCreateServer(currentServerCount);

        // Assert
        result.Should().BeFalse();
    }
}