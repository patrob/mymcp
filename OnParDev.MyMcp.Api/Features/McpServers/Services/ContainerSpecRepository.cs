using Microsoft.EntityFrameworkCore;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Infrastructure.Data;

namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public class ContainerSpecRepository : IContainerSpecRepository
{
    private readonly ApplicationDbContext _context;

    public ContainerSpecRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ContainerSpec> CreateAsync(ContainerSpec containerSpec)
    {
        _context.ContainerSpecs.Add(containerSpec);
        await _context.SaveChangesAsync();
        return containerSpec;
    }

    public async Task<ContainerSpec?> GetByIdAsync(Guid id)
    {
        return await _context.ContainerSpecs
            .FirstOrDefaultAsync(cs => cs.Id == id);
    }

    public async Task<ContainerSpec?> GetByNameAsync(string name)
    {
        return await _context.ContainerSpecs
            .FirstOrDefaultAsync(cs => cs.Name == name);
    }

    public async Task<List<ContainerSpec>> GetAllAsync()
    {
        return await _context.ContainerSpecs
            .OrderBy(cs => cs.Name)
            .ToListAsync();
    }

    public async Task<ContainerSpec> UpdateAsync(ContainerSpec containerSpec)
    {
        containerSpec.UpdatedAt = DateTime.UtcNow;
        _context.ContainerSpecs.Update(containerSpec);
        await _context.SaveChangesAsync();
        return containerSpec;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var containerSpec = await GetByIdAsync(id);
        if (containerSpec == null)
            return false;

        _context.ContainerSpecs.Remove(containerSpec);
        await _context.SaveChangesAsync();
        return true;
    }
}