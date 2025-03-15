namespace NamoreirosFinance.Application.Common.Request
{
    public interface IQueryRequestHandler<T> where T : class
    {
        public IQueryable<T> ApplyRequest(IQueryable<T> query, QueryRequest request);
        Task<PagedResult<T>> GetPagedResult(IQueryable<T> query, QueryRequest request);
    }
}
