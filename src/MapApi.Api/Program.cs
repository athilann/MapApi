using MapApi.Api.Endpoints;
using MapApi.Application.UseCases;
using MapApi.Infrastructure.Extensions;
using MapApi.Infrastructure.MongoDB.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddScoped<GetMapObjectsInAreaUseCase>();
builder.Services.AddScoped<GetMapObjectByIdUseCase>();
builder.Services.AddScoped<CreateMapObjectUseCase>();

builder.Services.AddOpenApi();

var app = builder.Build();

// Ensure geospatial indexes
var database = app.Services.GetRequiredService<MongoDB.Driver.IMongoDatabase>();
await MongoGeoIndexConfig.EnsureIndexesAsync(database);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "MapApi v1");
    });
}

app.UseHttpsRedirection();

app.MapMapObjectEndpoints();

app.Run();

public partial class Program { }
