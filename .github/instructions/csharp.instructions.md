---
applyTo: "**/*.cs"
---

# C# Coding Instructions for OnParDev MyMcp

## .NET 9 Patterns

Use minimal APIs with `MapGroup()` extensions instead of controllers. Create endpoint mapping methods in feature folders: `app.MapServersEndpoints()`.

Implement dependency injection registration methods in each feature: `builder.Services.AddServersFeature()`.

Use `IResult` return types for API endpoints. Return `Results.Ok()`, `Results.NotFound()`, `Results.BadRequest()` etc.

## Vertical Slice Architecture

Organize code by feature in `/Features/{FeatureName}/` directories. Each feature should contain its own entities, DTOs, handlers, and endpoint mappings.

Keep related functionality together in the same feature folder. Avoid creating shared utility classes unless absolutely necessary.

Create feature-specific extension methods for service registration and endpoint mapping.

## Configuration Classes

Always create strongly-typed configuration classes instead of anonymous types. This ensures proper OpenAPI type generation.

Example pattern:
```csharp
public class ConfigurationResponse
{
    public ClerkConfiguration Clerk { get; set; } = new();
    public FeatureConfiguration Features { get; set; } = new();
}
```

Place configuration DTOs in `/Models/` directory. Use nullable properties for optional configuration values.

## Entity Framework Patterns

Place DbContext in `/Infrastructure/Data/` directory. Use entity configurations in separate files for complex entities.

Follow Entity Framework Core conventions for property naming and relationships. Use plural names for DbSet properties.

Implement database migrations using Entity Framework migrations, not Flyway for schema changes.

Use `async/await` for all database operations. Always use `ConfigureAwait(false)` in library code.

## Validation and Error Handling

Use FluentValidation for request validation. Create validators for each request DTO in the same feature folder.

Register validators using `AddValidatorsFromAssemblyContaining<Program>()`.

Implement global exception handling middleware. Return consistent error response formats.

Use `IResult` for API responses with appropriate HTTP status codes.

## Dependency Injection

Register services using extension methods in each feature folder. Keep registration logic close to the feature implementation.

Use appropriate service lifetimes: Singleton for stateless services, Scoped for request-scoped services, Transient for lightweight services.

Avoid constructor injection with more than 3 dependencies. Consider using facade pattern for complex dependencies.

## Security Patterns

Never hardcode secrets or connection strings. Use `IConfiguration` to access settings from user secrets or environment variables.

Implement JWT Bearer authentication using Clerk. Configure authentication in `Program.cs` with proper token validation.

Use `[Authorize]` attributes or `RequireAuthorization()` for protected endpoints.

## Testing with xUnit

Create test classes in `/OnParDev.MyMcp.Api.UnitTests/` and `/OnParDev.MyMcp.Api.IntegrationTests/` projects.

Use AutoFixture for test data generation: `var fixture = new Fixture();`. Use NSubstitute for mocking: `Substitute.For<IService>()`.

Follow AAA pattern with clear comments:
```csharp
[Fact]
public void Should_ReturnUser_When_ValidIdProvided()
{
    // Arrange
    var userId = fixture.Create<string>();
    
    // Act
    var result = service.GetUser(userId);
    
    // Assert
    result.Should().NotBeNull();
}
```

Use Testcontainers for integration tests with real PostgreSQL instances.

## Performance Considerations

Use `async/await` for I/O operations. Avoid blocking calls like `.Result` or `.Wait()`.

Implement proper cancellation token support in async methods. Pass `CancellationToken` parameters through the call chain.

Use `IMemoryCache` for frequently accessed data. Configure appropriate cache expiration policies.

## Logging and Observability

Use structured logging with `ILogger<T>`. Include relevant context in log messages.

Log at appropriate levels: Information for business events, Warning for handled exceptions, Error for unhandled exceptions.

Use log scopes for correlation: `logger.BeginScope("UserId: {UserId}", userId)`.

## API Documentation

Use OpenAPI attributes to document endpoints: `WithName()`, `WithSummary()`, `WithDescription()`.

Include example responses and error scenarios in API documentation.

Ensure all public APIs have proper XML documentation comments.