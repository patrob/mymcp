using OnParDev.MyMcp.Api.Features.McpServers.Services;

namespace OnParDev.MyMcp.Api.Features.McpServers;

public static class DependencyRegistration
{
    public static IServiceCollection AddMcpServersFeature(this IServiceCollection services)
    {
        // Register services with proper lifetime management
        services.AddScoped<IMcpServerProvisioningService, McpServerProvisioningService>();
        services.AddScoped<IServerInstanceRepository, ServerInstanceRepository>();
        services.AddScoped<IContainerSpecRepository, ContainerSpecRepository>();
        services.AddScoped<IMcpServerTemplateRepository, McpServerTemplateRepository>();
        services.AddScoped<IUsageTracker, UsageTracker>();
        
        // Register mock container orchestrator for now
        // TODO: Replace with real implementation (DockerContainerOrchestrator)
        services.AddScoped<IContainerOrchestrator, MockContainerOrchestrator>();
        
        return services;
    }
}