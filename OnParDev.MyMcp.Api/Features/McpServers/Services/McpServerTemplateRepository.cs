using Microsoft.EntityFrameworkCore;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Infrastructure.Data;

namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public class McpServerTemplateRepository : IMcpServerTemplateRepository
{
    private readonly ApplicationDbContext _context;

    public McpServerTemplateRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<McpServerTemplate> CreateAsync(McpServerTemplate template)
    {
        _context.McpServerTemplates.Add(template);
        await _context.SaveChangesAsync();
        return template;
    }

    public async Task<McpServerTemplate?> GetByIdAsync(Guid id)
    {
        return await _context.McpServerTemplates
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<McpServerTemplate?> GetByNameAndVersionAsync(string name, string version)
    {
        return await _context.McpServerTemplates
            .FirstOrDefaultAsync(t => t.Name == name && t.Version == version);
    }

    public async Task<List<McpServerTemplate>> GetAllAsync()
    {
        return await _context.McpServerTemplates
            .OrderBy(t => t.Name)
            .ThenBy(t => t.Version)
            .ToListAsync();
    }

    public async Task<List<McpServerTemplate>> GetOfficialTemplatesAsync()
    {
        return await _context.McpServerTemplates
            .Where(t => t.IsOfficial)
            .OrderBy(t => t.Name)
            .ThenBy(t => t.Version)
            .ToListAsync();
    }

    public async Task<McpServerTemplate> UpdateAsync(McpServerTemplate template)
    {
        template.UpdatedAt = DateTime.UtcNow;
        _context.McpServerTemplates.Update(template);
        await _context.SaveChangesAsync();
        return template;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var template = await GetByIdAsync(id);
        if (template == null)
            return false;

        _context.McpServerTemplates.Remove(template);
        await _context.SaveChangesAsync();
        return true;
    }
}