# OnParDev MyMcp

A full-stack TypeScript + .NET 9 application for managing MCP (Model Context Protocol) server instances.

## Architecture

### Backend (.NET 9)
- **ASP.NET Core 9** with Minimal APIs
- **RESTful APIs** with `/api/v1` versioned route prefix  
- **EF Core** with PostgreSQL for data access
- **Flyway** for SQL migrations
- **FluentValidation** for request/DTO validation
- **Scalar** for OpenAPI documentation (replaces Swashbuckle)
- **Domain-Driven Design** with vertical slice architecture
- **Clerk** for authentication (JWT Bearer tokens)

### Frontend (React + TypeScript)
- **React 18** with **TypeScript**
- **Vite** for build tooling and development server
- **Tailwind CSS** + **shadcn/ui** for styling
- **React Router** for client-side routing  
- **React Query** for server state management
- **Clerk** for authentication (GitHub/Google SSO)
- **Vitest** for unit testing

### Infrastructure
- **PostgreSQL** database via Docker
- **Docker Compose** for local development
- **SPA proxy** in development (BFF pattern)
- **ASP.NET** serves React app in production

## Project Structure

```
OnParDev.MyMcp/
├── OnParDev.MyMcp.Api/              # Main backend + frontend host
│   ├── ClientApp/                   # React frontend
│   │   ├── src/
│   │   │   ├── components/ui/       # shadcn/ui components
│   │   │   ├── pages/              # Route components
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   └── lib/                # Utilities
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── Domain/Entities/             # Domain entities
│   ├── Features/                    # Vertical slice features
│   │   ├── Auth/                   # Authentication feature
│   │   └── Servers/                # Server management feature
│   ├── Infrastructure/Data/         # DbContext and data access
│   └── Program.cs
├── OnParDev.MyMcp.Api.UnitTests/    # Unit tests (xUnit + AutoFixture + NSubstitute)
├── OnParDev.MyMcp.Api.IntegrationTests/  # Integration tests (Testcontainers)
├── db/migrations/                   # Flyway SQL migrations
└── docker-compose.yml              # PostgreSQL container
```

## Getting Started

### Prerequisites
- .NET 9 SDK
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (via Docker)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd mymcp
```

### 2. Start Database

```bash
docker-compose up postgres -d
```

This starts PostgreSQL on `localhost:5432` with:
- Database: `onpardev_mymcp`
- Username: `postgres` 
- Password: `postgres`

### 3. Run Migrations

```bash
docker-compose up flyway
```

### 4. Configure Authentication

Create `OnParDev.MyMcp.Api/ClientApp/.env`:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Update `appsettings.json` with your Clerk configuration:

```json
{
  "Clerk": {
    "Authority": "https://your-clerk-domain.clerk.accounts.dev",
    "Audience": "your-audience"
  }
}
```

### 5. Start Development Servers

**Terminal 1 - Start Backend:**
```bash
cd OnParDev.MyMcp.Api
dotnet run
```

**Terminal 2 - Start Frontend:**
```bash
cd OnParDev.MyMcp.Api/ClientApp
npm run dev
```

**Access the application at `https://localhost:7221`**

The SPA proxy configuration automatically:
- Routes API requests (`/api/*`) to the .NET backend
- Routes all other requests to the React dev server on port 5173
- Eliminates CORS issues during development
- Provides hot reload for both frontend and backend

## Domain Entities

- **User** - Application users (linked to Clerk)
- **ServerInstance** - Individual MCP server deployments
- **ContainerSpec** - Container configuration templates
- **McpServerTemplate** - MCP server type definitions
- **ServerLog** - Runtime logs from server instances
- **DeploymentAudit** - Deployment history and status

## API Endpoints

### Authentication
- Health check: `GET /api/v1/health`

### Servers
- `GET /api/v1/servers` - List user's servers
- `POST /api/v1/servers` - Create new server
- `GET /api/v1/servers/{id}` - Get server details
- `PUT /api/v1/servers/{id}` - Update server
- `DELETE /api/v1/servers/{id}` - Delete server
- `POST /api/v1/servers/{id}/start` - Start server
- `POST /api/v1/servers/{id}/stop` - Stop server

## Testing

### Unit Tests
```bash
cd OnParDev.MyMcp.Api.UnitTests
dotnet test
```

### Integration Tests  
```bash
cd OnParDev.MyMcp.Api.IntegrationTests
dotnet test
```

Integration tests use Testcontainers to spin up PostgreSQL automatically.

### Frontend Tests
```bash
cd OnParDev.MyMcp.Api/ClientApp
npm run test
```

## Development

### Backend Development
- Uses Entity Framework migrations for schema changes
- Vertical slice architecture - each feature in its own folder
- FluentValidation for request validation
- Scalar for API documentation at `/scalar`

### Frontend Development  
- Vite dev server with HMR
- SPA proxy handles routing during development
- Tailwind CSS with shadcn/ui components
- React Query for API state management

### SPA Proxy Benefits
- Access both frontend and API through single URL (`https://localhost:7221`)
- Automatic routing: API calls to `/api/*` go to backend, all other routes to React
- No CORS issues during development
- Hot reload for both frontend and backend
- Production-like routing behavior

### Database Changes
1. Update entity models in `Domain/Entities/`
2. Create new Flyway migration in `db/migrations/`
3. Run `docker-compose up flyway` to apply

## Production Deployment

```bash
dotnet publish -c Release
```

This will:
1. Build the React frontend (`npm run build`)
2. Copy built assets to `wwwroot/`
3. Create deployment package with integrated SPA

The ASP.NET backend serves the React SPA in production.

## TODO

- [ ] Set up Clerk authentication configuration
- [ ] Add OpenAPI client generation for frontend
- [ ] Implement container orchestration (Docker/Kubernetes)
- [ ] Add OpenTelemetry observability
- [ ] Seed data for development