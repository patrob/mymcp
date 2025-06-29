namespace OnParDev.MyMcp.Api.Domain.Entities;

public class ContainerSpec
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string ImageName { get; set; }
    public required string ImageTag { get; set; }
    public int CpuLimit { get; set; } = 1000; // milliCPU
    public int MemoryLimit { get; set; } = 512; // MB
    public Dictionary<string, string> EnvironmentVariables { get; set; } = new();
    public List<ContainerPort> Ports { get; set; } = new();
    public List<ContainerVolume> Volumes { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public ICollection<ServerInstance> ServerInstances { get; set; } = new List<ServerInstance>();
}

public class ContainerPort
{
    public int Port { get; set; }
    public int? HostPort { get; set; }
    public string Protocol { get; set; } = "TCP";
}

public class ContainerVolume
{
    public required string HostPath { get; set; }
    public required string ContainerPath { get; set; }
    public bool ReadOnly { get; set; } = false;
}