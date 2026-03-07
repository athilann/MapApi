using MapApi.Domain.ValueObjects;
using Xunit;

namespace MapApi.Domain.Tests;

public class GeoCoordinateTests
{
    [Theory]
    [InlineData(0, 0)]
    [InlineData(-180, -90)]
    [InlineData(180, 90)]
    [InlineData(45.5, 12.3)]
    public void Constructor_WithValidCoordinates_ShouldSucceed(double longitude, double latitude)
    {
        var coord = new GeoCoordinate(longitude, latitude);
        Assert.Equal(longitude, coord.Longitude);
        Assert.Equal(latitude, coord.Latitude);
    }

    [Theory]
    [InlineData(-181, 0)]
    [InlineData(181, 0)]
    public void Constructor_WithInvalidLongitude_ShouldThrowArgumentOutOfRangeException(double longitude, double latitude)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new GeoCoordinate(longitude, latitude));
    }

    [Theory]
    [InlineData(0, -91)]
    [InlineData(0, 91)]
    public void Constructor_WithInvalidLatitude_ShouldThrowArgumentOutOfRangeException(double longitude, double latitude)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new GeoCoordinate(longitude, latitude));
    }
}
