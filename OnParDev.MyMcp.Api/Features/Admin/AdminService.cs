using Microsoft.EntityFrameworkCore;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Infrastructure.Data;

namespace OnParDev.MyMcp.Api.Features.Admin;

public interface IAdminService
{
    Task<bool> IsUserAdminAsync(string clerkUserId);
    Task<List<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(Guid userId);
    Task PromoteUserToAdminAsync(Guid userId);
    Task DemoteUserToRegularAsync(Guid userId);
}

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _context;

    public AdminService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> IsUserAdminAsync(string clerkUserId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.ClerkUserId == clerkUserId);

        return user?.Role == UserRole.Admin;
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _context.Users
            .Include(u => u.ServerInstances)
            .OrderBy(u => u.CreatedAt)
            .ToListAsync();
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _context.Users
            .Include(u => u.ServerInstances)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task PromoteUserToAdminAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new InvalidOperationException($"User with ID {userId} not found");

        user.Role = UserRole.Admin;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task DemoteUserToRegularAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new InvalidOperationException($"User with ID {userId} not found");

        user.Role = UserRole.User;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }
}