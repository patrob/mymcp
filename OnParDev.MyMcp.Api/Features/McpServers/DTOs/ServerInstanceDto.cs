using OnParDev.MyMcp.Api.Domain.Entities;

namespace OnParDev.MyMcp.Api.Features.McpServers.DTOs;

public record ServerInstanceDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required ServerStatus Status { get; init; }
    public string? ContainerInstanceId { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public DateTime? LastStartedAt { get; init; }
    public DateTime? LastStoppedAt { get; init; }
    public required McpServerTemplateDto Template { get; init; }

    public static ServerInstanceDto FromEntity(ServerInstance entity)
    {
        return new ServerInstanceDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Status = entity.Status,
            ContainerInstanceId = entity.ContainerInstanceId,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            LastStartedAt = entity.LastStartedAt,
            LastStoppedAt = entity.LastStoppedAt,
            Template = McpServerTemplateDto.FromEntity(entity.McpServerTemplate)
        };
    }
}

public record McpServerTemplateDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required string Version { get; init; }
    public required string Category { get; init; }
    public string? DocumentationUrl { get; init; }
    public string? RepositoryUrl { get; init; }
    public required bool IsOfficial { get; init; }

    public static McpServerTemplateDto FromEntity(McpServerTemplate entity)
    {
        return new McpServerTemplateDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Version = entity.Version,
            Category = entity.Category,
            DocumentationUrl = entity.DocumentationUrl,
            RepositoryUrl = entity.RepositoryUrl,
            IsOfficial = entity.IsOfficial
        };
    }
}