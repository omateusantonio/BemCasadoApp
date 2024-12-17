using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NamoreirosFinance.Domain.Core.Repositories;
using NamoreirosFinance.Infrastructure.Context;
using NamoreirosFinance.Infrastructure.Repositories;

namespace NamoreirosFinance.Infrastructure.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(configuration.GetConnectionString("NamoreirosFinanceDB"));
            });

            services.TryAddScoped<IFinancialEntryRepository, FinancialEntryRepository>();
            return services;
        }
    }
}
