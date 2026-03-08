using System.ComponentModel.DataAnnotations;

namespace MapApi.Application.DTOs;

public sealed record GetMapObjectsInAreaRequest
{
    [Required, Range(-180, 180)]
    public required double Longitude { get; init; }

    [Required, Range(-90, 90)]
    public required double Latitude { get; init; }

    [Required, Range(1, double.MaxValue)]
    public required double RadiusInMeters { get; init; }
}
