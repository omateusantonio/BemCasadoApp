using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NamoreirosFinance.Domain.Core.Entities.FinancialEntry;

namespace NamoreirosFinance.Infrastructure.Context;

public class AppDbContext : DbContext
{
    protected readonly IConfiguration Configuration;
    
    public AppDbContext(DbContextOptions options) : base(options)
    {

    }
    
    public DbSet<FinancialEntry> FinancialEntries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}