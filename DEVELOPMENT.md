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