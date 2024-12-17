using NamoreirosFinance.Domain.Core.Entities.Transaction;

namespace NamoreirosFinance.Application.Interfaces
{
    public interface IFinancialEntryService
    {
        Task<FinancialEntry> CreateAsync(FinancialEntry financialEntry);
        Task<FinancialEntry> GetByIdAsync(int id);
        Task<List<FinancialEntry>> GetAllAsync();
        Task UpdateAsync(FinancialEntry financialEntry);
        Task DeleteAsync(int id);
    }
}
