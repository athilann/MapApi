using System.ComponentModel.DataAnnotations;
using MapApi.Application.DTOs;
using Xunit;

namespace MapApi.Application.Tests;

public class GetMapObjectsInAreaRequestTests
{
    [Fact]
    public void Properties_ShouldHaveCorrectValidationAttributes()
    {
        var lonRange = typeof(GetMapObjectsInAreaRequest).GetProperty(nameof(GetMapObjectsInAreaRequest.Longitude))!
            .GetCustomAttributes(typeof(RangeAttribute), false).Cast<RangeAttribute>().Single();
        var latRange = typeof(GetMapObjectsInAreaRequest).GetProperty(nameof(GetMapObjectsInAreaRequest.Latitude))!
            .GetCustomAttributes(typeof(RangeAttribute), false).Cast<RangeAttribute>().Single();
        var radRange = typeof(GetMapObjectsInAreaRequest).GetProperty(nameof(GetMapObjectsInAreaRequest.RadiusInMeters))!
            .GetCustomAttributes(typeof(RangeAttribute), false).Cast<RangeAttribute>().Single();

        Assert.Equal(-180.0, Convert.ToDouble(lonRange.Minimum));
        Assert.Equal(180.0, Convert.ToDouble(lonRange.Maximum));

        Assert.Equal(-90.0, Convert.ToDouble(latRange.Minimum));
        Assert.Equal(90.0, Convert.ToDouble(latRange.Maximum));

        Assert.Equal(1.0, Convert.ToDouble(radRange.Minimum));
    }

    [Fact]
    public void ValidationAttributes_ShouldBeOnProperties_NotConstructorParameters()
    {
        // Ensures validation attributes are on properties (not constructor params)
        // which is required for OpenAPI schema generation in .NET 10
        var constructors = typeof(GetMapObjectsInAreaRequest).GetConstructors();
        foreach (var ctor in constructors)
        {
            foreach (var param in ctor.GetParameters())
            {
                var rangeAttrs = param.GetCustomAttributes(typeof(RangeAttribute), false);
                Assert.Empty(rangeAttrs);
            }
        }
    }

    [Fact]
    public void Request_ShouldBeCreatable_WithRequiredProperties()
    {
        var request = new GetMapObjectsInAreaRequest
        {
            Longitude = 10.5,
            Latitude = 20.3,
            RadiusInMeters = 1000
        };

        Assert.Equal(10.5, request.Longitude);
        Assert.Equal(20.3, request.Latitude);
        Assert.Equal(1000, request.RadiusInMeters);
    }

    [Fact]
    public void Validation_ShouldFail_ForInvalidLongitude()
    {
        var request = new GetMapObjectsInAreaRequest
        {
            Longitude = 200,
            Latitude = 20.3,
            RadiusInMeters = 1000
        };

        var context = new ValidationContext(request);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(request, context, results, validateAllProperties: true);

        Assert.False(isValid);
    }

    [Fact]
    public void Validation_ShouldPass_ForValidRequest()
    {
        var request = new GetMapObjectsInAreaRequest
        {
            Longitude = 10.5,
            Latitude = 20.3,
            RadiusInMeters = 1000
        };

        var context = new ValidationContext(request);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(request, context, results, validateAllProperties: true);

        Assert.True(isValid);
    }
}
