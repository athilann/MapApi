using MapApi.Domain.Entities;
using MapApi.Domain.ValueObjects;

namespace MapApi.Domain.Repositories;

public interface IMapObjectRepository
{
    Task<MapObject?> GetByIdAsync(string id, CancellationToken ct = default);
    Task<IReadOnlyList<MapObject>> GetInAreaAsync(GeoCoordinate center, double radiusInMeters, CancellationToken ct = default);
    Task<IReadOnlyList<MapObject>> FilterAsync(
        GeoCoordinate center,
        double radiusInMeters,
        string? id = null,
        string? name = null,
        string? description = null,
        CancellationToken ct = default);
    Task<MapObject> CreateAsync(MapObject mapObject, CancellationToken ct = default);
}
