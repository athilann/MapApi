using System.ComponentModel.DataAnnotations;

namespace MapApi.Application.DTOs;

public sealed record FilterMapObjectsRequest
{
    [Required, Range(-180, 180)]
    public required double Longitude { get; init; }

    [Required, Range(-90, 90)]
    public required double Latitude { get; init; }

    [Required, Range(1, double.MaxValue)]
    public required double RadiusInMeters { get; init; }

    [StringLength(100)]
    public string? Id { get; init; }

    [StringLength(200)]
    public string? Name { get; init; }

    [StringLength(1000)]
    public string? Description { get; init; }
}
