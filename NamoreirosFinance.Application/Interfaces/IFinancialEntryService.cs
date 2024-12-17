using NamoreirosFinance.Domain.Core.Entities.Transaction;

namespace NamoreirosFinance.Application.Interfaces
{
    public interface IFinancialEntryService
    {
        Task Add(FinancialEntry financialEntry);
        Task<FinancialEntry> GetById(int id);
        Task<List<FinancialEntry>> GetAll();
        Task Update(FinancialEntry financialEntry);
        Task Delete(FinancialEntry financialEntry);
    }
}
