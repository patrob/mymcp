# Claude AI Agent Development Instructions

This file contains specific instructions for AI agents working on the OnParDev MyMcp project.

## Project Overview

This is a full-stack TypeScript + .NET 9 application for managing MCP (Model Context Protocol) server instances with:

- **Backend**: ASP.NET Core 9, PostgreSQL, EF Core, Vertical Slice Architecture
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Authentication**: Clerk (optional, feature-flagged)
- **Development**: SPA Proxy pattern, OpenAPI code generation

## Critical Development Guidelines

### Code Standards Compliance

ALL code must comply with standards defined in `DEVELOPMENT.md`:

- **Methods ≤ 10 lines** (including test methods)
- **Classes ≤ 7 public members**
- **Methods ≤ 3 parameters**
- **No duplication** in code or tests
- **Arrange, Act, Assert** pattern for all tests
- **≤ 3 assertions per test method**

### Architecture Patterns

#### Backend (.NET)

- **Vertical Slice Architecture** - features in `/Features/{FeatureName}/`
- **Minimal APIs** - avoid controllers, use `MapGroup()` extensions
- **Domain-Driven Design** - entities in `/Domain/Entities/`
- **Configuration classes** - use strongly-typed classes, no anonymous types
- **User Secrets** for local development, GitHub Secrets for CI/CD

#### Frontend (React)

- **Backend-driven configuration** - all config from `/api/v1/config` endpoint
- **Generated TypeScript clients** - run `npm run generate-api` after backend changes
- **Feature flags** - dynamic enablement based on available configuration
- **Conditional rendering** - check feature flags before showing UI components

### Testing Requirements

#### Unit Tests (.NET)

- Use **xUnit**, **AutoFixture**, **NSubstitute**
- Test classes in `/OnParDev.MyMcp.Api.UnitTests/`
- Follow AAA pattern strictly

#### Integration Tests (.NET)

- Use **Testcontainers** for PostgreSQL
- Test classes in `/OnParDev.MyMcp.Api.IntegrationTests/`
- Test full API endpoints end-to-end

#### Frontend Tests (React)

- Use **Vitest**, **React Testing Library**, **@testing-library/jest-dom**
- Mock external dependencies (Clerk, API calls)
- Test component behavior, not implementation details
- Use `createMockConfig()` helper for configuration mocking

### Development Workflow

#### Making Backend Changes

1. Create feature in `/Features/{FeatureName}/`
2. Add entities to `/Domain/Entities/` if needed
3. Update `Program.cs` for DI and endpoint mapping
4. Generate OpenAPI types: `npm run generate-api`
5. Write unit and integration tests
6. Run `dotnet test` and `npm test`

#### Making Frontend Changes

1. Check feature flags before adding UI components
2. Use generated API client types
3. Mock dependencies in tests
4. Follow AAA pattern in all tests
5. Ensure responsive design with Tailwind CSS

#### Authentication Integration

- Check `config?.features?.enableAuth && config?.clerk?.publishableKey`
- Wrap components in `<ClerkProvider>` when auth enabled
- Use `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<UserButton>` appropriately
- Test both authenticated and unauthenticated states

### Secret Management

#### Local Development

```bash
cd OnParDev.MyMcp.Api
dotnet user-secrets set "SectionName:KeyName" "value"
```

#### CI/CD Setup

```bash
gh secret set SECTION_KEYNAME --body "value"
```

#### Configuration Structure

- **appsettings.json**: Empty placeholders only
- **User Secrets**: Actual values for local development
- **GitHub Secrets**: Actual values for CI/CD
- **Environment Variables**: Runtime override capability

### Common Patterns

#### Configuration Endpoint Pattern

```csharp
app.MapGet("/api/v1/config", () => new ConfigurationResponse
{
    Clerk = new ClerkConfiguration { /* ... */ },
    Api = new ApiConfiguration { /* ... */ },
    Features = new FeatureConfiguration { /* ... */ }
});
```

#### Feature Flag Pattern (React)

```typescript
{
  config?.features?.enableAuth && config?.clerk?.publishableKey ? (
    <AuthComponent />
  ) : (
    <NonAuthComponent />
  );
}
```

#### Test Helper Pattern

```typescript
const createMockConfig = (overrides = {}) => ({
  clerk: { publishableKey: "", authority: "", afterSignOutUrl: "/" },
  api: { baseUrl: "http://localhost:5099", version: "v1" },
  features: { enableAuth: false, enableAnalytics: false },
  ...overrides,
});
```

## Project-Specific Context

### Current Features

- **Landing Page**: Public homepage with features
- **Dashboard**: Protected area (auth-gated when enabled)
- **Configuration API**: Backend-driven frontend configuration
- **Authentication**: Optional Clerk integration via feature flags

### Technology Stack

- **.NET 9**: Latest LTS version
- **React 18**: With Concurrent Features
- **TypeScript 5.6**: Strict mode enabled
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality React components
- **Vite**: Fast build tool and dev server
- **Vitest**: Fast unit test runner

### File Structure Conventions

```
OnParDev.MyMcp.Api/
├── Features/{FeatureName}/               # Vertical slices (includes models, DTOs, etc)
├── Features/{FeatureName}/Endpoints.cs   # Endpoints for feature
├── Features/{FeatureName}/Feature.cs     # Dependency Injection logic
├── Data/                                 # EF Core DbContext
├── ClientApp/                            # React frontend
│   ├── src/
│   │   ├── components/                   # Reusable components
│   │   ├── pages/                        # Route components
│   │   ├── contexts/                     # React contexts
│   │   └── api/                          # Generated API client
│   └── vitest.config.ts                  # Test configuration
└── Program.cs                            # Application entry point
```

### Performance Considerations

- **SPA Proxy**: Eliminates CORS issues in development
- **Code Splitting**: Lazy load routes and components
- **API Optimization**: Use React Query for caching
- **Bundle Size**: Monitor with `npm run build`

### Security Best Practices

- **No secrets in source control**: Use user-secrets and GitHub secrets
- **HTTPS in development**: SPA proxy handles certificates
- **JWT validation**: Clerk handles token verification
- **CORS configuration**: Separate policies for dev/prod

## Agent Behavior Guidelines

### When to Use Tools

- **Read files** before making changes to understand context
- **Search extensively** using Grep/Glob for patterns
- **Generate API types** after backend changes
- **Run tests** after making changes
- **Update documentation** when adding new features

### Code Generation Approach

- **Follow existing patterns** rather than inventing new ones
- **Maintain consistency** with established conventions
- **Test new code** thoroughly before considering it complete
- **Update related documentation** when making changes

### Problem-Solving Strategy

1. **Understand the requirement** fully before coding
2. **Search existing code** for similar patterns
3. **Plan the implementation** considering standards compliance
4. **Implement incrementally** with tests for each step
5. **Verify functionality** with comprehensive testing
6. **Update documentation** to reflect changes

Remember: Quality over speed. Follow the established patterns and standards strictly.
