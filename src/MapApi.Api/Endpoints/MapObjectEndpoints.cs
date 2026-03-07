using MapApi.Api.Filters;
using MapApi.Application.DTOs;
using MapApi.Application.UseCases;

namespace MapApi.Api.Endpoints;

public static class MapObjectEndpoints
{
    public static void MapMapObjectEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/map-objects")
            .WithTags("MapObjects");

        group.MapGet("/", async (
            [AsParameters] GetMapObjectsInAreaRequest request,
            GetMapObjectsInAreaUseCase useCase,
            CancellationToken ct) =>
        {
            var results = await useCase.ExecuteAsync(request.Longitude, request.Latitude, request.RadiusInMeters, ct);
            return Results.Ok(results);
        })
        .AddEndpointFilter<ValidationFilter<GetMapObjectsInAreaRequest>>()
        .WithName("GetMapObjectsInArea")
        .WithSummary("Get map objects in area");

        group.MapGet("/{id}", async (
            string id,
            GetMapObjectByIdUseCase useCase,
            CancellationToken ct) =>
        {
            var result = await useCase.ExecuteAsync(id, ct);
            return result is null ? Results.NotFound() : Results.Ok(result);
        })
        .WithName("GetMapObjectById")
        .WithSummary("Get map object by ID");

        group.MapPost("/", async (
            CreateMapObjectRequest request,
            CreateMapObjectUseCase useCase,
            CancellationToken ct) =>
        {
            var result = await useCase.ExecuteAsync(request, ct);
            return Results.Created($"/api/map-objects/{result.Id}", result);
        })
        .AddEndpointFilter<ValidationFilter<CreateMapObjectRequest>>()
        .WithName("CreateMapObject")
        .WithSummary("Create a new map object");
    }
}
