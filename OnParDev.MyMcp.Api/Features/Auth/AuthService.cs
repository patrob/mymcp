using Microsoft.EntityFrameworkCore;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Infrastructure.Data;
using System.Security.Claims;

namespace OnParDev.MyMcp.Api.Features.Auth;

public interface IAuthService
{
    Task<User> GetOrCreateUserAsync(ClaimsPrincipal claimsPrincipal);
    Task<User?> GetUserByIdAsync(Guid userId);
    Task<User?> GetUserByClerkIdAsync(string clerkUserId);
}

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> GetOrCreateUserAsync(ClaimsPrincipal claimsPrincipal)
    {
        var clerkUserId = claimsPrincipal.FindFirst("sub")?.Value
                         ?? throw new InvalidOperationException("User ID not found in claims");

        var email = claimsPrincipal.FindFirst("email")?.Value
                   ?? throw new InvalidOperationException("Email not found in claims");

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.ClerkUserId == clerkUserId);

        if (existingUser != null)
        {
            // Update email if it has changed
            if (existingUser.Email != email)
            {
                existingUser.Email = email;
                existingUser.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            return existingUser;
        }

        // Create new user
        var user = new User
        {
            Id = Guid.NewGuid(),
            ClerkUserId = clerkUserId,
            Email = email,
            FirstName = claimsPrincipal.FindFirst("given_name")?.Value,
            LastName = claimsPrincipal.FindFirst("family_name")?.Value,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<User?> GetUserByClerkIdAsync(string clerkUserId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.ClerkUserId == clerkUserId);
    }
}