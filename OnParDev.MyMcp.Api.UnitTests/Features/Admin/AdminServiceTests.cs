using AutoFixture;
using Shouldly;
using Microsoft.EntityFrameworkCore;
using NSubstitute;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Features.Admin;
using OnParDev.MyMcp.Api.Infrastructure.Data;
using Xunit;

namespace OnParDev.MyMcp.Api.UnitTests.Features.Admin;

public class AdminServiceTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly AdminService _sut;
    private readonly Fixture _fixture = new();

    public AdminServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new ApplicationDbContext(options);
        _sut = new AdminService(_context);
    }

    [Fact]
    public async Task IsUserAdminAsync_WithAdminUser_ShouldReturnTrue()
    {
        // Arrange
        var user = _fixture.Build<User>()
            .With(u => u.Role, UserRole.Admin)
            .Without(u => u.ServerInstances)
            .Create();
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.IsUserAdminAsync(user.ClerkUserId);

        // Assert
        result.ShouldBeTrue();
    }

    [Fact]
    public async Task IsUserAdminAsync_WithRegularUser_ShouldReturnFalse()
    {
        // Arrange
        var user = _fixture.Build<User>()
            .With(u => u.Role, UserRole.User)
            .Without(u => u.ServerInstances)
            .Create();
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.IsUserAdminAsync(user.ClerkUserId);

        // Assert
        result.ShouldBeFalse();
    }

    [Fact]
    public async Task IsUserAdminAsync_WithNonExistentUser_ShouldReturnFalse()
    {
        // Arrange
        var nonExistentClerkUserId = _fixture.Create<string>();

        // Act
        var result = await _sut.IsUserAdminAsync(nonExistentClerkUserId);

        // Assert
        result.ShouldBeFalse();
    }

    [Fact]
    public async Task GetAllUsersAsync_ShouldReturnUsersOrderedByCreatedAt()
    {
        // Arrange
        var user1 = _fixture.Build<User>()
            .With(u => u.CreatedAt, DateTime.UtcNow.AddDays(-2))
            .Without(u => u.ServerInstances)
            .Create();
        var user2 = _fixture.Build<User>()
            .With(u => u.CreatedAt, DateTime.UtcNow.AddDays(-1))
            .Without(u => u.ServerInstances)
            .Create();
        
        _context.Users.AddRange(user2, user1); // Add in reverse order
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetAllUsersAsync();

        // Assert
        result.Count.ShouldBe(2);
        result[0].Id.ShouldBe(user1.Id);
        result[1].Id.ShouldBe(user2.Id);
    }

    [Fact]
    public async Task GetUserByIdAsync_WithExistingUser_ShouldReturnUser()
    {
        // Arrange
        var user = _fixture.Build<User>()
            .Without(u => u.ServerInstances)
            .Create();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetUserByIdAsync(user.Id);

        // Assert
        result.ShouldNotBeNull();
        result!.Id.ShouldBe(user.Id);
    }

    [Fact]
    public async Task GetUserByIdAsync_WithNonExistentUser_ShouldReturnNull()
    {
        // Arrange
        var nonExistentUserId = _fixture.Create<Guid>();

        // Act
        var result = await _sut.GetUserByIdAsync(nonExistentUserId);

        // Assert
        result.ShouldBeNull();
    }

    [Fact]
    public async Task PromoteUserToAdminAsync_WithExistingUser_ShouldSetRoleToAdmin()
    {
        // Arrange
        var user = _fixture.Build<User>()
            .With(u => u.Role, UserRole.User)
            .Without(u => u.ServerInstances)
            .Create();
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Act
        await _sut.PromoteUserToAdminAsync(user.Id);

        // Assert
        var updatedUser = await _context.Users.FindAsync(user.Id);
        updatedUser!.Role.ShouldBe(UserRole.Admin);
    }

    [Fact]
    public async Task PromoteUserToAdminAsync_WithExistingUser_ShouldUpdateTimestamp()
    {
        // Arrange
        var initialUpdateTime = DateTime.UtcNow.AddHours(-1);
        var user = _fixture.Build<User>()
            .With(u => u.Role, UserRole.User)
            .With(u => u.UpdatedAt, initialUpdateTime)
            .Without(u => u.ServerInstances)
            .Create();
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Act
        await _sut.PromoteUserToAdminAsync(user.Id);

        // Assert
        var updatedUser = await _context.Users.FindAsync(user.Id);
        updatedUser!.UpdatedAt.ShouldBeGreaterThan(initialUpdateTime);
    }

    [Fact]
    public async Task PromoteUserToAdminAsync_WithNonExistentUser_ShouldThrowException()
    {
        // Arrange
        var nonExistentUserId = _fixture.Create<Guid>();

        // Act & Assert
        await Should.ThrowAsync<InvalidOperationException>(async () => 
            await _sut.PromoteUserToAdminAsync(nonExistentUserId));
    }

    [Fact]
    public async Task DemoteUserToRegularAsync_WithExistingAdmin_ShouldSetRoleToUser()
    {
        // Arrange
        var admin = _fixture.Build<User>()
            .With(u => u.Role, UserRole.Admin)
            .Without(u => u.ServerInstances)
            .Create();
        
        _context.Users.Add(admin);
        await _context.SaveChangesAsync();

        // Act
        await _sut.DemoteUserToRegularAsync(admin.Id);

        // Assert
        var updatedUser = await _context.Users.FindAsync(admin.Id);
        updatedUser!.Role.ShouldBe(UserRole.User);
    }

    [Fact]
    public async Task DemoteUserToRegularAsync_WithNonExistentUser_ShouldThrowException()
    {
        // Arrange
        var nonExistentUserId = _fixture.Create<Guid>();

        // Act & Assert
        await Should.ThrowAsync<InvalidOperationException>(async () => 
            await _sut.DemoteUserToRegularAsync(nonExistentUserId));
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}