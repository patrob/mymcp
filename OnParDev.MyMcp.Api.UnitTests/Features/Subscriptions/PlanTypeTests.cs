using AutoFixture;
using Shouldly;
using OnParDev.MyMcp.Api.Features.Subscriptions.Entities;
using Xunit;

namespace OnParDev.MyMcp.Api.UnitTests.Features.Subscriptions;

public class FreePlanTypeTests
{
        private readonly FreePlanType _sut = new();

        [Fact]
        public void Name_ShouldReturnFree()
        {
                // Arrange & Act
                var result = _sut.Name;

                // Assert
                result.ShouldBe("Free");
        }

        [Fact]
        public void Description_ShouldReturnExpectedValue()
        {
                // Arrange & Act
                var result = _sut.Description;

                // Assert
                result.ShouldBe("Perfect for testing and small projects");
        }

        [Fact]
        public void MonthlyRequestLimit_ShouldReturn100()
        {
                // Arrange & Act
                var result = _sut.MonthlyRequestLimit;

                // Assert
                result.ShouldBe(100);
        }

        [Fact]
        public void AllowsCustomServers_ShouldReturnFalse()
        {
                // Arrange & Act
                var result = _sut.AllowsCustomServers;

                // Assert
                result.ShouldBeFalse();
        }

        [Fact]
        public void AllowsTeamManagement_ShouldReturnFalse()
        {
                // Arrange & Act
                var result = _sut.AllowsTeamManagement;

                // Assert
                result.ShouldBeFalse();
        }

        [Fact]
        public void CanCreateServer_WithZeroServers_ShouldReturnTrue()
        {
                // Arrange
                const int currentServerCount = 0;

                // Act
                var result = _sut.CanCreateServer(currentServerCount);

                // Assert
                result.ShouldBeTrue();
        }

        [Fact]
        public void CanCreateServer_WithOneServer_ShouldReturnFalse()
        {
                // Arrange
                const int currentServerCount = 1;

                // Act
                var result = _sut.CanCreateServer(currentServerCount);

                // Assert
                result.ShouldBeFalse();
        }

        [Fact]
        public void CanMakeRequest_WithinLimit_ShouldReturnTrue()
        {
                // Arrange
                const int currentMonthlyRequests = 50;

                // Act
                var result = _sut.CanMakeRequest(currentMonthlyRequests);

                // Assert
                result.ShouldBeTrue();
        }

        [Fact]
        public void CanMakeRequest_AtLimit_ShouldReturnFalse()
        {
                // Arrange
                const int currentMonthlyRequests = 100;

                // Act
                var result = _sut.CanMakeRequest(currentMonthlyRequests);

                // Assert
                result.ShouldBeFalse();
        }

        [Fact]
        public void GetPricing_WithMonthlyBilling_ShouldReturnZero()
        {
                // Arrange & Act
                var result = _sut.GetPricing(BillingCycle.Monthly);

                // Assert
                result.Amount.ShouldBe(0m);
        }

        [Fact]
        public void GetPricing_WithYearlyBilling_ShouldThrowException()
        {
                // Arrange & Act & Assert
                Should.Throw<InvalidOperationException>(() => _sut.GetPricing(BillingCycle.Yearly))
                    .Message.ShouldBe("Pricing for Yearly cycle not available for Free plan");
        }
}

public class IndividualPlanTypeTests
{
        private readonly IndividualPlanType _sut = new();

        [Fact]
        public void Name_ShouldReturnIndividual()
        {
                // Arrange & Act
                var result = _sut.Name;

                // Assert
                result.ShouldBe("Individual");
        }

        [Fact]
        public void MonthlyRequestLimit_ShouldReturn10000()
        {
                // Arrange & Act
                var result = _sut.MonthlyRequestLimit;

                // Assert
                result.ShouldBe(10000);
        }

        [Fact]
        public void AllowsCustomServers_ShouldReturnTrue()
        {
                // Arrange & Act
                var result = _sut.AllowsCustomServers;

                // Assert
                result.ShouldBeTrue();
        }

        [Fact]
        public void AllowsTeamManagement_ShouldReturnFalse()
        {
                // Arrange & Act
                var result = _sut.AllowsTeamManagement;

                // Assert
                result.ShouldBeFalse();
        }

        [Fact]
        public void CanCreateServer_WithNineServers_ShouldReturnTrue()
        {
                // Arrange
                const int currentServerCount = 9;

                // Act
                var result = _sut.CanCreateServer(currentServerCount);

                // Assert
                result.ShouldBeTrue();
        }

        [Fact]
        public void CanCreateServer_WithTenServers_ShouldReturnFalse()
        {
                // Arrange
                const int currentServerCount = 10;

                // Act
                var result = _sut.CanCreateServer(currentServerCount);

                // Assert
                result.ShouldBeFalse();
        }

        [Fact]
        public void GetPricing_WithMonthlyBilling_ShouldReturn10()
        {
                // Arrange & Act
                var result = _sut.GetPricing(BillingCycle.Monthly);

                // Assert
                result.Amount.ShouldBe(10m);
        }

        [Fact]
        public void GetPricing_WithYearlyBilling_ShouldReturn100()
        {
                // Arrange & Act
                var result = _sut.GetPricing(BillingCycle.Yearly);

                // Assert
                result.Amount.ShouldBe(100m);
        }
}

public class TeamPlanTypeTests
{
        private readonly TeamPlanType _sut = new();

        [Fact]
        public void Name_ShouldReturnTeam()
        {
                // Arrange & Act
                var result = _sut.Name;

                // Assert
                result.ShouldBe("Team");
        }

        [Fact]
        public void MonthlyRequestLimit_ShouldReturn100000()
        {
                // Arrange & Act
                var result = _sut.MonthlyRequestLimit;

                // Assert
                result.ShouldBe(100000);
        }

        [Fact]
        public void AllowsCustomServers_ShouldReturnTrue()
        {
                // Arrange & Act
                var result = _sut.AllowsCustomServers;

                // Assert
                result.ShouldBeTrue();
        }

        [Fact]
        public void AllowsTeamManagement_ShouldReturnTrue()
        {
                // Arrange & Act
                var result = _sut.AllowsTeamManagement;

                // Assert
                result.ShouldBeTrue();
        }

        [Fact]
        public void CanCreateServer_WithFortyNineServers_ShouldReturnTrue()
        {
                // Arrange
                const int currentServerCount = 49;

                // Act
                var result = _sut.CanCreateServer(currentServerCount);

                // Assert
                result.ShouldBeTrue();
        }

        [Fact]
        public void CanCreateServer_WithFiftyServers_ShouldReturnFalse()
        {
                // Arrange
                const int currentServerCount = 50;

                // Act
                var result = _sut.CanCreateServer(currentServerCount);

                // Assert
                result.ShouldBeFalse();
        }
}

public class PlanPricingTests
{
        private readonly Fixture _fixture = new();

        [Fact]
        public void MonthlyEquivalent_WithMonthlyBilling_ShouldReturnSameAmount()
        {
                // Arrange
                var amount = _fixture.Create<decimal>();
                var pricing = new PlanPricing(amount, BillingCycle.Monthly);

                // Act
                var result = pricing.MonthlyEquivalent;

                // Assert
                result.ShouldBe(amount);
        }

        [Fact]
        public void MonthlyEquivalent_WithYearlyBilling_ShouldReturnDividedBy12()
        {
                // Arrange
                const decimal amount = 120m;
                var pricing = new PlanPricing(amount, BillingCycle.Yearly);

                // Act
                var result = pricing.MonthlyEquivalent;

                // Assert
                result.ShouldBe(10m);
        }

        [Fact]
        public void YearlyEquivalent_WithYearlyBilling_ShouldReturnSameAmount()
        {
                // Arrange
                var amount = _fixture.Create<decimal>();
                var pricing = new PlanPricing(amount, BillingCycle.Yearly);

                // Act
                var result = pricing.YearlyEquivalent;

                // Assert
                result.ShouldBe(amount);
        }

        [Fact]
        public void YearlyEquivalent_WithMonthlyBilling_ShouldReturnMultipliedBy12()
        {
                // Arrange
                const decimal amount = 10m;
                var pricing = new PlanPricing(amount, BillingCycle.Monthly);

                // Act
                var result = pricing.YearlyEquivalent;

                // Assert
                result.ShouldBe(120m);
        }
}