namespace OnParDev.MyMcp.Api.Features.Configuration.Entities;

public enum ConfigurationType
{
    FreeTierRequestLimit = 0,
    IndividualTierRequestLimit = 1,
    TeamTierRequestLimit = 2,
    SystemMaintenance = 3,
    FeatureFlag = 4
}

public class ConfigurationSetting
{
    public Guid Id { get; set; }
    public required string Key { get; set; }
    public required string Value { get; set; }
    public required ConfigurationType Type { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Helper methods for type-safe value retrieval
    public int GetIntValue() => int.Parse(Value);
    public bool GetBoolValue() => bool.Parse(Value);
    public decimal GetDecimalValue() => decimal.Parse(Value);
    public DateTime GetDateTimeValue() => DateTime.Parse(Value);
}