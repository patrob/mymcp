// Test comment for dotnet format
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.StaticFiles;
using System.Text;
using OnParDev.MyMcp.Api.Infrastructure.Data;
using OnParDev.MyMcp.Api.Features.Auth;
using OnParDev.MyMcp.Api.Features.Servers;
using OnParDev.MyMcp.Api.Features.McpServers;
using OnParDev.MyMcp.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


// Add authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Clerk:Authority"];
        options.Audience = builder.Configuration["Clerk:Audience"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true
        };
    });

builder.Services.AddAuthorization();

// Add FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });

    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://yourdomain.com") // Replace with actual production domain
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add feature services
builder.Services.AddAuthFeature();
builder.Services.AddServersFeature();
builder.Services.AddMcpServersFeature();


var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

// Apply security headers
app.Use(async (context, next) =>
{
    // Content Security Policy for Clerk integration
    var csp = "default-src 'self'; " +
              "connect-src 'self' https://clerk-telemetry.com https://*.clerk.accounts.dev https://*.accounts.dev https://api.clerk.dev https://api.clerk.com https://clerk.com; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https://*.clerk.accounts.dev https://*.accounts.dev; " +
              "font-src 'self' data:; " +
              "frame-src https://*.clerk.accounts.dev https://*.accounts.dev";

    context.Response.Headers.Append("Content-Security-Policy", csp);
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

    await next();
});

// Enable CORS
app.UseCors(app.Environment.IsDevelopment() ? "Development" : "Production");

// Configure static files with no-cache headers
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Disable caching for all static files to ensure immediate updates
        ctx.Context.Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
        ctx.Context.Response.Headers.Append("Pragma", "no-cache");
        ctx.Context.Response.Headers.Append("Expires", "0");
    }
});

app.UseAuthentication();
app.UseAuthorization();

// Map feature endpoints
app.MapServersEndpoints();
app.MapMcpServersEndpoints();

// Health check endpoint
app.MapGet("/api/v1/health", () => new { Status = "Healthy", Timestamp = DateTime.UtcNow })
   .WithName("GetHealth")
   .WithOpenApi();

// Configuration endpoint
app.MapGet("/api/v1/config", () => new ConfigurationResponse
{
    Clerk = new ClerkConfiguration
    {
        PublishableKey = app.Configuration["Clerk:PublishableKey"] ?? "",
        Authority = app.Configuration["Clerk:Authority"] ?? "",
        AfterSignOutUrl = "/"
    },
    Api = new ApiConfiguration
    {
        BaseUrl = app.Configuration["Api:BaseUrl"] ?? "http://localhost:5099",
        Version = "v1"
    },
    Features = new FeatureConfiguration
    {
        EnableAuth = !string.IsNullOrEmpty(app.Configuration["Clerk:PublishableKey"]),
        EnableAnalytics = app.Configuration.GetValue<bool>("Features:EnableAnalytics", false)
    }
})
.WithName("GetConfiguration")
.WithOpenApi(operation => new(operation)
{
    Summary = "Get application configuration",
    Description = "Returns client-side configuration including authentication settings, API endpoints, and feature flags"
});

app.MapFallbackToFile("index.html");

app.Run();

public partial class Program { }
