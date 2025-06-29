---
applyTo: "**/*.tsx,**/*.ts"
---

# TypeScript and React Instructions for OnParDev MyMcp

## Generated API Client Usage

Always use the generated TypeScript API client from OpenAPI specifications. Never hand-code API calls using fetch or axios.

Import from the generated client: `import { OnParDevMyMcpApiService } from '@/api/services/OnParDevMyMcpApiService'`.

Use the generated types: `import type { ConfigurationResponse } from '@/api/models/ConfigurationResponse'`.

Regenerate API client after backend changes: `npm run generate-api`.

## Backend-Driven Configuration

All frontend configuration must come from the `/api/v1/config` endpoint. Never use `.env` files or hardcoded configuration values.

Use the ConfigurationContext to access configuration: `const { config, isLoading } = useConfiguration()`.

Implement feature flags using configuration: `config?.features?.enableAuth && config?.clerk?.publishableKey`.

Check for loading states before accessing configuration properties to avoid undefined errors.

## React 18 Patterns

Use functional components with hooks. Avoid class components unless specifically required for error boundaries.

Use `React.StrictMode` in development. Handle double-rendering in useEffect hooks properly.

Implement proper loading and error states for all data fetching operations.

Use `React.memo()` for expensive components that receive stable props.

## Feature Flag Conditional Rendering

Always check feature flags before rendering authentication-related components:
```tsx
{config?.features?.enableAuth && config?.clerk?.publishableKey ? (
  <ClerkProvider publishableKey={config.clerk.publishableKey}>
    <AuthenticatedApp />
  </ClerkProvider>
) : (
  <PublicApp />
)}
```

Implement graceful degradation when features are disabled. Show appropriate fallback UI.

Test both enabled and disabled states for all feature-flagged components.

## Clerk Authentication Integration

Wrap authenticated features with `<ClerkProvider>` only when `enableAuth` is true and `publishableKey` exists.

Use Clerk components: `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<UserButton>`.

Configure `SignInButton` with `mode="modal"` for better UX.

Pass `afterSignOutUrl` from configuration to `UserButton` and `ClerkProvider`.

## Tailwind CSS and shadcn/ui Patterns

Use Tailwind utility classes for styling. Avoid custom CSS unless absolutely necessary.

Import shadcn/ui components from `@/components/ui/`. Follow the established component patterns.

Use CSS variables for theming: `bg-background`, `text-foreground`, `border-border`.

Implement responsive design with Tailwind breakpoints: `md:`, `lg:`, `xl:`.

## State Management

Use React Query (`@tanstack/react-query`) for server state management. Configure appropriate cache times and stale times.

Use React Context for application-wide state like configuration and authentication status.

Use local component state (`useState`) for UI-specific state that doesn't need to be shared.

Avoid prop drilling by using Context or lifting state to appropriate common ancestors.

## TypeScript Best Practices

Enable strict mode in `tsconfig.json`. Use proper typing for all props, state, and function parameters.

Use interfaces for object shapes: `interface ComponentProps { title: string; isActive: boolean; }`.

Use union types for specific value sets: `type Mode = 'light' | 'dark'`.

Import types explicitly: `import type { ConfigurationResponse } from '@/api/models/ConfigurationResponse'`.

## Component Structure

Organize components in `/src/components/` with subfolders for related components.

Place page components in `/src/pages/` directory.

Create layout components in `/src/components/layouts/` for shared page structures.

Use index files to create clean import paths: `export { Component } from './Component'`.

## Testing with Vitest and React Testing Library

Create test files adjacent to components with `.test.tsx` suffix.

Use Vitest and React Testing Library: `import { render, screen } from '@testing-library/react'`.

Mock external dependencies with `vi.mock()`: `vi.mock('@clerk/clerk-react', () => ({ ... }))`.

Follow AAA pattern with clear comments in all tests:
```tsx
it('shows sign in button when auth is enabled', () => {
  // Arrange
  const config = createMockConfig({ features: { enableAuth: true } })
  mockUseConfiguration.mockReturnValue({ config, isLoading: false })

  // Act
  render(<Component />)

  // Assert
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
})
```

## Error Handling and Loading States

Implement proper error boundaries using React error boundaries for component-level error handling.

Show loading spinners or skeleton components during data fetching. Use consistent loading patterns across the application.

Handle network errors gracefully with user-friendly error messages.

Use React Query's error and loading states: `const { data, isLoading, error } = useQuery(...)`.

## Performance Optimization

Use `React.lazy()` for code splitting large components or pages.

Implement proper memoization with `useMemo()` and `useCallback()` for expensive computations.

Optimize bundle size by importing only needed utilities from libraries.

Use React Query's caching to minimize redundant API calls.

## Accessibility

Use semantic HTML elements: `<button>`, `<nav>`, `<main>`, `<header>`, `<footer>`.

Include proper ARIA labels and roles for interactive elements.

Ensure keyboard navigation works properly for all interactive components.

Test with screen readers and maintain proper focus management.

## Development Workflow

Use TypeScript strict mode and fix all type errors before committing.

Run `npm run lint` and `npm run typecheck` before submitting code.

Use meaningful component and function names that describe their purpose.

Keep components small and focused on a single responsibility.