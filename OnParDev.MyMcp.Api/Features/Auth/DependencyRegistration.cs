namespace OnParDev.MyMcp.Api.Features.Auth;

public static class DependencyRegistration
{
    public static IServiceCollection AddAuthFeature(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }
}