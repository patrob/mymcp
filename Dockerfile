# Build stage for Node.js frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/ClientApp

# Copy package files and install dependencies
COPY OnParDev.MyMcp.Api/ClientApp/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY OnParDev.MyMcp.Api/ClientApp/ ./
RUN npm run build:docker

# Build stage for .NET backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /app

# Copy source code
COPY . ./

# Copy built frontend assets
COPY --from=frontend-build /app/ClientApp/dist ./OnParDev.MyMcp.Api/wwwroot

# Build and publish the application (includes restore)
RUN dotnet publish OnParDev.MyMcp.Api/OnParDev.MyMcp.Api.csproj \
    -c Release \
    -o /app/publish \
    -p:SkipFrontendBuild=true

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -g 1001 appgroup && \
    useradd -r -u 1001 -g appgroup appuser

# Copy published application
COPY --from=backend-build /app/publish ./
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/v1/health || exit 1

# Start the application
ENTRYPOINT ["dotnet", "OnParDev.MyMcp.Api.dll"]