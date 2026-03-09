using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using MapApi.Domain.Entities;
using MapApi.Domain.Repositories;
using MapApi.Domain.ValueObjects;

namespace MapApi.Infrastructure.MongoDB;

internal class MongoMapObjectRepository : IMapObjectRepository
{
    private readonly IMongoCollection<MongoMapObjectDocument> _collection;

    public MongoMapObjectRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<MongoMapObjectDocument>("map_objects");
    }

    public async Task<IReadOnlyList<MapObject>> GetInAreaAsync(GeoCoordinate center, double radiusInMeters, CancellationToken ct = default)
    {
        var point = GeoJson.Point(new GeoJson2DGeographicCoordinates(center.Longitude, center.Latitude));
        var filter = Builders<MongoMapObjectDocument>.Filter.NearSphere(
            d => d.Location,
            point,
            radiusInMeters);

        var documents = await _collection.Find(filter).ToListAsync(ct);
        return documents.Select(d => d.ToDomain()).ToList().AsReadOnly();
    }

    public async Task<IReadOnlyList<MapObject>> FilterAsync(
        GeoCoordinate center, double radiusInMeters,
        string? id = null, string? name = null, string? description = null,
        CancellationToken ct = default)
    {
        var builder = Builders<MongoMapObjectDocument>.Filter;
        var point = GeoJson.Point(new GeoJson2DGeographicCoordinates(center.Longitude, center.Latitude));

        var filters = new List<FilterDefinition<MongoMapObjectDocument>>
        {
            builder.NearSphere(d => d.Location, point, radiusInMeters)
        };

        if (!string.IsNullOrWhiteSpace(id))
            filters.Add(builder.Eq(d => d.Id, id));

        if (!string.IsNullOrWhiteSpace(name))
            filters.Add(builder.Regex(d => d.Name, new BsonRegularExpression(System.Text.RegularExpressions.Regex.Escape(name), "i")));

        if (!string.IsNullOrWhiteSpace(description))
            filters.Add(builder.Regex(d => d.Description, new BsonRegularExpression(System.Text.RegularExpressions.Regex.Escape(description), "i")));

        var combined = builder.And(filters);
        var documents = await _collection.Find(combined).ToListAsync(ct);
        return documents.Select(d => d.ToDomain()).ToList().AsReadOnly();
    }

    public async Task<MapObject> CreateAsync(MapObject mapObject, CancellationToken ct = default)
    {
        var document = MongoMapObjectDocument.FromDomain(mapObject);
        await _collection.InsertOneAsync(document, null, ct);
        mapObject.SetId(document.Id);
        return mapObject;
    }
}
