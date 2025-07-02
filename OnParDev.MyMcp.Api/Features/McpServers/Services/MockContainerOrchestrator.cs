namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public class MockContainerOrchestrator : IContainerOrchestrator
{
    public Task<ContainerStartResult> StartContainerAsync(ContainerStartRequest request)
    {
        // Mock implementation - in production this would use Docker API or similar
        var result = new ContainerStartResult
        {
            ContainerInstanceId = $"mock-container-{Guid.NewGuid():N}",
            Status = ContainerStatus.Running,
            IpAddress = "127.0.0.1",
            Port = 8080
        };

        return Task.FromResult(result);
    }

    public Task<ContainerStopResult> StopContainerAsync(string containerInstanceId)
    {
        // Mock implementation - in production this would stop the actual container
        var result = new ContainerStopResult
        {
            Success = true
        };

        return Task.FromResult(result);
    }

    public Task<ContainerHealthResult> GetContainerHealthAsync(string containerInstanceId)
    {
        // Mock implementation - in production this would check container health
        var result = new ContainerHealthResult
        {
            IsHealthy = true,
            Status = ContainerStatus.Running,
            LastChecked = DateTime.UtcNow
        };

        return Task.FromResult(result);
    }
}