using OnParDev.MyMcp.Api.Domain.Entities;

namespace OnParDev.MyMcp.Api.Features.McpServers.Entities;

public static class GitHubMcpServerTemplate
{
    public static McpServerTemplate Create()
    {
        return new McpServerTemplate
        {
            Id = Guid.NewGuid(),
            Name = "GitHub MCP Server",
            Description = "Access GitHub repositories, issues, pull requests, and manage GitHub workflows through MCP protocol",
            Version = "1.0.0",
            Category = "Version Control",
            DocumentationUrl = "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
            RepositoryUrl = "https://github.com/modelcontextprotocol/servers",
            IsOfficial = true,
            Capabilities = CreateCapabilities(),
            DefaultConfiguration = CreateDefaultConfiguration(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private static List<McpServerCapability> CreateCapabilities()
    {
        return new List<McpServerCapability>
        {
            new()
            {
                Name = "Repository Access",
                Description = "Access repository information, files, and metadata",
                IsRequired = true
            },
            new()
            {
                Name = "Issue Management", 
                Description = "Create, read, update issues and comments",
                IsRequired = false
            },
            new()
            {
                Name = "Pull Request Management",
                Description = "Manage pull requests, reviews, and merge operations",
                IsRequired = false
            },
            new()
            {
                Name = "File Operations",
                Description = "Read, write, and manage repository files and directories",
                IsRequired = false
            },
            new()
            {
                Name = "Branch Management",
                Description = "Create, delete, and manage repository branches",
                IsRequired = false
            }
        };
    }

    private static Dictionary<string, object> CreateDefaultConfiguration()
    {
        return new Dictionary<string, object>
        {
            ["GITHUB_TOKEN"] = "",
            ["GITHUB_REPOSITORY"] = ""
        };
    }
}

public class GitHubMcpServerConfiguration
{
    public string? GitHubToken { get; set; }
    public string? Repository { get; set; }

    public bool IsValid()
    {
        return !string.IsNullOrEmpty(GitHubToken);
    }

    public Dictionary<string, string> GetEnvironmentVariables()
    {
        var envVars = new Dictionary<string, string>
        {
            ["GITHUB_TOKEN"] = GitHubToken ?? ""
        };

        if (!string.IsNullOrEmpty(Repository))
        {
            envVars["GITHUB_REPOSITORY"] = Repository;
        }

        return envVars;
    }
}