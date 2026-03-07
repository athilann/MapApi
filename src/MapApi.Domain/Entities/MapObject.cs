using MapApi.Domain.ValueObjects;

namespace MapApi.Domain.Entities;

public class MapObject
{
    public string Id { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public GeoCoordinate Location { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }

    private MapObject() { }

    public static MapObject Create(string name, string description, GeoCoordinate location)
    {
        return new MapObject
        {
            Name = name,
            Description = description,
            Location = location,
            CreatedAt = DateTime.UtcNow
        };
    }

    // For repository reconstitution
    public static MapObject Reconstitute(string id, string name, string description, GeoCoordinate location, DateTime createdAt)
    {
        return new MapObject
        {
            Id = id,
            Name = name,
            Description = description,
            Location = location,
            CreatedAt = createdAt
        };
    }

    public void SetId(string id)
    {
        Id = id;
    }
}
