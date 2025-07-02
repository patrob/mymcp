using AutoFixture;
using FluentAssertions;
using OnParDev.MyMcp.Api.Features.Usage.Entities;
using Xunit;

namespace OnParDev.MyMcp.Api.UnitTests.Features.Usage;

public class UserUsageTests
{
    private readonly Fixture _fixture = new();

    [Fact]
    public void HasExceededLimit_WithRequestCountBelowLimit_ShouldReturnFalse()
    {
        // Arrange
        var userUsage = _fixture.Build<UserUsage>()
            .With(u => u.RequestCount, 50)
            .Create();

        const int monthlyLimit = 100;

        // Act
        var result = userUsage.HasExceededLimit(monthlyLimit);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void HasExceededLimit_WithRequestCountAtLimit_ShouldReturnTrue()
    {
        // Arrange
        var userUsage = _fixture.Build<UserUsage>()
            .With(u => u.RequestCount, 100)
            .Create();

        const int monthlyLimit = 100;

        // Act
        var result = userUsage.HasExceededLimit(monthlyLimit);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void HasExceededLimit_WithRequestCountAboveLimit_ShouldReturnTrue()
    {
        // Arrange
        var userUsage = _fixture.Build<UserUsage>()
            .With(u => u.RequestCount, 150)
            .Create();

        const int monthlyLimit = 100;

        // Act
        var result = userUsage.HasExceededLimit(monthlyLimit);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void IncrementRequestCount_ShouldIncreaseRequestCountByOne()
    {
        // Arrange
        var userUsage = _fixture.Build<UserUsage>()
            .With(u => u.RequestCount, 25)
            .Create();

        // Act
        userUsage.IncrementRequestCount();

        // Assert
        userUsage.RequestCount.Should().Be(26);
    }

    [Fact]
    public void IncrementRequestCount_ShouldUpdateLastUpdatedTimestamp()
    {
        // Arrange
        var initialTimestamp = DateTime.UtcNow.AddHours(-1);
        var userUsage = _fixture.Build<UserUsage>()
            .With(u => u.LastUpdated, initialTimestamp)
            .Create();

        // Act
        userUsage.IncrementRequestCount();

        // Assert
        userUsage.LastUpdated.Should().BeAfter(initialTimestamp);
    }

    [Fact]
    public void IncrementRequestCount_CalledMultipleTimes_ShouldIncrementCorrectly()
    {
        // Arrange
        var userUsage = _fixture.Build<UserUsage>()
            .With(u => u.RequestCount, 0)
            .Create();

        // Act
        userUsage.IncrementRequestCount();
        userUsage.IncrementRequestCount();
        userUsage.IncrementRequestCount();

        // Assert
        userUsage.RequestCount.Should().Be(3);
    }
}