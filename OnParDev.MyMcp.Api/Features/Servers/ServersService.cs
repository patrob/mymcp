using Microsoft.EntityFrameworkCore;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Features.Servers.DTOs;
using OnParDev.MyMcp.Api.Infrastructure.Data;

namespace OnParDev.MyMcp.Api.Features.Servers;

public interface IServersService
{
    Task<IEnumerable<ServerInstanceSummaryDto>> GetUserServersAsync(Guid userId);
    Task<ServerInstanceDto?> GetServerByIdAsync(Guid serverId, Guid userId);
    Task<ServerInstanceDto> CreateServerAsync(CreateServerInstanceDto dto, Guid userId);
    Task<ServerInstanceDto?> UpdateServerAsync(Guid serverId, UpdateServerInstanceDto dto, Guid userId);
    Task<bool> DeleteServerAsync(Guid serverId, Guid userId);
    Task<bool> StartServerAsync(Guid serverId, Guid userId);
    Task<bool> StopServerAsync(Guid serverId, Guid userId);
}

public class ServersService : IServersService
{
    private readonly ApplicationDbContext _context;

    public ServersService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ServerInstanceSummaryDto>> GetUserServersAsync(Guid userId)
    {
        return await _context.ServerInstances
            .Where(s => s.UserId == userId)
            .Select(s => new ServerInstanceSummaryDto(
                s.Id,
                s.Name,
                s.Status,
                s.CreatedAt,
                s.LastStartedAt
            ))
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<ServerInstanceDto?> GetServerByIdAsync(Guid serverId, Guid userId)
    {
        var server = await _context.ServerInstances
            .Where(s => s.Id == serverId && s.UserId == userId)
            .FirstOrDefaultAsync();

        if (server == null) return null;

        return new ServerInstanceDto(
            server.Id,
            server.Name,
            server.Description,
            server.UserId,
            server.McpServerTemplateId,
            server.ContainerSpecId,
            server.Status,
            server.ContainerInstanceId,
            server.CreatedAt,
            server.UpdatedAt,
            server.LastStartedAt,
            server.LastStoppedAt
        );
    }

    public async Task<ServerInstanceDto> CreateServerAsync(CreateServerInstanceDto dto, Guid userId)
    {
        // Verify template and container spec exist
        var templateExists = await _context.McpServerTemplates
            .AnyAsync(t => t.Id == dto.McpServerTemplateId);
        if (!templateExists)
            throw new ArgumentException("Invalid MCP Server Template ID");

        var containerSpecExists = await _context.ContainerSpecs
            .AnyAsync(c => c.Id == dto.ContainerSpecId);
        if (!containerSpecExists)
            throw new ArgumentException("Invalid Container Spec ID");

        var server = new ServerInstance
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            UserId = userId,
            McpServerTemplateId = dto.McpServerTemplateId,
            ContainerSpecId = dto.ContainerSpecId,
            Status = ServerStatus.Stopped,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.ServerInstances.Add(server);
        await _context.SaveChangesAsync();

        return new ServerInstanceDto(
            server.Id,
            server.Name,
            server.Description,
            server.UserId,
            server.McpServerTemplateId,
            server.ContainerSpecId,
            server.Status,
            server.ContainerInstanceId,
            server.CreatedAt,
            server.UpdatedAt,
            server.LastStartedAt,
            server.LastStoppedAt
        );
    }

    public async Task<ServerInstanceDto?> UpdateServerAsync(Guid serverId, UpdateServerInstanceDto dto, Guid userId)
    {
        var server = await _context.ServerInstances
            .Where(s => s.Id == serverId && s.UserId == userId)
            .FirstOrDefaultAsync();

        if (server == null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Name))
            server.Name = dto.Name;

        if (dto.Description != null)
            server.Description = dto.Description;

        server.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return new ServerInstanceDto(
            server.Id,
            server.Name,
            server.Description,
            server.UserId,
            server.McpServerTemplateId,
            server.ContainerSpecId,
            server.Status,
            server.ContainerInstanceId,
            server.CreatedAt,
            server.UpdatedAt,
            server.LastStartedAt,
            server.LastStoppedAt
        );
    }

    public async Task<bool> DeleteServerAsync(Guid serverId, Guid userId)
    {
        var server = await _context.ServerInstances
            .Where(s => s.Id == serverId && s.UserId == userId)
            .FirstOrDefaultAsync();

        if (server == null) return false;

        // Only allow deletion if server is stopped
        if (server.Status != ServerStatus.Stopped)
            throw new InvalidOperationException("Server must be stopped before deletion");

        _context.ServerInstances.Remove(server);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> StartServerAsync(Guid serverId, Guid userId)
    {
        var server = await _context.ServerInstances
            .Where(s => s.Id == serverId && s.UserId == userId)
            .FirstOrDefaultAsync();

        if (server == null) return false;

        if (server.Status != ServerStatus.Stopped)
            throw new InvalidOperationException("Server must be stopped to start");

        server.Status = ServerStatus.Starting;
        server.LastStartedAt = DateTime.UtcNow;
        server.UpdatedAt = DateTime.UtcNow;

        // TODO: Implement actual container orchestration
        // For now, just simulate startup
        server.Status = ServerStatus.Running;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> StopServerAsync(Guid serverId, Guid userId)
    {
        var server = await _context.ServerInstances
            .Where(s => s.Id == serverId && s.UserId == userId)
            .FirstOrDefaultAsync();

        if (server == null) return false;

        if (server.Status != ServerStatus.Running)
            throw new InvalidOperationException("Server must be running to stop");

        server.Status = ServerStatus.Stopping;
        server.UpdatedAt = DateTime.UtcNow;

        // TODO: Implement actual container orchestration
        // For now, just simulate shutdown
        server.Status = ServerStatus.Stopped;
        server.LastStoppedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}