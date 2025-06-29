namespace OnParDev.MyMcp.Api.Models;

public class ConfigurationResponse
{
    public ClerkConfiguration Clerk { get; set; } = new();
    public ApiConfiguration Api { get; set; } = new();
    public FeatureConfiguration Features { get; set; } = new();
}

public class ClerkConfiguration
{
    public string PublishableKey { get; set; } = string.Empty;
    public string Authority { get; set; } = string.Empty;
    public string AfterSignOutUrl { get; set; } = "/";
}

public class ApiConfiguration
{
    public string BaseUrl { get; set; } = string.Empty;
    public string Version { get; set; } = "v1";
}

public class FeatureConfiguration
{
    public bool EnableAuth { get; set; }
    public bool EnableAnalytics { get; set; }
}