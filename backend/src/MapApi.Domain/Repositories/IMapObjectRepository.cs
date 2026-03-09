using MapApi.Domain.Entities;
using MapApi.Domain.ValueObjects;

namespace MapApi.Domain.Repositories;

public interface IMapObjectRepository
{
    Task<MapObject?> GetByIdAsync(string id, CancellationToken ct = default);
    Task<IReadOnlyList<MapObject>> GetInAreaAsync(GeoCoordinate center, double radiusInMeters, CancellationToken ct = default);
    Task<MapObject> CreateAsync(MapObject mapObject, CancellationToken ct = default);
}
