using NamoreirosFinance.Application.Common.Request;
using NamoreirosFinance.Domain.Core.Models;

namespace NamoreirosFinance.Domain.Core.Interfaces
{
    public interface IQueryRequestHandler<T> where T : class
    {
        public IQueryable<T> ApplyRequest(IQueryable<T> query, QueryRequest request);
        public Task<PagedResult<T>> GetPagedResult(IQueryable<T> query, QueryRequest request);
    }
}
