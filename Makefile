.PHONY: fmt lint test test-integration test-e2e test-all clean clean-all install build dev-setup help

# Default target
.DEFAULT_GOAL := help

# Format code
fmt:
	@echo "🔧 Formatting .NET code..."
	dotnet format --verbosity minimal
	@echo "🔧 Formatting frontend code..."
	cd OnParDev.MyMcp.Api/ClientApp && npm run lint -- --fix
	@echo "✅ All code formatted!"

# Lint code
lint:
	@echo "🔍 Linting .NET code..."
	dotnet format --verify-no-changes --verbosity minimal
	@echo "🔍 Linting frontend code..."
	cd OnParDev.MyMcp.Api/ClientApp && npm run lint
	@echo "✅ All linting passed!"

# Run unit tests only
test:
	@echo "🧪 Installing dependencies..."
	dotnet restore
	cd OnParDev.MyMcp.Api/ClientApp && npm ci
	@echo "🧪 Building solution..."
	dotnet build --no-restore
	@echo "🧪 Running .NET unit tests..."
	dotnet test OnParDev.MyMcp.Api.UnitTests --no-build --collect:"XPlat Code Coverage" --settings coverlet.runsettings
	@echo "🧪 Running frontend unit tests..."
	cd OnParDev.MyMcp.Api/ClientApp && npm run test
	@echo "✅ All tests passed!"

# Run integration tests (requires Docker)
test-integration:
	@echo "🧪 Running integration tests (requires Docker)..."
	dotnet test OnParDev.MyMcp.Api.IntegrationTests --no-build --collect:"XPlat Code Coverage" --settings coverlet.runsettings

# Run all tests including integration
test-all: test test-integration

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	dotnet clean
	cd OnParDev.MyMcp.Api/ClientApp && npm run clean || rm -rf dist

# Full clean including dependencies
clean-all: clean
	@echo "🧹 Cleaning all dependencies..."
	rm -rf OnParDev.MyMcp.Api/ClientApp/node_modules
	find . -name "bin" -type d -exec rm -rf {} +
	find . -name "obj" -type d -exec rm -rf {} +

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	dotnet restore
	cd OnParDev.MyMcp.Api/ClientApp && npm ci

# Build everything
build: install
	@echo "🏗️  Building solution..."
	dotnet build --no-restore
	cd OnParDev.MyMcp.Api/ClientApp && npm run build

# Development setup
dev-setup: install
	@echo "🚀 Setting up development environment..."
	cd OnParDev.MyMcp.Api/ClientApp && npm run predev

# Show help
help:
	@echo "Available targets:"
	@echo "  fmt              - Format .NET and frontend code"
	@echo "  lint             - Lint .NET and frontend code"
	@echo "  test             - Run unit tests only"
	@echo "  test-integration - Run integration tests (requires Docker)"
	@echo "  test-all         - Run all tests"
	@echo "  clean            - Clean build artifacts"
	@echo "  clean-all        - Clean all dependencies"
	@echo "  install          - Install dependencies"
	@echo "  build            - Build solution"
	@echo "  dev-setup        - Set up development environment"
	@echo "  help             - Show this help message"