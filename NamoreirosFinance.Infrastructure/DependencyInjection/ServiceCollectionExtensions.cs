using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NamoreirosFinance.Application.Common.Request.Handlers;
using NamoreirosFinance.Domain.Core.Entities.FinancialEntry;
using NamoreirosFinance.Domain.Core.Interfaces;
using NamoreirosFinance.Domain.Core.Interfaces.Repositories;
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
                options.UseNpgsql(configuration.GetConnectionString("NamoreirosFinanceDB")).ConfigureWarnings(warnings => warnings.Log(RelationalEventId.PendingModelChangesWarning));
            });

            services.TryAddScoped<IFinancialEntryRepository, FinancialEntryRepository>();
            services.TryAddScoped<IQueryRequestHandler<FinancialEntry>, FinancialEntryQueryHandler>();

            return services;
        }
    }
}
