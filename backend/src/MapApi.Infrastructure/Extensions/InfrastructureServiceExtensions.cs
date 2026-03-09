using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using MapApi.Domain.Repositories;
using MapApi.Infrastructure.MongoDB;

namespace MapApi.Infrastructure.Extensions;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoDB") ?? "mongodb://localhost:27017";
        var databaseName = configuration["DatabaseName"] ?? "map_api";

        services.AddSingleton<IMongoClient>(new MongoClient(connectionString));
        services.AddSingleton<IMongoDatabase>(sp =>
        {
            var client = sp.GetRequiredService<IMongoClient>();
            return client.GetDatabase(databaseName);
        });

        services.AddScoped<IMapObjectRepository, MongoMapObjectRepository>();

        return services;
    }
}
