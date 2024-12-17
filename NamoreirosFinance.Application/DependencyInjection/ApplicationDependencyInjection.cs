using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NamoreirosFinance.Application.Interfaces;
using NamoreirosFinance.Application.Services;

namespace NamoreirosFinance.Application.DependencyInjection
{
    public static class ApplicationDependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.TryAddScoped<IFinancialEntryService, FinancialEntryService>();
            return services;
        }
    }
}
