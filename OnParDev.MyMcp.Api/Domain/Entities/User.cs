namespace OnParDev.MyMcp.Api.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public required string ClerkUserId { get; set; }
    public required string Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public ICollection<ServerInstance> ServerInstances { get; set; } = new List<ServerInstance>();
}