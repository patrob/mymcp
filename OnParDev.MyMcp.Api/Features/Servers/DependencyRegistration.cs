using FluentValidation;
using OnParDev.MyMcp.Api.Features.Servers.Validators;

namespace OnParDev.MyMcp.Api.Features.Servers;

public static class DependencyRegistration
{
    public static IServiceCollection AddServersFeature(this IServiceCollection services)
    {
        services.AddScoped<IServersService, ServersService>();
        services.AddScoped<IValidator<DTOs.CreateServerInstanceDto>, CreateServerInstanceValidator>();
        return services;
    }
}