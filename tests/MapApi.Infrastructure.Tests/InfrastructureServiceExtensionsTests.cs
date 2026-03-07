using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MapApi.Domain.Repositories;
using MapApi.Infrastructure.Extensions;
using Xunit;

namespace MapApi.Infrastructure.Tests;

public class InfrastructureServiceExtensionsTests
{
    [Fact]
    public void AddInfrastructure_ShouldRegisterRequiredServices()
    {
        var services = new ServiceCollection();
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:MongoDB"] = "mongodb://localhost:27017",
                ["DatabaseName"] = "test_db"
            })
            .Build();

        services.AddInfrastructure(config);

        var provider = services.BuildServiceProvider();
        var repository = provider.GetService<IMapObjectRepository>();
        Assert.NotNull(repository);
    }
}
