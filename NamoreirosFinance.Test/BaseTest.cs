using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NamoreirosFinance.Infrastructure.Context;
using NamoreirosFinance.Infrastructure.Repositories;

public class BaseTest : IDisposable
{
    protected ServiceProvider _serviceProvider;

    public BaseTest()
    {
        var services = new ServiceCollection();

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseInMemoryDatabase(Guid.NewGuid().ToString());
        });

        services.AddScoped<FinancialEntryRepository>();

        _serviceProvider = services.BuildServiceProvider();
    }

    public void Dispose()
    {
        _serviceProvider.Dispose();
    }
}