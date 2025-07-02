using AutoFixture;
using FluentAssertions;
using OnParDev.MyMcp.Api.Features.Subscriptions.Entities;
using Xunit;

namespace OnParDev.MyMcp.Api.UnitTests.Features.Subscriptions;

public class PlanTests
{
    private readonly Fixture _fixture = new();

    public PlanTests()
    {
        _fixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList()
            .ForEach(b => _fixture.Behaviors.Remove(b));
        _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    private Plan CreateTestPlan(PlanTypeName planTypeName, BillingCycle billingCycle = BillingCycle.Monthly)
    {
        return _fixture.Build<Plan>()
            .With(p => p.PlanTypeName, planTypeName)
            .With(p => p.BillingCycle, billingCycle)
            .Without(p => p.Subscriptions)
            .Create();
    }

    [Fact]
    public void GetPlanType_WithFreePlanType_ShouldReturnFreePlanTypeInstance()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);

        // Act
        var result = plan.GetPlanType();

        // Assert
        result.Should().BeOfType<FreePlanType>();
    }

    [Fact]
    public void GetPlanType_WithIndividualPlanType_ShouldReturnIndividualPlanTypeInstance()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Individual);

        // Act
        var result = plan.GetPlanType();

        // Assert
        result.Should().BeOfType<IndividualPlanType>();
    }

    [Fact]
    public void GetPlanType_WithTeamPlanType_ShouldReturnTeamPlanTypeInstance()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Team);

        // Act
        var result = plan.GetPlanType();

        // Assert
        result.Should().BeOfType<TeamPlanType>();
    }

    [Fact]
    public void Name_WithFreePlan_ShouldReturnFree()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);

        // Act
        var result = plan.Name;

        // Assert
        result.Should().Be("Free");
    }

    [Fact]
    public void Description_WithIndividualPlan_ShouldReturnExpectedDescription()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Individual);

        // Act
        var result = plan.Description;

        // Assert
        result.Should().Be("For individual developers building production applications");
    }

    [Fact]
    public void Price_WithFreePlanAndMonthlyBilling_ShouldReturnZero()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free, BillingCycle.Monthly);

        // Act
        var result = plan.Price;

        // Assert
        result.Should().Be(0m);
    }

    [Fact]
    public void Price_WithIndividualPlanAndYearlyBilling_ShouldReturn100()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Individual, BillingCycle.Yearly);

        // Act
        var result = plan.Price;

        // Assert
        result.Should().Be(100m);
    }

    [Fact]
    public void MonthlyRequestLimit_WithTeamPlan_ShouldReturn100000()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Team);

        // Act
        var result = plan.MonthlyRequestLimit;

        // Assert
        result.Should().Be(100000);
    }

    [Fact]
    public void AllowsCustomServers_WithFreePlan_ShouldReturnFalse()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Free);

        // Act
        var result = plan.AllowsCustomServers;

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void AllowsTeamManagement_WithTeamPlan_ShouldReturnTrue()
    {
        // Arrange
        var plan = CreateTestPlan(PlanTypeName.Team);

        // Act
        var result = plan.AllowsTeamManagement;

        // Assert
        result.Should().BeTrue();
    }
}