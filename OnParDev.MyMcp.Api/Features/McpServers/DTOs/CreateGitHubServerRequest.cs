using OnParDev.MyMcp.Api.Domain.Entities;

namespace OnParDev.MyMcp.Api.Features.McpServers.DTOs;

public record CreateGitHubServerRequest
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required string GitHubToken { get; init; }
    public string? Repository { get; init; }
}

public record ServerHealthResponse
{
    public required bool IsHealthy { get; init; }
    public required ServerStatus Status { get; init; }
    public required DateTime LastChecked { get; init; }
    public string? ErrorMessage { get; init; }
}