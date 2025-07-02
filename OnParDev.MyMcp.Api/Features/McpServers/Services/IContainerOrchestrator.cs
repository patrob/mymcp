namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public interface IContainerOrchestrator
{
    Task<ContainerStartResult> StartContainerAsync(ContainerStartRequest request);
    Task<ContainerStopResult> StopContainerAsync(string containerInstanceId);
    Task<ContainerHealthResult> GetContainerHealthAsync(string containerInstanceId);
}

public record ContainerStartRequest(
    string ImageName,
    string ImageTag,
    Dictionary<string, string> EnvironmentVariables,
    Dictionary<string, string> Labels,
    int Port = 8080
);

public record ContainerStartResult
{
    public required string ContainerInstanceId { get; init; }
    public required ContainerStatus Status { get; init; }
    public string? IpAddress { get; init; }
    public int? Port { get; init; }
    public string? ErrorMessage { get; init; }
}

public record ContainerStopResult
{
    public required bool Success { get; init; }
    public string? ErrorMessage { get; init; }
}

public record ContainerHealthResult
{
    public required bool IsHealthy { get; init; }
    public required ContainerStatus Status { get; init; }
    public required DateTime LastChecked { get; init; }
    public string? ErrorMessage { get; init; }
}

public enum ContainerStatus
{
    Starting = 0,
    Running = 1,
    Stopping = 2,
    Stopped = 3,
    Failed = 4
}