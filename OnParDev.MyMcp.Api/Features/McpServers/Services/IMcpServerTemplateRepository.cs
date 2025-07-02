using OnParDev.MyMcp.Api.Domain.Entities;

namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public interface IMcpServerTemplateRepository
{
    Task<McpServerTemplate> CreateAsync(McpServerTemplate template);
    Task<McpServerTemplate?> GetByIdAsync(Guid id);
    Task<McpServerTemplate?> GetByNameAndVersionAsync(string name, string version);
    Task<List<McpServerTemplate>> GetAllAsync();
    Task<List<McpServerTemplate>> GetOfficialTemplatesAsync();
    Task<McpServerTemplate> UpdateAsync(McpServerTemplate template);
    Task<bool> DeleteAsync(Guid id);
}