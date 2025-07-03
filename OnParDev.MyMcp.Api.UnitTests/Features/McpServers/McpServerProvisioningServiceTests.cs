using AutoFixture;
using Shouldly;
using NSubstitute;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Features.McpServers.Services;
using OnParDev.MyMcp.Api.Features.McpServers.DTOs;
using OnParDev.MyMcp.Api.Features.McpServers.Entities;
using Xunit;

namespace OnParDev.MyMcp.Api.UnitTests.Features.McpServers;

public class McpServerProvisioningServiceTests
{
    private readonly Fixture _fixture = new();
    private readonly IContainerOrchestrator _mockContainerOrchestrator;
    private readonly IServerInstanceRepository _mockServerRepository;
    private readonly IUsageTracker _mockUsageTracker;
    private readonly IContainerSpecRepository _mockContainerSpecRepository;
    private readonly IMcpServerTemplateRepository _mockTemplateRepository;
    private readonly McpServerProvisioningService _sut;

    public McpServerProvisioningServiceTests()
    {
        _mockContainerOrchestrator = Substitute.For<IContainerOrchestrator>();
        _mockServerRepository = Substitute.For<IServerInstanceRepository>();
        _mockUsageTracker = Substitute.For<IUsageTracker>();
        _mockContainerSpecRepository = Substitute.For<IContainerSpecRepository>();
        _mockTemplateRepository = Substitute.For<IMcpServerTemplateRepository>();
        _sut = new McpServerProvisioningService(
            _mockContainerOrchestrator,
            _mockServerRepository,
            _mockUsageTracker,
            _mockContainerSpecRepository,
            _mockTemplateRepository);
    }

    [Fact]
    public async Task ProvisionGitHubServerAsync_WithValidRequest_ShouldCreateServerInstance()
    {
        // Arrange
        var request = _fixture.Build<CreateGitHubServerRequest>()
            .With(r => r.GitHubToken, "ghp_validtoken123")
            .With(r => r.Repository, "test/repo")
            .Create();

        var user = _fixture.Build<User>()
            .Without(u => u.ServerInstances)
            .Create();

        var template = _fixture.Build<McpServerTemplate>()
            .Without(t => t.ServerInstances)
            .Create();
        var containerSpec = _fixture.Build<ContainerSpec>()
            .Without(cs => cs.ServerInstances)
            .Create();

        _mockTemplateRepository
            .GetByNameAndVersionAsync(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult<McpServerTemplate?>(null));

        _mockTemplateRepository
            .CreateAsync(Arg.Any<McpServerTemplate>())
            .Returns(Task.FromResult(template));

        _mockContainerSpecRepository
            .CreateAsync(Arg.Any<ContainerSpec>())
            .Returns(Task.FromResult(containerSpec));

        _mockContainerOrchestrator
            .StartContainerAsync(Arg.Any<ContainerStartRequest>())
            .Returns(Task.FromResult(new ContainerStartResult
            {
                ContainerInstanceId = "container-123",
                Status = ContainerStatus.Running,
                IpAddress = "192.168.1.100",
                Port = 8080
            }));

        // Act
        var result = await _sut.ProvisionGitHubServerAsync(user.Id, request);

        // Assert
        result.ShouldNotBeNull();
        result.Name.ShouldBe(request.Name);
        result.Status.ShouldBe(ServerStatus.Running);
    }

    [Fact]
    public async Task ProvisionGitHubServerAsync_WithInvalidToken_ShouldThrowValidationException()
    {
        // Arrange
        var request = _fixture.Build<CreateGitHubServerRequest>()
            .With(r => r.GitHubToken, "")
            .Create();

        var userId = _fixture.Create<Guid>();

        // Act & Assert
        await Should.ThrowAsync<ArgumentException>(async () =>
            await _sut.ProvisionGitHubServerAsync(userId, request));
    }

    [Fact]
    public async Task ProvisionGitHubServerAsync_ShouldTrackUsage()
    {
        // Arrange
        var request = _fixture.Build<CreateGitHubServerRequest>()
            .With(r => r.GitHubToken, "ghp_validtoken123")
            .With(r => r.Repository, "test/repo")
            .Create();
        var userId = _fixture.Create<Guid>();

        var template = _fixture.Build<McpServerTemplate>()
            .Without(t => t.ServerInstances)
            .Create();
        var containerSpec = _fixture.Build<ContainerSpec>()
            .Without(cs => cs.ServerInstances)
            .Create();

        _mockTemplateRepository
            .GetByNameAndVersionAsync(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult<McpServerTemplate?>(null));

        _mockTemplateRepository
            .CreateAsync(Arg.Any<McpServerTemplate>())
            .Returns(Task.FromResult(template));

        _mockContainerSpecRepository
            .CreateAsync(Arg.Any<ContainerSpec>())
            .Returns(Task.FromResult(containerSpec));

        _mockContainerOrchestrator
            .StartContainerAsync(Arg.Any<ContainerStartRequest>())
            .Returns(Task.FromResult(new ContainerStartResult
            {
                ContainerInstanceId = "container-123",
                Status = ContainerStatus.Running
            }));

        // Act
        await _sut.ProvisionGitHubServerAsync(userId, request);

        // Assert
        await _mockUsageTracker.Received(1)
            .TrackServerCreationAsync(userId, Arg.Any<Guid>());
    }

    [Fact]
    public async Task ProvisionGitHubServerAsync_ShouldSaveServerInstance()
    {
        // Arrange
        var request = _fixture.Build<CreateGitHubServerRequest>()
            .With(r => r.GitHubToken, "ghp_validtoken123")
            .With(r => r.Repository, "test/repo")
            .Create();
        var userId = _fixture.Create<Guid>();

        var template = _fixture.Build<McpServerTemplate>()
            .Without(t => t.ServerInstances)
            .Create();
        var containerSpec = _fixture.Build<ContainerSpec>()
            .Without(cs => cs.ServerInstances)
            .Create();

        _mockTemplateRepository
            .GetByNameAndVersionAsync(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult<McpServerTemplate?>(null));

        _mockTemplateRepository
            .CreateAsync(Arg.Any<McpServerTemplate>())
            .Returns(Task.FromResult(template));

        _mockContainerSpecRepository
            .CreateAsync(Arg.Any<ContainerSpec>())
            .Returns(Task.FromResult(containerSpec));

        _mockContainerOrchestrator
            .StartContainerAsync(Arg.Any<ContainerStartRequest>())
            .Returns(Task.FromResult(new ContainerStartResult
            {
                ContainerInstanceId = "container-123",
                Status = ContainerStatus.Running
            }));

        // Act
        await _sut.ProvisionGitHubServerAsync(userId, request);

        // Assert
        await _mockServerRepository.Received(1)
            .CreateAsync(Arg.Is<ServerInstance>(s =>
                s.UserId == userId &&
                s.Name == request.Name));
    }

    [Fact]
    public async Task ProvisionGitHubServerAsync_WhenContainerFails_ShouldMarkServerAsFailed()
    {
        // Arrange
        var request = _fixture.Build<CreateGitHubServerRequest>()
            .With(r => r.GitHubToken, "ghp_validtoken123")
            .With(r => r.Repository, "test/repo")
            .Create();
        var userId = _fixture.Create<Guid>();

        var template = _fixture.Build<McpServerTemplate>()
            .Without(t => t.ServerInstances)
            .Create();
        var containerSpec = _fixture.Build<ContainerSpec>()
            .Without(cs => cs.ServerInstances)
            .Create();

        _mockTemplateRepository
            .GetByNameAndVersionAsync(Arg.Any<string>(), Arg.Any<string>())
            .Returns(Task.FromResult<McpServerTemplate?>(null));

        _mockTemplateRepository
            .CreateAsync(Arg.Any<McpServerTemplate>())
            .Returns(Task.FromResult(template));

        _mockContainerSpecRepository
            .CreateAsync(Arg.Any<ContainerSpec>())
            .Returns(Task.FromResult(containerSpec));

        _mockContainerOrchestrator
            .StartContainerAsync(Arg.Any<ContainerStartRequest>())
            .Returns(Task.FromResult(new ContainerStartResult
            {
                ContainerInstanceId = "container-123",
                Status = ContainerStatus.Failed,
                ErrorMessage = "Container failed to start"
            }));

        // Act
        var result = await _sut.ProvisionGitHubServerAsync(userId, request);

        // Assert
        result.Status.ShouldBe(ServerStatus.Failed);
    }

    [Fact]
    public async Task StopServerAsync_WithValidServerId_ShouldStopContainer()
    {
        // Arrange
        var serverId = _fixture.Create<Guid>();
        var serverInstance = _fixture.Build<ServerInstance>()
            .With(s => s.Id, serverId)
            .With(s => s.ContainerInstanceId, "container-123")
            .With(s => s.Status, ServerStatus.Running)
            .Without(s => s.User)
            .Without(s => s.McpServerTemplate)
            .Without(s => s.ContainerSpec)
            .Without(s => s.ServerLogs)
            .Without(s => s.DeploymentAudits)
            .Create();

        _mockServerRepository
            .GetByIdAsync(serverId)
            .Returns(serverInstance);

        _mockContainerOrchestrator
            .StopContainerAsync("container-123")
            .Returns(Task.FromResult(new ContainerStopResult { Success = true }));

        // Act
        var result = await _sut.StopServerAsync(serverId);

        // Assert
        result.ShouldBeTrue();
        await _mockContainerOrchestrator.Received(1)
            .StopContainerAsync("container-123");
    }

    [Fact]
    public async Task StopServerAsync_WithNonExistentServer_ShouldReturnFalse()
    {
        // Arrange
        var serverId = _fixture.Create<Guid>();
        _mockServerRepository
            .GetByIdAsync(serverId)
            .Returns((ServerInstance?)null);

        // Act
        var result = await _sut.StopServerAsync(serverId);

        // Assert
        result.ShouldBeFalse();
    }

    [Fact]
    public async Task GetServerHealthAsync_WithRunningServer_ShouldReturnHealthyStatus()
    {
        // Arrange
        var serverId = _fixture.Create<Guid>();
        var serverInstance = _fixture.Build<ServerInstance>()
            .With(s => s.Id, serverId)
            .With(s => s.ContainerInstanceId, "container-123")
            .Without(s => s.User)
            .Without(s => s.McpServerTemplate)
            .Without(s => s.ContainerSpec)
            .Without(s => s.ServerLogs)
            .Without(s => s.DeploymentAudits)
            .Create();

        _mockServerRepository
            .GetByIdAsync(serverId)
            .Returns(serverInstance);

        _mockContainerOrchestrator
            .GetContainerHealthAsync("container-123")
            .Returns(Task.FromResult(new ContainerHealthResult
            {
                IsHealthy = true,
                Status = ContainerStatus.Running,
                LastChecked = DateTime.UtcNow
            }));

        // Act
        var result = await _sut.GetServerHealthAsync(serverId);

        // Assert
        result.ShouldNotBeNull();
        result!.IsHealthy.ShouldBeTrue();
        result.Status.ShouldBe(ServerStatus.Running);
    }
}