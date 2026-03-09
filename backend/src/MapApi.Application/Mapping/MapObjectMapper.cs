using MapApi.Application.DTOs;
using MapApi.Domain.Entities;

namespace MapApi.Application.Mapping;

public static class MapObjectMapper
{
    public static MapObjectResponse ToResponse(MapObject entity)
    {
        return new MapObjectResponse(
            entity.Id,
            entity.Name,
            entity.Description,
            entity.Location.Longitude,
            entity.Location.Latitude,
            entity.CreatedAt);
    }
}
