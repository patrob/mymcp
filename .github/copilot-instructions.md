# GitHub Copilot Instructions for OnParDev MyMcp

## Project Overview

This is OnParDev MyMcp, a full-stack application for managing MCP (Model Context Protocol) server instances. The project combines modern web technologies with enterprise-grade patterns.

**Technology Stack:**
- Backend: ASP.NET Core 9, PostgreSQL, Entity Framework Core
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Authentication: Clerk (optional, feature-flagged)
- Development: SPA Proxy pattern, OpenAPI code generation

## Core Architecture Principles

Use vertical slice architecture where each feature is contained in `/Features/{FeatureName}/` directories. Implement backend-driven configuration with all frontend settings coming from `/api/v1/config` endpoint. Never use `.env` files in the React application.

Follow the SPA proxy pattern for development where the ASP.NET Core backend serves the React frontend and handles API requests through a single port.

Generate TypeScript API clients from OpenAPI specifications. Always run `npm run generate-api` after making backend changes. Never hand-code API calls in the frontend.

## Universal Coding Standards

Methods must have 10 or fewer lines including test methods. Methods must have 3 or fewer parameters. Classes must have 7 or fewer public members to maintain Single Responsibility Principle.

Never include commented out code in commits. Always include ticket numbers in commit messages for traceability.

Use pronounceable names for variables and fields. Name classes using nouns or noun phrases. Name methods using verbs or verb phrases.

Maintain only 1 level of inheritance. Avoid duplication in both production code and tests.

## Security and Configuration Management

Never generate actual secret values, API keys, or sensitive configuration in code. Use empty placeholders in `appsettings.json` files.

For local development, reference the user-secrets pattern: `dotnet user-secrets set "SectionName:KeyName" "value"`. For CI/CD, reference GitHub secrets: `gh secret set SECTION_KEYNAME --body "value"`.

Always store sensitive configuration in both user secrets (local) and GitHub secrets (CI/CD). Update the secrets inventory in DEVELOPMENT.md when adding new secrets.

## Feature Flag and Configuration Patterns

Implement dynamic feature enablement based on available configuration. Use conditional rendering in React components: `{config?.features?.enableAuth && config?.clerk?.publishableKey ? <AuthComponent /> : <NonAuthComponent />}`.

Create strongly-typed configuration response classes instead of anonymous types for OpenAPI generation. Follow the pattern:
```csharp
app.MapGet("/api/v1/config", () => new ConfigurationResponse
{
    Clerk = new ClerkConfiguration { /* ... */ },
    Features = new FeatureConfiguration { /* ... */ }
});
```

## Testing Standards

Follow the Arrange, Act, Assert pattern with clear comments in all tests. Limit tests to 3 or fewer assertions per test method. Never use `assertNotNull()` - use more specific assertions.

Never commit tests with `@Ignore` or `it.skip()` - fix or delete broken tests. Never mock static methods.

Prefer state-based testing over mocks when possible. Use stubs over mocks for better maintainability.

Create helper functions for test data generation to avoid duplication: `createMockConfig()`, `createMockUser()`, etc.

## Development Workflow

Read existing code patterns before implementing new features. Search the codebase extensively using file patterns to understand established conventions.

Update related documentation when making changes. Run all tests after implementing changes. Verify that the application builds and runs correctly.

When adding new features, consider both authenticated and unauthenticated states. Test edge cases and error conditions.

## Quality Assurance

Aim for 100% code coverage with meaningful tests. Ensure no uncovered lines in critical business logic.

Maintain consistent code style across the entire codebase. Follow the established patterns rather than introducing new approaches.

Validate that generated code follows the project's conventions and standards before accepting suggestions.