using Microsoft.EntityFrameworkCore;
using NamoreirosFinance.Domain.Core.Entities.FinancialEntry;
using NamoreirosFinance.Domain.Core.Interfaces;
using NamoreirosFinance.Domain.Core.Interfaces.Repositories;
using NamoreirosFinance.Domain.Core.Models;
using NamoreirosFinance.Infrastructure.Context;

namespace NamoreirosFinance.Infrastructure.Repositories
{
    public class FinancialEntryRepository : IFinancialEntryRepository
    {
        private readonly AppDbContext _context;
        private readonly IQueryRequestHandler<FinancialEntry> _queryHandler;

        public FinancialEntryRepository(AppDbContext context,
                                        IQueryRequestHandler<FinancialEntry> queryHandler)
        {
            _context = context;
            _queryHandler = queryHandler;
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

        public Task<PagedResult<FinancialEntry>> GetPaged(QueryRequest request)
        {
            var query = _context.FinancialEntries.AsNoTracking();
            query = _queryHandler.ApplyRequest(query, request);

            return _queryHandler.GetPagedResult(query, request);
        }
    }
}
