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

    public async Task<MapObject?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        var filter = Builders<MongoMapObjectDocument>.Filter.Eq(d => d.Id, id);
        var document = await _collection.Find(filter).FirstOrDefaultAsync(ct);
        return document?.ToDomain();
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

    public async Task<MapObject> CreateAsync(MapObject mapObject, CancellationToken ct = default)
    {
        var document = MongoMapObjectDocument.FromDomain(mapObject);
        await _collection.InsertOneAsync(document, null, ct);
        mapObject.SetId(document.Id);
        return mapObject;
    }
}
