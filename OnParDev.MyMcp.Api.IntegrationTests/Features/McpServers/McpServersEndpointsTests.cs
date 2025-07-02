using System.Net;
using System.Net.Http.Json;
using AutoFixture;
using Shouldly;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Features.McpServers.DTOs;
using OnParDev.MyMcp.Api.Features.Subscriptions.Entities;
using OnParDev.MyMcp.Api.Infrastructure.Data;
using Xunit;

namespace OnParDev.MyMcp.Api.IntegrationTests.Features.McpServers;

public class McpServersEndpointsTests : IClassFixture<IntegrationTestWebAppFactory>
{
    private readonly IntegrationTestWebAppFactory _factory;
    private readonly HttpClient _client;
    private readonly Fixture _fixture = new();

    public McpServersEndpointsTests(IntegrationTestWebAppFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task CreateGitHubServer_WithValidRequest_ShouldReturnCreatedServer()
    {
        // Arrange
        var user = await CreateTestUserWithSubscriptionAsync();
        var request = new CreateGitHubServerRequest
        {
            Name = "Test GitHub Server",
            Description = "Test server for integration testing",
            GitHubToken = "ghp_test_token_12345",
            Repository = "test/repo"
        };

        // Mock authentication by setting up test user context
        // In a real test, you'd set up proper JWT tokens or test authentication

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/mcp-servers/github", request);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Created);
        
        var serverDto = await response.Content.ReadFromJsonAsync<ServerInstanceDto>();
        serverDto.ShouldNotBeNull();
        serverDto.Name.ShouldBe(request.Name);
        serverDto.Description.ShouldBe(request.Description);
        serverDto.Status.ShouldBeOneOf(ServerStatus.Starting, ServerStatus.Running);
    }

    [Fact]
    public async Task CreateGitHubServer_WithInvalidToken_ShouldReturnBadRequest()
    {
        // Arrange
        var user = await CreateTestUserWithSubscriptionAsync();
        var request = new CreateGitHubServerRequest
        {
            Name = "Test GitHub Server",
            Description = "Test server",
            GitHubToken = "", // Invalid empty token
            Repository = "test/repo"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/mcp-servers/github", request);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetUserServers_WithExistingServers_ShouldReturnServers()
    {
        // Arrange
        var user = await CreateTestUserWithSubscriptionAsync();
        var server = await CreateTestServerAsync(user.Id);

        // Act
        var response = await _client.GetAsync("/api/v1/mcp-servers");

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        
        var servers = await response.Content.ReadFromJsonAsync<List<ServerInstanceDto>>();
        servers.ShouldNotBeNull();
        servers!.Count.ShouldBe(1);
        servers[0].Id.ShouldBe(server.Id);
        servers[0].Name.ShouldBe(server.Name);
    }

    [Fact]
    public async Task GetServer_WithValidId_ShouldReturnServer()
    {
        // Arrange
        var user = await CreateTestUserWithSubscriptionAsync();
        var server = await CreateTestServerAsync(user.Id);

        // Act
        var response = await _client.GetAsync($"/api/v1/mcp-servers/{server.Id}");

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        
        var serverDto = await response.Content.ReadFromJsonAsync<ServerInstanceDto>();
        serverDto.ShouldNotBeNull();
        serverDto!.Id.ShouldBe(server.Id);
        serverDto.Name.ShouldBe(server.Name);
    }

    [Fact]
    public async Task GetServer_WithNonExistentId_ShouldReturnNotFound()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/v1/mcp-servers/{nonExistentId}");

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task StopServer_WithValidId_ShouldStopServer()
    {
        // Arrange
        var user = await CreateTestUserWithSubscriptionAsync();
        var server = await CreateTestServerAsync(user.Id);

        // Act
        var response = await _client.PostAsync($"/api/v1/mcp-servers/{server.Id}/stop", null);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        
        var serverDto = await response.Content.ReadFromJsonAsync<ServerInstanceDto>();
        serverDto.ShouldNotBeNull();
        serverDto!.Status.ShouldBe(ServerStatus.Stopped);
    }

    [Fact]
    public async Task DeleteServer_WithValidId_ShouldDeleteServer()
    {
        // Arrange
        var user = await CreateTestUserWithSubscriptionAsync();
        var server = await CreateTestServerAsync(user.Id);

        // Act
        var response = await _client.DeleteAsync($"/api/v1/mcp-servers/{server.Id}");

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.NoContent);

        // Verify server is deleted
        var getResponse = await _client.GetAsync($"/api/v1/mcp-servers/{server.Id}");
        getResponse.StatusCode.ShouldBe(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetServerHealth_WithValidId_ShouldReturnHealthStatus()
    {
        // Arrange
        var user = await CreateTestUserWithSubscriptionAsync();
        var server = await CreateTestServerAsync(user.Id);

        // Act
        var response = await _client.GetAsync($"/api/v1/mcp-servers/{server.Id}/health");

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        
        var health = await response.Content.ReadFromJsonAsync<ServerHealthResponse>();
        health.ShouldNotBeNull();
        health!.IsHealthy.ShouldBeTrue();
        health.Status.ShouldBe(ServerStatus.Running);
    }

    private async Task<User> CreateTestUserWithSubscriptionAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // Use specific timestamps to avoid PostgreSQL conversion issues
        var baseTime = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        // Use the same ClerkUserId that TestAuthService returns
        const string testClerkUserId = "test-user-id";
        
        // Check if user already exists
        var existingUser = await context.Users
            .FirstOrDefaultAsync(u => u.ClerkUserId == testClerkUserId);
            
        if (existingUser != null)
            return existingUser;

        var user = new User
        {
            Id = Guid.NewGuid(),
            ClerkUserId = testClerkUserId,
            Email = "test@example.com",
            FirstName = "Test",
            LastName = "User",
            Role = UserRole.User,
            CreatedAt = baseTime,
            UpdatedAt = baseTime
        };

        context.Users.Add(user);

        // Try to find existing plan first to avoid constraint violation
        var plan = await context.Plans
            .FirstOrDefaultAsync(p => p.PlanTypeName == PlanTypeName.Free && p.BillingCycle == BillingCycle.Monthly);

        if (plan == null)
        {
            plan = new Plan
            {
                Id = Guid.NewGuid(),
                PlanTypeName = PlanTypeName.Free,
                BillingCycle = BillingCycle.Monthly,
                IsActive = true,
                CreatedAt = baseTime,
                UpdatedAt = baseTime
            };
            context.Plans.Add(plan);
        }

        // Create an active subscription
        var subscription = new Subscription
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            PlanId = plan.Id,
            Status = SubscriptionStatus.Active,
            StartDate = baseTime.AddDays(-1),
            NextBillingDate = baseTime.AddMonths(1),
            CreatedAt = baseTime,
            UpdatedAt = baseTime
        };

        context.Subscriptions.Add(subscription);

        await context.SaveChangesAsync();
        return user;
    }

    private async Task<ServerInstance> CreateTestServerAsync(Guid userId)
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // Use specific timestamps to avoid PostgreSQL conversion issues
        var baseTime = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        // Create a test MCP server template
        var template = new McpServerTemplate
        {
            Id = Guid.NewGuid(),
            Name = "GitHub MCP Server",
            Description = "Test GitHub server template",
            Version = "1.0.0",
            Category = "Version Control",
            IsOfficial = true,
            CreatedAt = baseTime,
            UpdatedAt = baseTime
        };

        context.McpServerTemplates.Add(template);

        // Create a test container spec
        var containerSpec = new ContainerSpec
        {
            Id = Guid.NewGuid(),
            Name = "GitHub MCP Container",
            Description = "Test container spec",
            ImageName = "mcp-github-server",
            ImageTag = "latest",
            CpuLimit = 1000,
            MemoryLimit = 512,
            CreatedAt = baseTime,
            UpdatedAt = baseTime
        };

        context.ContainerSpecs.Add(containerSpec);

        var server = new ServerInstance
        {
            Id = Guid.NewGuid(),
            Name = "Test GitHub Server",
            Description = "Integration test server",
            UserId = userId,
            McpServerTemplateId = template.Id,
            ContainerSpecId = containerSpec.Id,
            Status = ServerStatus.Running,
            ContainerInstanceId = "test-container-123",
            CreatedAt = baseTime,
            UpdatedAt = baseTime
        };

        context.ServerInstances.Add(server);
        await context.SaveChangesAsync();
        return server;
    }
}