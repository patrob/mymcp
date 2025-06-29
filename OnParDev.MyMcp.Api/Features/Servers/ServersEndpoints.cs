using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OnParDev.MyMcp.Api.Features.Auth;
using OnParDev.MyMcp.Api.Features.Servers.DTOs;

namespace OnParDev.MyMcp.Api.Features.Servers;

public static class ServersEndpoints
{
    public static void MapServersEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/v1/servers")
            .RequireAuthorization()
            .WithTags("Servers")
            .WithOpenApi();

        group.MapGet("/", GetServersAsync)
            .WithName("GetServers")
            .WithSummary("Get all servers for the authenticated user");

        group.MapGet("/{serverId:guid}", GetServerByIdAsync)
            .WithName("GetServerById")
            .WithSummary("Get a specific server by ID");

        group.MapPost("/", CreateServerAsync)
            .WithName("CreateServer")
            .WithSummary("Create a new server instance");

        group.MapPut("/{serverId:guid}", UpdateServerAsync)
            .WithName("UpdateServer")
            .WithSummary("Update an existing server instance");

        group.MapDelete("/{serverId:guid}", DeleteServerAsync)
            .WithName("DeleteServer")
            .WithSummary("Delete a server instance");

        group.MapPost("/{serverId:guid}/start", StartServerAsync)
            .WithName("StartServer")
            .WithSummary("Start a server instance");

        group.MapPost("/{serverId:guid}/stop", StopServerAsync)
            .WithName("StopServer")
            .WithSummary("Stop a server instance");
    }

    private static async Task<IResult> GetServersAsync(
        IServersService serversService,
        IAuthService authService,
        HttpContext context)
    {
        var user = await authService.GetOrCreateUserAsync(context.User);
        var servers = await serversService.GetUserServersAsync(user.Id);
        return Results.Ok(servers);
    }

    private static async Task<IResult> GetServerByIdAsync(
        Guid serverId,
        IServersService serversService,
        IAuthService authService,
        HttpContext context)
    {
        var user = await authService.GetOrCreateUserAsync(context.User);
        var server = await serversService.GetServerByIdAsync(serverId, user.Id);
        
        if (server == null)
            return Results.NotFound();

        return Results.Ok(server);
    }

    private static async Task<IResult> CreateServerAsync(
        [FromBody] CreateServerInstanceDto dto,
        IServersService serversService,
        IAuthService authService,
        IValidator<CreateServerInstanceDto> validator,
        HttpContext context)
    {
        var validationResult = await validator.ValidateAsync(dto);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        try
        {
            var user = await authService.GetOrCreateUserAsync(context.User);
            var server = await serversService.CreateServerAsync(dto, user.Id);
            return Results.Created($"/api/v1/servers/{server.Id}", server);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    private static async Task<IResult> UpdateServerAsync(
        Guid serverId,
        [FromBody] UpdateServerInstanceDto dto,
        IServersService serversService,
        IAuthService authService,
        HttpContext context)
    {
        var user = await authService.GetOrCreateUserAsync(context.User);
        var server = await serversService.UpdateServerAsync(serverId, dto, user.Id);
        
        if (server == null)
            return Results.NotFound();

        return Results.Ok(server);
    }

    private static async Task<IResult> DeleteServerAsync(
        Guid serverId,
        IServersService serversService,
        IAuthService authService,
        HttpContext context)
    {
        try
        {
            var user = await authService.GetOrCreateUserAsync(context.User);
            var deleted = await serversService.DeleteServerAsync(serverId, user.Id);
            
            if (!deleted)
                return Results.NotFound();

            return Results.NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    private static async Task<IResult> StartServerAsync(
        Guid serverId,
        IServersService serversService,
        IAuthService authService,
        HttpContext context)
    {
        try
        {
            var user = await authService.GetOrCreateUserAsync(context.User);
            var started = await serversService.StartServerAsync(serverId, user.Id);
            
            if (!started)
                return Results.NotFound();

            return Results.Ok(new { Message = "Server start initiated" });
        }
        catch (InvalidOperationException ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    private static async Task<IResult> StopServerAsync(
        Guid serverId,
        IServersService serversService,
        IAuthService authService,
        HttpContext context)
    {
        try
        {
            var user = await authService.GetOrCreateUserAsync(context.User);
            var stopped = await serversService.StopServerAsync(serverId, user.Id);
            
            if (!stopped)
                return Results.NotFound();

            return Results.Ok(new { Message = "Server stop initiated" });
        }
        catch (InvalidOperationException ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }
}