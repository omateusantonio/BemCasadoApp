using Microsoft.EntityFrameworkCore;
using NamoreirosFinance.Domain.Core.Entities.Transaction;
using NamoreirosFinance.Infrastructure.Context;

namespace NamoreirosFinance.Infrastructure.Repositories
{
    public class FinancialEntryRepository : IRepository<FinancialEntry>
    {
        private readonly AppDbContext _context;
        public FinancialEntryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task Add(FinancialEntry entry)
        {
            await _context.FinancialEntries.AddAsync(entry);
            await _context.SaveChangesAsync();
        }

        public async Task<List<FinancialEntry>> GetAll()
        {
            return await _context.FinancialEntries
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        public async Task<FinancialEntry> GetById(int id)
        {
            return await _context.FinancialEntries.FindAsync(id);
        }

        public async Task Update(FinancialEntry entry)
        {
            _context.FinancialEntries.Update(entry);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(FinancialEntry entry)
        {
            _context.FinancialEntries.Remove(entry);
            await _context.SaveChangesAsync();
        }

    }
}
