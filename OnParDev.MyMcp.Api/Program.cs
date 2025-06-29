using Microsoft.EntityFrameworkCore;
using FluentValidation;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using OnParDev.MyMcp.Api.Infrastructure.Data;
using OnParDev.MyMcp.Api.Features.Auth;
using OnParDev.MyMcp.Api.Features.Servers;

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

// Enable CORS
app.UseCors(app.Environment.IsDevelopment() ? "Development" : "Production");

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

// Map feature endpoints
app.MapServersEndpoints();

// Health check endpoint
app.MapGet("/api/v1/health", () => new { Status = "Healthy", Timestamp = DateTime.UtcNow })
   .WithName("GetHealth")
   .WithOpenApi();

// Configuration endpoint
app.MapGet("/api/v1/config", () => new
{
    Clerk = new
    {
        PublishableKey = app.Configuration["Clerk:PublishableKey"] ?? "",
        Authority = app.Configuration["Clerk:Authority"] ?? ""
    },
    Api = new
    {
        BaseUrl = app.Configuration["Api:BaseUrl"] ?? "http://localhost:5099",
        Version = "v1"
    },
    Features = new
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
