# Development Guidelines

## Security & Configuration Management

### Sensitive Configuration Rules

**ALL sensitive configuration must be stored in BOTH locations:**

1. **Local Development**: `dotnet user-secrets`
2. **CI/CD**: GitHub repository secrets

### Adding New Sensitive Configuration

When adding any new API keys, secrets, or sensitive configuration:

#### 1. Local Development Setup
```bash
cd OnParDev.MyMcp.Api
dotnet user-secrets set "SectionName:KeyName" "secret_value"
```

#### 2. GitHub Secrets Setup
```bash
gh secret set SECTION_KEYNAME --body "secret_value"
```

#### 3. Configuration File Updates
- Add empty placeholder in `appsettings.json`:
  ```json
  {
    "SectionName": {
      "KeyName": ""
    }
  }
  ```
- **NEVER** put actual secret values in any `.json` config files

### Naming Conventions

| Location | Format | Example |
|----------|---------|---------|
| User Secrets | `Section:Key` | `Clerk:PublishableKey` |
| GitHub Secrets | `SECTION_KEY` | `CLERK_PUBLISHABLE_KEY` |
| appsettings.json | `Section:Key` (empty) | `"PublishableKey": ""` |

### Current Secrets Inventory

| Purpose | User Secret | GitHub Secret | Required For |
|---------|-------------|---------------|--------------|
| Clerk Auth | `Clerk:PublishableKey` | `CLERK_PUBLISHABLE_KEY` | Authentication |
| Clerk Auth | `Clerk:Authority` | `CLERK_AUTHORITY` | Authentication |

### Agent/AI Development Instructions

When working with this codebase:

1. **NEVER** commit actual secret values to any files
2. **ALWAYS** use `dotnet user-secrets` for local development
3. **ALWAYS** add corresponding GitHub secrets using `gh secret set`
4. **ALWAYS** leave empty placeholders in config files
5. **ALWAYS** update the secrets inventory in this document

### Verification Commands

**Check local user secrets:**
```bash
cd OnParDev.MyMcp.Api
dotnet user-secrets list
```

**Check GitHub secrets:**
```bash
gh secret list
```

**Test configuration loading:**
```bash
curl http://localhost:5099/api/v1/config
```

### CI/CD Integration

In GitHub Actions workflows, secrets are accessed as environment variables:

```yaml
env:
  # Double underscore (__) replaces colon (:) in .NET configuration
  CLERK__PUBLISHABLEKEY: ${{ secrets.CLERK_PUBLISHABLE_KEY }}
  CLERK__AUTHORITY: ${{ secrets.CLERK_AUTHORITY }}
```

## Coding Standards - Level 100

### Code Quality Requirements
- **No duplication** (including tests)
- **Ticket # in commit message** for traceability
- **No commented out code** - delete unused code
- **Methods have 10 or fewer lines** (including test methods)
- **Methods have 3 or fewer parameters**
- **Classes have 7 or fewer public members** (Single Responsibility)
- **No method calls or logic in constructors**
- **No checked exceptions** (Java/.NET equivalent)

### Naming Conventions
- **Classes** are named using a **noun or noun phrase**
- **Methods** are named using a **verb or verb phrase**
- **Variable and field names** are **pronounceable**
- **Only 1 level of inheritance**

## Coding Standards - Level 200

### Advanced Design Principles
- **Only inherit from abstract classes or interfaces**
- **No name decorations** (avoid FooImpl, FooService suffixes)
- **No getter/setters on Interfaces**
- **No constant interfaces**
- **No public constants**

### Method Design Patterns
- **Query methods don't throw exceptions**
- **Query methods don't change state**
- **Command methods change state**
- **Command methods throw exceptions when state is unable to be changed**
- **Factory methods over constructors**

## Unit Test Standards - Level 100

### Test Quality Requirements
- **No assertNotNull()** - use more specific assertions
- **No @Ignore tests** - fix or delete broken tests
- **3 or fewer assertions per test method**
- **No mocked static methods**
- **Methods have 10 or fewer lines** (including test methods)

## Unit Test Standards - Level 200

### Advanced Testing Principles
- **Arrange, Act, Assert** pattern required
- **No uncovered lines** - 100% code coverage goal
- **Prefer state-based testing** - prefer stubs over mocks
- **No duplication in test code**

### Arrange, Act, Assert (AAA) Pattern
```typescript
it('should return user when valid ID is provided', () => {
  // Arrange
  const userId = 'user123'
  const expectedUser = { id: userId, name: 'John Doe' }
  mockUserService.getUser.mockReturnValue(expectedUser)

  // Act
  const result = userController.getUser(userId)

  // Assert
  expect(result).toEqual(expectedUser)
})
```

## Architecture Principles

### Backend-Driven Configuration

- All frontend configuration comes from `/api/v1/config` endpoint
- No `.env` files in the React application
- Configuration is dynamically loaded at runtime
- Features can be enabled/disabled based on available configuration

### Type-Safe API Integration

- TypeScript API client auto-generated from OpenAPI spec
- Run `npm run generate-api` to regenerate after backend changes
- All API calls are fully typed and validated

### Security Best Practices

- Secrets never in source control
- Dual storage (local + GitHub) for all sensitive config
- Empty placeholders in config files for documentation
- Dynamic feature enablement based on available configuration