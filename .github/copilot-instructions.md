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

## 🚨 AUTOMATED CHECKS ARE MANDATORY

**ALL hook issues are BLOCKING - EVERYTHING must be ✅ GREEN!**  
No errors. No formatting issues. No linting problems. Zero tolerance.  
These are not suggestions. Fix ALL issues before continuing.

## CRITICAL WORKFLOW - ALWAYS FOLLOW THIS!

### Research → Plan → Implement

**NEVER JUMP STRAIGHT TO CODING!** Always follow this sequence:

1. **Research**: Explore the codebase, understand existing patterns
2. **Plan**: Create a detailed implementation plan
3. **Implement**: Execute the plan with validation checkpoints

When asked to implement any feature, first research the codebase and create a plan before implementing.

### Reality Checkpoints

**Stop and validate** at these moments:

- After implementing a complete feature
- Before starting a new major component
- When something feels wrong
- Before declaring "done"
- **WHEN HOOKS FAIL WITH ERRORS** ❌

Run: `make fmt && make test && make lint`

### 🚨 CRITICAL: Hook Failures Are BLOCKING

**When hooks report ANY issues (exit code 2), you MUST:**

1. **STOP IMMEDIATELY** - Do not continue with other tasks
2. **FIX ALL ISSUES** - Address every ❌ issue until everything is ✅ GREEN
3. **VERIFY THE FIX** - Re-run the failed command to confirm it's fixed
4. **CONTINUE ORIGINAL TASK** - Return to what you were doing before the interrupt
5. **NEVER IGNORE** - There are NO warnings, only requirements

This includes:

- Formatting issues (`dotnet format`, prettier, etc.)
- Linting violations (.NET analyzers, eslint, etc.)
- Forbidden patterns (`Thread.Sleep`, excessive `console.log`, `any` types)
- ALL other checks

Your code must be 100% clean. No exceptions.

## TypeScript & .NET Best Practices

### FORBIDDEN - NEVER DO THESE:

- **NO `any` or `object`** types – use explicit generics or interfaces
- **NO busy waits** like `setTimeout` polling – rely on `async/await` or event-driven code
- **NO** keeping old and new code together
- **NO** migration functions or compatibility layers
- **NO** versioned method names (`ProcessV2`, `HandleNew`)
- **NO** custom error hierarchies beyond standard exception types
- **NO** TODO comments in final code

> **AUTOMATED ENFORCEMENT**: The smart-lint hook will BLOCK commits that violate these rules.
> When you see `❌ FORBIDDEN PATTERN`, you MUST fix it immediately!

### Required Standards:

- **Delete** old code when replacing it
- **Meaningful names**: `userId` not `id`
- **Early returns** to reduce nesting
- **Dependency injection** for services and configuration
- **Async/await everywhere**: return `Task` in C# and `Promise` in TypeScript
- **Table-driven tests** (xUnit theories or Jest table tests) for complex logic

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

### Testing Strategy

- Complex business logic → Write tests first
- Simple CRUD → Write tests after
- Hot paths → Add benchmarks
- Skip tests for main() and simple CLI parsing

### Our code is complete when:

- ✓ All linters pass with zero issues
- ✓ All tests pass
- ✓ Feature works end-to-end
- ✓ Old code is deleted
- ✓ XML documentation on all public APIs

## Development Workflow

Read existing code patterns before implementing new features. Search the codebase extensively using file patterns to understand established conventions.

Update related documentation when making changes. Run all tests after implementing changes. Verify that the application builds and runs correctly.

When adding new features, consider both authenticated and unauthenticated states. Test edge cases and error conditions.

## Performance & Security

### **Measure First**:

- No premature optimization
- Benchmark before claiming something is faster
- Use BenchmarkDotNet or Node performance tools for real bottlenecks

### **Security Always**:

- Validate all inputs
- Use `RandomNumberGenerator` in .NET or Node's `crypto` module for randomness
- Prepared statements for SQL (never concatenate!)

## Quality Assurance

Aim for 100% code coverage with meaningful tests. Ensure no uncovered lines in critical business logic.

Maintain consistent code style across the entire codebase. Follow the established patterns rather than introducing new approaches.

Validate that generated code follows the project's conventions and standards before accepting suggestions.

## Architecture Decision Records (ADRs)

Document all architecturally significant decisions using Architecture Decision Records. An ADR captures a single architectural decision and its rationale, helping future developers understand why choices were made.

### ADR Structure

Each ADR should include:

- **Problem statement with context** - What decision needs to be made and why
- **Options considered** - Alternative approaches evaluated
- **Decision outcome** - The chosen solution
- **Important tradeoffs** - What was gained/lost with this decision
- **Confidence level** - How certain we are about this decision

### ADR Process

- **Start early** - Begin ADRs at project onset
- **Maintain throughout** - Keep updating as the project evolves
- **Append-only log** - Never delete or modify existing ADRs
- **Store openly** - Keep ADRs with project documentation for easy access
- **Stay focused** - Keep records pithy, assertive, and factual

### When to Create ADRs

Create ADRs for decisions that:

- Have significant impact on system architecture
- Affect multiple components or teams
- Involve important technology choices
- Include significant tradeoffs
- May need to be revisited later

### ADR Template

Use a consistent template for all ADRs. Break complex decisions into multiple ADRs if needed (short-term, mid-term, long-term approaches).

Reference: [Microsoft Learn ADR Guide](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record) and [ADR Templates](https://adr.github.io/)
