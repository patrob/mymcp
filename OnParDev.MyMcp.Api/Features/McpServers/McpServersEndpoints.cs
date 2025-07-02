using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnParDev.MyMcp.Api.Features.Auth;
using OnParDev.MyMcp.Api.Features.McpServers.DTOs;
using OnParDev.MyMcp.Api.Features.McpServers.Services;

namespace OnParDev.MyMcp.Api.Features.McpServers;

public static class McpServersEndpoints
{
    public static IEndpointRouteBuilder MapMcpServersEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/mcp-servers").RequireAuthorization();

        group.MapPost("/github", CreateGitHubServerAsync)
            .WithName("CreateGitHubServer")
            .WithSummary("Create a new GitHub MCP server instance")
            .Produces<ServerInstanceDto>(201)
            .Produces<ValidationProblemDetails>(400);

        group.MapGet("/{id}", GetServerAsync)
            .WithName("GetMcpServer")
            .WithSummary("Get MCP server details")
            .Produces<ServerInstanceDto>()
            .Produces(404);

        group.MapGet("", GetUserServersAsync)
            .WithName("GetUserMcpServers")
            .WithSummary("Get all MCP servers for the current user")
            .Produces<List<ServerInstanceDto>>();

        group.MapPost("/{id}/start", StartServerAsync)
            .WithName("StartMcpServer")
            .WithSummary("Start an MCP server")
            .Produces<ServerInstanceDto>()
            .Produces(404);

        group.MapPost("/{id}/stop", StopServerAsync)
            .WithName("StopMcpServer")
            .WithSummary("Stop an MCP server")
            .Produces<ServerInstanceDto>()
            .Produces(404);

        group.MapDelete("/{id}", DeleteServerAsync)
            .WithName("DeleteMcpServer")
            .WithSummary("Delete an MCP server")
            .Produces(204)
            .Produces(404);

        group.MapGet("/{id}/health", GetServerHealthAsync)
            .WithName("GetMcpServerHealth")
            .WithSummary("Get MCP server health status")
            .Produces<ServerHealthResponse>()
            .Produces(404);

        return app;
    }

    private static async Task<IResult> CreateGitHubServerAsync(
        [FromBody] CreateGitHubServerRequest request,
        [FromServices] IMcpServerProvisioningService provisioningService,
        [FromServices] IAuthService authService,
        HttpContext context)
    {
        var user = await authService.GetCurrentUserAsync(context);
        if (user == null)
            return Results.Unauthorized();

        try
        {
            var serverInstance = await provisioningService.ProvisionGitHubServerAsync(user.Id, request);
            var dto = ServerInstanceDto.FromEntity(serverInstance);
            return Results.Created($"/api/v1/mcp-servers/{serverInstance.Id}", dto);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }

    private static async Task<IResult> GetServerAsync(
        Guid id,
        [FromServices] IServerInstanceRepository repository,
        [FromServices] IAuthService authService,
        HttpContext context)
    {
        var user = await authService.GetCurrentUserAsync(context);
        if (user == null)
            return Results.Unauthorized();

        var serverInstance = await repository.GetByIdAsync(id);
        if (serverInstance == null || serverInstance.UserId != user.Id)
            return Results.NotFound();

        var dto = ServerInstanceDto.FromEntity(serverInstance);
        return Results.Ok(dto);
    }

    private static async Task<IResult> GetUserServersAsync(
        [FromServices] IServerInstanceRepository repository,
        [FromServices] IAuthService authService,
        HttpContext context)
    {
        var user = await authService.GetCurrentUserAsync(context);
        if (user == null)
            return Results.Unauthorized();

        var servers = await repository.GetByUserIdAsync(user.Id);
        var dtos = servers.Select(ServerInstanceDto.FromEntity).ToList();
        return Results.Ok(dtos);
    }

    private static async Task<IResult> StartServerAsync(
        Guid id,
        [FromServices] IMcpServerProvisioningService provisioningService,
        [FromServices] IServerInstanceRepository repository,
        [FromServices] IAuthService authService,
        HttpContext context)
    {
        var user = await authService.GetCurrentUserAsync(context);
        if (user == null)
            return Results.Unauthorized();

        var serverInstance = await repository.GetByIdAsync(id);
        if (serverInstance == null || serverInstance.UserId != user.Id)
            return Results.NotFound();

        // For now, starting is the same as provisioning
        // In a real implementation, this would restart an existing container
        var dto = ServerInstanceDto.FromEntity(serverInstance);
        return Results.Ok(dto);
    }

    private static async Task<IResult> StopServerAsync(
        Guid id,
        [FromServices] IMcpServerProvisioningService provisioningService,
        [FromServices] IServerInstanceRepository repository,
        [FromServices] IAuthService authService,
        HttpContext context)
    {
        var user = await authService.GetCurrentUserAsync(context);
        if (user == null)
            return Results.Unauthorized();

        var serverInstance = await repository.GetByIdAsync(id);
        if (serverInstance == null || serverInstance.UserId != user.Id)
            return Results.NotFound();

        var success = await provisioningService.StopServerAsync(id);
        if (!success)
            return Results.Problem("Failed to stop server");

        // Refresh the server instance to get updated status
        serverInstance = await repository.GetByIdAsync(id);
        var dto = ServerInstanceDto.FromEntity(serverInstance!);
        return Results.Ok(dto);
    }

    private static async Task<IResult> DeleteServerAsync(
        Guid id,
        [FromServices] IServerInstanceRepository repository,
        [FromServices] IAuthService authService,
        HttpContext context)
    {
        var user = await authService.GetCurrentUserAsync(context);
        if (user == null)
            return Results.Unauthorized();

        var serverInstance = await repository.GetByIdAsync(id);
        if (serverInstance == null || serverInstance.UserId != user.Id)
            return Results.NotFound();

        var success = await repository.DeleteAsync(id);
        return success ? Results.NoContent() : Results.Problem("Failed to delete server");
    }

    private static async Task<IResult> GetServerHealthAsync(
        Guid id,
        [FromServices] IMcpServerProvisioningService provisioningService,
        [FromServices] IServerInstanceRepository repository,
        [FromServices] IAuthService authService,
        HttpContext context)
    {
        var user = await authService.GetCurrentUserAsync(context);
        if (user == null)
            return Results.Unauthorized();

        var serverInstance = await repository.GetByIdAsync(id);
        if (serverInstance == null || serverInstance.UserId != user.Id)
            return Results.NotFound();

        var health = await provisioningService.GetServerHealthAsync(id);
        return health == null ? Results.NotFound() : Results.Ok(health);
    }
}