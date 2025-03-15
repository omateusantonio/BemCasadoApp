using NamoreirosFinance.Application.Common.Request;
using NamoreirosFinance.Domain.Core.Models;

namespace NamoreirosFinance.Domain.Core.Interfaces.Repositories
{
    public interface IRepository<T> where T : class
    {
        public Task<T> GetById(int id);
        public Task<List<T>> GetAll();
        public Task<PagedResult<T>> GetPaged(QueryRequest request);
        public Task Add(T entity);
        public Task Update(T entity);
        public Task Delete(T entity);
    }
}
