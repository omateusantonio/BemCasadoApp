using NamoreirosFinance.Domain.Core.Entities.Transaction;

namespace NamoreirosFinance.Application.Common.Request.Handlers
{
    public class FinancialEntryQueryHandler : IQueryRequestHandler<FinancialEntry>
    {
        public IQueryable<FinancialEntry> ApplyRequest(IQueryable<FinancialEntry> query, QueryRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<PagedResult<FinancialEntry>> GetPagedResult(IQueryable<FinancialEntry> query, QueryRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
