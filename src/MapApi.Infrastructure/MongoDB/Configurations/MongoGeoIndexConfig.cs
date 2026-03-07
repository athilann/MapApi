using MongoDB.Driver;

namespace MapApi.Infrastructure.MongoDB.Configurations;

public static class MongoGeoIndexConfig
{
    public static async Task EnsureIndexesAsync(IMongoDatabase database)
    {
        var collection = database.GetCollection<MongoMapObjectDocument>("map_objects");
        var indexKeysDefinition = Builders<MongoMapObjectDocument>.IndexKeys
            .Geo2DSphere(d => d.Location);
        var indexModel = new CreateIndexModel<MongoMapObjectDocument>(indexKeysDefinition);
        await collection.Indexes.CreateOneAsync(indexModel);
    }
}
