using MapApi.Application.DTOs;
using MapApi.Application.Mapping;
using MapApi.Domain.Entities;
using MapApi.Domain.Repositories;
using MapApi.Domain.ValueObjects;

namespace MapApi.Application.UseCases;

public class CreateMapObjectUseCase
{
    private readonly IMapObjectRepository _repository;

    public CreateMapObjectUseCase(IMapObjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<MapObjectResponse> ExecuteAsync(CreateMapObjectRequest request, CancellationToken ct = default)
    {
        var location = new GeoCoordinate(request.Longitude, request.Latitude);
        var mapObject = MapObject.Create(request.Name, request.Description ?? string.Empty, location);
        var created = await _repository.CreateAsync(mapObject, ct);
        return MapObjectMapper.ToResponse(created);
    }
}
