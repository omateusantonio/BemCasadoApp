using NamoreirosFinance.Domain.Core.Entities.FinancialEntry;
using NamoreirosFinance.Domain.Core.Models;

namespace NamoreirosFinance.Application.Interfaces
{
    public interface IFinancialEntryService
    {
        Task Add(FinancialEntry financialEntry);
        Task<FinancialEntry> GetById(int id);
        Task<List<FinancialEntry>> GetAll();
        Task Update(FinancialEntry financialEntry);
        Task Delete(FinancialEntry financialEntry);
        Task<PagedResult<FinancialEntry>> GetPaged(QueryRequest request);
    }
}
