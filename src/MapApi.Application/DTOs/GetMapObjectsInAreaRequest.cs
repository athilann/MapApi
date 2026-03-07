using System.ComponentModel.DataAnnotations;

namespace MapApi.Application.DTOs;

public sealed record GetMapObjectsInAreaRequest(
    [Required, Range(-180, 180)] double Longitude,
    [Required, Range(-90, 90)] double Latitude,
    [Required, Range(1, double.MaxValue)] double RadiusInMeters);
