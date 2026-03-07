using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;
using MapApi.Domain.Entities;
using MapApi.Domain.ValueObjects;

namespace MapApi.Infrastructure.MongoDB;

internal class MongoMapObjectDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("location")]
    public GeoJsonPoint<GeoJson2DGeographicCoordinates> Location { get; set; } = null!;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }

    public MapObject ToDomain()
    {
        var location = new GeoCoordinate(Location.Coordinates.Longitude, Location.Coordinates.Latitude);
        return MapObject.Reconstitute(Id, Name, Description, location, CreatedAt);
    }

    public static MongoMapObjectDocument FromDomain(MapObject mapObject)
    {
        return new MongoMapObjectDocument
        {
            Id = string.IsNullOrEmpty(mapObject.Id) ? ObjectId.GenerateNewId().ToString() : mapObject.Id,
            Name = mapObject.Name,
            Description = mapObject.Description,
            Location = GeoJson.Point(new GeoJson2DGeographicCoordinates(mapObject.Location.Longitude, mapObject.Location.Latitude)),
            CreatedAt = mapObject.CreatedAt
        };
    }
}
