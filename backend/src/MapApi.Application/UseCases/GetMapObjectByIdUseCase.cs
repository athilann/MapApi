using MapApi.Application.DTOs;
using MapApi.Application.Mapping;
using MapApi.Domain.Repositories;

namespace MapApi.Application.UseCases;

public class GetMapObjectByIdUseCase
{
    private readonly IMapObjectRepository _repository;

    public GetMapObjectByIdUseCase(IMapObjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<MapObjectResponse?> ExecuteAsync(string id, CancellationToken ct = default)
    {
        var mapObject = await _repository.GetByIdAsync(id, ct);
        return mapObject is null ? null : MapObjectMapper.ToResponse(mapObject);
    }
}
