using NamoreirosFinance.Domain.Core.Entities.Transaction;
using NamoreirosFinance.Domain.Core.Repositories;

namespace NamoreirosFinance.Application.Services
{
    public class FinancialEntryService : IFinancialEntryRepository
    {
        private static IFinancialEntryRepository _repository;

        public FinancialEntryService(IFinancialEntryRepository repository)
        {
            _repository = repository;
        }

        public async Task Add(FinancialEntry financialEntry)
        {
            await _repository.Add(financialEntry);
        }

        public async Task Delete(FinancialEntry financialEntry)
        {
            await _repository.Delete(financialEntry);
        }

        public async Task<List<FinancialEntry>> GetAll()
        {
            var entries = await _repository.GetAll();
            return entries;
        }

        public async Task<FinancialEntry> GetById(int id)
        {
            var entry = await _repository.GetById(id);
            return entry;
        }

        public async Task Update(FinancialEntry financialEntry)
        {
            _repository.Update(financialEntry);
        }
    }
}
