using MapApi.Application.DTOs;
using MapApi.Application.Mapping;
using MapApi.Domain.Repositories;
using MapApi.Domain.ValueObjects;

namespace MapApi.Application.UseCases;

public class FilterMapObjectsUseCase
{
    private readonly IMapObjectRepository _repository;

    public FilterMapObjectsUseCase(IMapObjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<MapObjectResponse>> ExecuteAsync(
        FilterMapObjectsRequest request, CancellationToken ct = default)
    {
        var center = new GeoCoordinate(request.Longitude, request.Latitude);
        var mapObjects = await _repository.FilterAsync(
            center, request.RadiusInMeters, request.Id, request.Name, request.Description, ct);
        return mapObjects.Select(MapObjectMapper.ToResponse).ToList().AsReadOnly();
    }
}
