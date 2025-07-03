using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OnParDev.MyMcp.Api.Domain.Entities;
using OnParDev.MyMcp.Api.Features.Auth;
using OnParDev.MyMcp.Api.Infrastructure.Data;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Testcontainers.PostgreSql;

namespace OnParDev.MyMcp.Api.IntegrationTests;

public class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:16")
        .WithDatabase("testdb")
        .WithUsername("testuser")
        .WithPassword("testpass")
        .Build();

    public new HttpClient CreateClient()
    {
        var client = base.CreateClient();

        // Add test authentication header
        client.DefaultRequestHeaders.Add("Authorization", "Bearer test-token");

        return client;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the existing DbContext registration
            services.RemoveAll(typeof(DbContextOptions<ApplicationDbContext>));
            services.RemoveAll(typeof(ApplicationDbContext));

            // Add test database
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(_dbContainer.GetConnectionString()));

            // Replace AuthService with a mock that returns a test user
            services.RemoveAll<OnParDev.MyMcp.Api.Features.Auth.IAuthService>();
            services.AddSingleton<OnParDev.MyMcp.Api.Features.Auth.IAuthService, TestAuthService>();

            // Ensure database is created
            var serviceProvider = services.BuildServiceProvider();
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            context.Database.EnsureCreated();
        });

        // Override authentication/authorization configuration completely
        builder.ConfigureServices(services =>
        {
            // Add test authentication that always succeeds
            services.AddAuthentication("Test")
                .AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>("Test", options => { });

            // Completely disable authorization for integration tests
            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .RequireAssertion(_ => true)
                    .Build();

                // Replace the authorization service with one that always allows
                options.InvokeHandlersAfterFailure = false;
            });

            // Replace the authorization service to always allow
            services.AddSingleton<IAuthorizationService, AlwaysAllowAuthorizationService>();
        });

        builder.UseEnvironment("Testing");
    }

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        await _dbContainer.StopAsync();
        await base.DisposeAsync();
    }
}

public class TestAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger, UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[]
        {
            new Claim("sub", "test-user-id"),
            new Claim("email", "test@example.com"),
            new Claim("given_name", "Test"),
            new Claim("family_name", "User")
        };

        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "Test");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

public class TestAuthService : IAuthService
{
    private readonly ApplicationDbContext _context;

    public TestAuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> GetOrCreateUserAsync(ClaimsPrincipal claimsPrincipal)
    {
        // Create or return a test user
        var testUser = await _context.Users
            .FirstOrDefaultAsync(u => u.ClerkUserId == "test-user-id");

        if (testUser == null)
        {
            testUser = new User
            {
                Id = Guid.NewGuid(),
                ClerkUserId = "test-user-id",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User",
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Users.Add(testUser);
            await _context.SaveChangesAsync();
        }

        return testUser;
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<User?> GetUserByClerkIdAsync(string clerkUserId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.ClerkUserId == clerkUserId);
    }

    public async Task<User?> GetCurrentUserAsync(HttpContext context)
    {
        // For integration tests, always return the test user
        var testUser = await GetUserByClerkIdAsync("test-user-id");

        // If user doesn't exist, create one on the fly
        if (testUser == null)
        {
            testUser = new User
            {
                Id = Guid.NewGuid(),
                ClerkUserId = "test-user-id",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User",
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Users.Add(testUser);
            await _context.SaveChangesAsync();
        }

        return testUser;
    }
}

public class AlwaysAllowAuthorizationService : IAuthorizationService
{
    public Task<AuthorizationResult> AuthorizeAsync(ClaimsPrincipal user, object? resource, IEnumerable<IAuthorizationRequirement> requirements)
    {
        return Task.FromResult(AuthorizationResult.Success());
    }

    public Task<AuthorizationResult> AuthorizeAsync(ClaimsPrincipal user, object? resource, string policyName)
    {
        return Task.FromResult(AuthorizationResult.Success());
    }
}