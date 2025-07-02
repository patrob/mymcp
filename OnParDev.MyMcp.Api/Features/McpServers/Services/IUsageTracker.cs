namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public interface IUsageTracker
{
    Task TrackServerCreationAsync(Guid userId, Guid serverId);
    Task TrackRequestAsync(Guid userId, Guid serverId, string endpoint, string method);
}