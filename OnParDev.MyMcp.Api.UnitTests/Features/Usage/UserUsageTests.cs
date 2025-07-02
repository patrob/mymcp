using AutoFixture;
using Shouldly;
using OnParDev.MyMcp.Api.Features.Usage.Entities;
using Xunit;

namespace OnParDev.MyMcp.Api.UnitTests.Features.Usage;

public class UserUsageTests
{
        private readonly Fixture _fixture = new();

        public UserUsageTests()
        {
                _fixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList()
                    .ForEach(b => _fixture.Behaviors.Remove(b));
                _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        private UserUsage CreateTestUserUsage(int requestCount = 0, DateTime? lastUpdated = null)
        {
                return _fixture.Build<UserUsage>()
                    .With(u => u.RequestCount, requestCount)
                    .With(u => u.LastUpdated, lastUpdated ?? DateTime.UtcNow.AddDays(-1))
                    .Without(u => u.User)
                    .Without(u => u.Subscription)
                    .Create();
        }

        [Fact]
        public void HasExceededLimit_WithRequestCountBelowLimit_ShouldReturnFalse()
        {
                // Arrange
                var userUsage = CreateTestUserUsage(requestCount: 50);
                const int monthlyLimit = 100;

                // Act
                var result = userUsage.HasExceededLimit(monthlyLimit);

                // Assert
                result.ShouldBeFalse();
        }

        [Fact]
        public void HasExceededLimit_WithRequestCountAtLimit_ShouldReturnTrue()
        {
                // Arrange
                var userUsage = CreateTestUserUsage(requestCount: 100);
                const int monthlyLimit = 100;

                // Act
                var result = userUsage.HasExceededLimit(monthlyLimit);

                // Assert
                result.ShouldBeTrue();
        }

        [Fact]
        public void HasExceededLimit_WithRequestCountAboveLimit_ShouldReturnTrue()
        {
                // Arrange
                var userUsage = CreateTestUserUsage(requestCount: 150);
                const int monthlyLimit = 100;

                // Act
                var result = userUsage.HasExceededLimit(monthlyLimit);

                // Assert
                result.ShouldBeTrue();
        }

        [Fact]
        public void IncrementRequestCount_ShouldIncreaseRequestCountByOne()
        {
                // Arrange
                var userUsage = CreateTestUserUsage(requestCount: 25);

                // Act
                userUsage.IncrementRequestCount();

                // Assert
                userUsage.RequestCount.ShouldBe(26);
        }

        [Fact]
        public void IncrementRequestCount_ShouldUpdateLastUpdatedTimestamp()
        {
                // Arrange
                var initialTimestamp = DateTime.UtcNow.AddHours(-1);
                var userUsage = CreateTestUserUsage(lastUpdated: initialTimestamp);

                // Act
                userUsage.IncrementRequestCount();

                // Assert
                userUsage.LastUpdated.ShouldBeGreaterThan(initialTimestamp);
        }

        [Fact]
        public void IncrementRequestCount_CalledMultipleTimes_ShouldIncrementCorrectly()
        {
                // Arrange
                var userUsage = CreateTestUserUsage(requestCount: 0);

                // Act
                userUsage.IncrementRequestCount();
                userUsage.IncrementRequestCount();
                userUsage.IncrementRequestCount();

                // Assert
                userUsage.RequestCount.ShouldBe(3);
        }
}