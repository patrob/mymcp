using OnParDev.MyMcp.Api.Domain.Entities;

namespace OnParDev.MyMcp.Api.Features.Servers.DTOs;

public record ServerInstanceDto(
    Guid Id,
    string Name,
    string? Description,
    Guid UserId,
    Guid McpServerTemplateId,
    Guid ContainerSpecId,
    ServerStatus Status,
    string? ContainerInstanceId,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? LastStartedAt,
    DateTime? LastStoppedAt
);

public record CreateServerInstanceDto(
    string Name,
    string? Description,
    Guid McpServerTemplateId,
    Guid ContainerSpecId
);

public record UpdateServerInstanceDto(
    string? Name,
    string? Description
);

public record ServerInstanceSummaryDto(
    Guid Id,
    string Name,
    ServerStatus Status,
    DateTime CreatedAt,
    DateTime? LastStartedAt
);