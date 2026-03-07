# MapApi

A Clean Architecture Map API built with .NET 10 Minimal API and MongoDB that returns objects to plot on a map with longitude and latitude.

## Architecture

The solution follows Clean Architecture principles with strict separation of concerns:

```
src/
├── MapApi.Domain/          # Innermost layer - zero external dependencies
├── MapApi.Application/     # Use cases, DTOs, interfaces, mapping
├── MapApi.Infrastructure/  # MongoDB implementation (adapter)
└── MapApi.Api/             # Presentation - Minimal API endpoints
tests/
├── MapApi.Domain.Tests/
├── MapApi.Application.Tests/
├── MapApi.Infrastructure.Tests/
└── MapApi.Api.Tests/
```

## Prerequisites

- .NET 10 SDK
- MongoDB (or Docker)

## Running Locally

1. Start MongoDB:
```bash
docker-compose up -d
```

2. Run the API:
```bash
cd src/MapApi.Api
dotnet run
```

3. Open the OpenAPI document at `https://localhost:{port}/openapi/v1.json`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/map-objects?longitude={lon}&latitude={lat}&radiusInMeters={r}` | Get map objects in area |
| GET | `/api/map-objects/{id}` | Get map object by ID |
| POST | `/api/map-objects` | Create a new map object |

### POST /api/map-objects

Request body:
```json
{
  "name": "Eiffel Tower",
  "description": "Famous Paris landmark",
  "longitude": 2.2945,
  "latitude": 48.8584
}
```

## Technology Stack

- **.NET 10** Minimal API
- **MongoDB** with GeoJSON & Geospatial Indexes (2dsphere)
- **xUnit** for testing
- No AutoMapper (manual static mappers)
- No FluentValidation (System.ComponentModel.DataAnnotations)
