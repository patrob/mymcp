using OnParDev.MyMcp.Api.Domain.Entities;

namespace OnParDev.MyMcp.Api.Features.Admin.DTOs;

public record UserListDto(
    Guid Id,
    string Email,
    string? FirstName,
    string? LastName,
    UserRole Role,
    int ServerInstanceCount,
    DateTime CreatedAt
);

public record UserDetailDto(
    Guid Id,
    string ClerkUserId,
    string Email,
    string? FirstName,
    string? LastName,
    UserRole Role,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<ServerInstanceSummaryDto> ServerInstances
);

public record ServerInstanceSummaryDto(
    Guid Id,
    string Name,
    string Status,
    DateTime CreatedAt
);

public record PromoteUserRequest(Guid UserId);
public record DemoteUserRequest(Guid UserId);