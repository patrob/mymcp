using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Features.McpServers.DTOs;
using OnParDev.MyMcp.Api.Features.McpServers.Entities;

namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public interface IMcpServerProvisioningService
{
    Task<ServerInstance> ProvisionGitHubServerAsync(Guid userId, CreateGitHubServerRequest request);
    Task<bool> StopServerAsync(Guid serverId);
    Task<ServerHealthResponse?> GetServerHealthAsync(Guid serverId);
}

public class McpServerProvisioningService : IMcpServerProvisioningService
{
    private readonly IContainerOrchestrator _containerOrchestrator;
    private readonly IServerInstanceRepository _serverRepository;
    private readonly IUsageTracker _usageTracker;

    public McpServerProvisioningService(
        IContainerOrchestrator containerOrchestrator,
        IServerInstanceRepository serverRepository,
        IUsageTracker usageTracker)
    {
        _containerOrchestrator = containerOrchestrator;
        _serverRepository = serverRepository;
        _usageTracker = usageTracker;
    }

    public async Task<ServerInstance> ProvisionGitHubServerAsync(Guid userId, CreateGitHubServerRequest request)
    {
        ValidateGitHubServerRequest(request);

        var gitHubConfig = new GitHubMcpServerConfiguration
        {
            GitHubToken = request.GitHubToken,
            Repository = request.Repository
        };

        var template = GitHubMcpServerTemplate.Create();
        var serverId = Guid.NewGuid();

        var containerRequest = new ContainerStartRequest(
            ImageName: "mcp-github-server",
            ImageTag: "latest",
            EnvironmentVariables: gitHubConfig.GetEnvironmentVariables(),
            Labels: new Dictionary<string, string>
            {
                ["mcp.server.type"] = "github",
                ["mcp.server.id"] = serverId.ToString(),
                ["mcp.user.id"] = userId.ToString()
            }
        );

        var containerResult = await _containerOrchestrator.StartContainerAsync(containerRequest);

        var serverInstance = new ServerInstance
        {
            Id = serverId,
            UserId = userId,
            Name = request.Name,
            Description = request.Description,
            ContainerInstanceId = containerResult.ContainerInstanceId,
            Status = MapContainerStatusToServerStatus(containerResult.Status),
            McpServerTemplateId = template.Id,
            ContainerSpecId = Guid.NewGuid(), // TODO: Create proper container spec
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _serverRepository.CreateAsync(serverInstance);
        await _usageTracker.TrackServerCreationAsync(userId, serverId);

        return serverInstance;
    }

    public async Task<bool> StopServerAsync(Guid serverId)
    {
        var serverInstance = await _serverRepository.GetByIdAsync(serverId);
        if (serverInstance == null)
            return false;

        var result = await _containerOrchestrator.StopContainerAsync(serverInstance.ContainerInstanceId);
        
        if (result.Success)
        {
            serverInstance.Status = ServerStatus.Stopped;
            serverInstance.UpdatedAt = DateTime.UtcNow;
            await _serverRepository.UpdateAsync(serverInstance);
        }

        return result.Success;
    }

    public async Task<ServerHealthResponse?> GetServerHealthAsync(Guid serverId)
    {
        var serverInstance = await _serverRepository.GetByIdAsync(serverId);
        if (serverInstance == null)
            return null;

        var healthResult = await _containerOrchestrator.GetContainerHealthAsync(serverInstance.ContainerInstanceId);

        return new ServerHealthResponse
        {
            IsHealthy = healthResult.IsHealthy,
            Status = MapContainerStatusToServerStatus(healthResult.Status),
            LastChecked = healthResult.LastChecked,
            ErrorMessage = healthResult.ErrorMessage
        };
    }

    private static void ValidateGitHubServerRequest(CreateGitHubServerRequest request)
    {
        if (string.IsNullOrEmpty(request.GitHubToken))
            throw new ArgumentException("GitHub token is required");

        if (string.IsNullOrEmpty(request.Name))
            throw new ArgumentException("Server name is required");
    }

    private static ServerStatus MapContainerStatusToServerStatus(ContainerStatus containerStatus)
    {
        return containerStatus switch
        {
            ContainerStatus.Starting => ServerStatus.Starting,
            ContainerStatus.Running => ServerStatus.Running,
            ContainerStatus.Stopping => ServerStatus.Stopping,
            ContainerStatus.Stopped => ServerStatus.Stopped,
            ContainerStatus.Failed => ServerStatus.Failed,
            _ => ServerStatus.Unknown
        };
    }
}