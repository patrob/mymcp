using Microsoft.EntityFrameworkCore;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Infrastructure.Data;

namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public class ServerInstanceRepository : IServerInstanceRepository
{
    private readonly ApplicationDbContext _context;

    public ServerInstanceRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ServerInstance> CreateAsync(ServerInstance serverInstance)
    {
        _context.ServerInstances.Add(serverInstance);
        await _context.SaveChangesAsync();
        return serverInstance;
    }

    public async Task<ServerInstance?> GetByIdAsync(Guid id)
    {
        return await _context.ServerInstances
            .Include(s => s.User)
            .Include(s => s.McpServerTemplate)
            .Include(s => s.ContainerSpec)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<List<ServerInstance>> GetByUserIdAsync(Guid userId)
    {
        return await _context.ServerInstances
            .Include(s => s.McpServerTemplate)
            .Include(s => s.ContainerSpec)
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<ServerInstance> UpdateAsync(ServerInstance serverInstance)
    {
        _context.ServerInstances.Update(serverInstance);
        await _context.SaveChangesAsync();
        return serverInstance;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var serverInstance = await _context.ServerInstances.FindAsync(id);
        if (serverInstance == null)
            return false;

        _context.ServerInstances.Remove(serverInstance);
        await _context.SaveChangesAsync();
        return true;
    }
}