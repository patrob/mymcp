using Microsoft.EntityFrameworkCore;
using OnParDev.MyMcp.Api.Features.Usage.Entities;
using OnParDev.MyMcp.Api.Infrastructure.Data;

namespace OnParDev.MyMcp.Api.Features.McpServers.Services;

public class UsageTracker : IUsageTracker
{
    private readonly ApplicationDbContext _context;

    public UsageTracker(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task TrackServerCreationAsync(Guid userId, Guid serverId)
    {
        var now = DateTime.UtcNow;
        var userUsage = await GetOrCreateUserUsageAsync(userId, now.Year, now.Month);

        // Server creation counts as 1 request for usage tracking
        userUsage.IncrementRequestCount();

        var requestLog = new RequestLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            UserUsageId = userUsage.Id,
            ServerInstanceId = serverId,
            Endpoint = "/api/v1/servers",
            Method = "POST",
            ResponseCode = 201,
            ResponseTimeMs = 0, // Will be updated by middleware
            RequestTimestamp = now
        };

        _context.RequestLogs.Add(requestLog);
        await _context.SaveChangesAsync();
    }

    public async Task TrackRequestAsync(Guid userId, Guid serverId, string endpoint, string method)
    {
        var now = DateTime.UtcNow;
        var userUsage = await GetOrCreateUserUsageAsync(userId, now.Year, now.Month);

        userUsage.IncrementRequestCount();

        var requestLog = new RequestLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            UserUsageId = userUsage.Id,
            ServerInstanceId = serverId,
            Endpoint = endpoint,
            Method = method,
            ResponseCode = 200, // Will be updated by middleware
            ResponseTimeMs = 0, // Will be updated by middleware
            RequestTimestamp = now
        };

        _context.RequestLogs.Add(requestLog);
        await _context.SaveChangesAsync();
    }

    private async Task<UserUsage> GetOrCreateUserUsageAsync(Guid userId, int year, int month)
    {
        var userUsage = await _context.UserUsages
            .FirstOrDefaultAsync(u => u.UserId == userId && u.Year == year && u.Month == month);

        if (userUsage == null)
        {
            // Find the user's active subscription
            var subscription = await _context.Subscriptions
                .Include(s => s.Plan)
                .Where(s => s.UserId == userId && s.Status == Features.Subscriptions.Entities.SubscriptionStatus.Active)
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefaultAsync();

            if (subscription == null)
            {
                throw new InvalidOperationException($"No active subscription found for user {userId}");
            }

            userUsage = new UserUsage
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                SubscriptionId = subscription.Id,
                Year = year,
                Month = month,
                RequestCount = 0,
                LastUpdated = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserUsages.Add(userUsage);
        }

        return userUsage;
    }
}