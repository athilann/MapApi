using MapApi.Api.Endpoints;
using MapApi.Application.UseCases;
using MapApi.Infrastructure.Extensions;
using MapApi.Infrastructure.MongoDB.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddScoped<GetMapObjectsInAreaUseCase>();
builder.Services.AddScoped<CreateMapObjectUseCase>();
builder.Services.AddScoped<FilterMapObjectsUseCase>();

builder.Services.AddOpenApi();

var corsOriginsConfig = builder.Configuration["Cors:AllowedOrigins"] ?? "*";
var allowedOrigins = corsOriginsConfig
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins.Length == 1 && allowedOrigins[0] == "*")
        {
            policy.AllowAnyOrigin();
        }
        else
        {
            policy.WithOrigins(allowedOrigins);
        }

        policy.AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Ensure geospatial indexes
var database = app.Services.GetRequiredService<MongoDB.Driver.IMongoDatabase>();
await MongoGeoIndexConfig.EnsureIndexesAsync(database);

app.MapOpenApi();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/openapi/v1.json", "MapApi v1");
});

app.UseCors();

app.UseHttpsRedirection();

app.MapMapObjectEndpoints();

app.Run();

public partial class Program { }
