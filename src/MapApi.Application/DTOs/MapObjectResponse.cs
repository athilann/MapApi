namespace MapApi.Application.DTOs;

public sealed record MapObjectResponse(
    string Id,
    string Name,
    string Description,
    double Longitude,
    double Latitude,
    DateTime CreatedAt);
