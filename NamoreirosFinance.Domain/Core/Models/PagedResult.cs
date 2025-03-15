namespace NamoreirosFinance.Domain.Core.Models
{
    public class PagedResult<T> where T : class
    {
        public List<T> PaginatedItems { get; set; } = new();
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}
