namespace OnParDev.MyMcp.Api.Domain.Entities;

public class McpServerTemplate
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string Version { get; set; }
    public required string Category { get; set; }
    public string? DocumentationUrl { get; set; }
    public string? RepositoryUrl { get; set; }
    public List<McpServerCapability> Capabilities { get; set; } = new();
    public Dictionary<string, object> DefaultConfiguration { get; set; } = new();
    public bool IsOfficial { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<ServerInstance> ServerInstances { get; set; } = new List<ServerInstance>();
}

public class McpServerCapability
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsRequired { get; set; } = false;
}