using OnParDev.MyMcp.Api.Domain.Entities;

namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public interface IServerInstanceRepository
{
    Task<ServerInstance> CreateAsync(ServerInstance serverInstance);
    Task<ServerInstance?> GetByIdAsync(Guid id);
    Task<List<ServerInstance>> GetByUserIdAsync(Guid userId);
    Task<ServerInstance> UpdateAsync(ServerInstance serverInstance);
    Task<bool> DeleteAsync(Guid id);
}