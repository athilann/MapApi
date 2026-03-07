using System.ComponentModel.DataAnnotations;

namespace MapApi.Application.DTOs;

public sealed record CreateMapObjectRequest(
    [Required, StringLength(200, MinimumLength = 1)] string Name,
    [StringLength(1000)] string Description,
    [Required, Range(-180, 180)] double Longitude,
    [Required, Range(-90, 90)] double Latitude);
