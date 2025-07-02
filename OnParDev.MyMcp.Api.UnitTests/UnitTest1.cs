using AutoFixture;
using AutoFixture.Xunit2;
using Shouldly;
using Microsoft.EntityFrameworkCore;
using NSubstitute;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Features.Auth;
using OnParDev.MyMcp.Api.Infrastructure.Data;

namespace OnParDev.MyMcp.Api.UnitTests;

public class AuthServiceTests
{
    private readonly IFixture _fixture;

    public AuthServiceTests()
    {
        _fixture = new Fixture();
        _fixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList()
            .ForEach(b => _fixture.Behaviors.Remove(b));
        _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    [Theory, AutoData]
    public async Task GetUserByIdAsync_WhenUserExists_ReturnsUser(Guid userId)
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var user = _fixture.Build<User>()
            .With(u => u.Id, userId)
            .Create();

        await using var context = new ApplicationDbContext(options);
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var authService = new AuthService(context);

        // Act
        var result = await authService.GetUserByIdAsync(userId);

        // Assert
        result.ShouldNotBeNull();
        result!.Id.ShouldBe(userId);
        result.Email.ShouldBe(user.Email);
    }

    [Theory, AutoData]
    public async Task GetUserByIdAsync_WhenUserDoesNotExist_ReturnsNull(Guid userId)
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        await using var context = new ApplicationDbContext(options);
        var authService = new AuthService(context);

        // Act
        var result = await authService.GetUserByIdAsync(userId);

        // Assert
        result.ShouldBeNull();
    }
}
