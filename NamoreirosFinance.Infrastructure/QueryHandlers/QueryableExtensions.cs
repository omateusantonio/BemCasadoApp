using NamoreirosFinance.Domain.Core.Interfaces;
using NamoreirosFinance.Domain.Core.Models;

namespace NamoreirosFinance.Infrastructure.QueryHandlers
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> ApplyRequests<T>(this IQueryable<T> query, QueryRequest request, IQueryRequestHandler<T> handler) where T : class
        {
            return handler.ApplyRequest(query, request);
        }

        public static Task<PagedResult<T>> ToPagedResult<T>(this IQueryable<T> query, QueryRequest request, IQueryRequestHandler<T> handler) where T : class
        {
            return handler.GetPagedResult(query, request);
        }
    }
}
