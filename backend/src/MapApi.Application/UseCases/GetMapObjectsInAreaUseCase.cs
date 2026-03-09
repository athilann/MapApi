using MapApi.Application.DTOs;
using MapApi.Application.Mapping;
using MapApi.Domain.Repositories;
using MapApi.Domain.ValueObjects;

namespace MapApi.Application.UseCases;

public class GetMapObjectsInAreaUseCase
{
    private readonly IMapObjectRepository _repository;

    public GetMapObjectsInAreaUseCase(IMapObjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<MapObjectResponse>> ExecuteAsync(
        double longitude, double latitude, double radiusInMeters, CancellationToken ct = default)
    {
        var center = new GeoCoordinate(longitude, latitude);
        var mapObjects = await _repository.GetInAreaAsync(center, radiusInMeters, ct);
        return mapObjects.Select(MapObjectMapper.ToResponse).ToList().AsReadOnly();
    }
}
