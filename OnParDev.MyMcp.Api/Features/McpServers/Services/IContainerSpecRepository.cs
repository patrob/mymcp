using OnParDev.MyMcp.Api.Domain.Entities;

namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public interface IContainerSpecRepository
{
    Task<ContainerSpec> CreateAsync(ContainerSpec containerSpec);
    Task<ContainerSpec?> GetByIdAsync(Guid id);
    Task<ContainerSpec?> GetByNameAsync(string name);
    Task<List<ContainerSpec>> GetAllAsync();
    Task<ContainerSpec> UpdateAsync(ContainerSpec containerSpec);
    Task<bool> DeleteAsync(Guid id);
}