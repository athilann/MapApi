using MapApi.Application.Mapping;
using MapApi.Domain.Entities;
using MapApi.Domain.ValueObjects;
using Xunit;

namespace MapApi.Application.Tests;

public class MapObjectMapperTests
{
    [Fact]
    public void ToResponse_ShouldMapCorrectly()
    {
        var location = new GeoCoordinate(10.5, 20.3);
        var mapObject = MapObject.Create("Test", "Description", location);
        mapObject.SetId("test-id");

        var response = MapObjectMapper.ToResponse(mapObject);

        Assert.Equal("test-id", response.Id);
        Assert.Equal("Test", response.Name);
        Assert.Equal("Description", response.Description);
        Assert.Equal(10.5, response.Longitude);
        Assert.Equal(20.3, response.Latitude);
    }
}
