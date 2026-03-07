namespace MapApi.Domain.ValueObjects;

public sealed record GeoCoordinate
{
    public double Longitude { get; }
    public double Latitude { get; }

    public GeoCoordinate(double longitude, double latitude)
    {
        if (longitude < -180 || longitude > 180)
            throw new ArgumentOutOfRangeException(nameof(longitude), longitude, "Longitude must be between -180 and 180.");
        if (latitude < -90 || latitude > 90)
            throw new ArgumentOutOfRangeException(nameof(latitude), latitude, "Latitude must be between -90 and 90.");

        Longitude = longitude;
        Latitude = latitude;
    }
}
