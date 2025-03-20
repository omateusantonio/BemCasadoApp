namespace NamoreirosFinance.Application.Common.Request
{
    public class PagedResult<T> where T : class
    {
        public List<T> PaginatedItems { get; set; } = new();
        public int TotalItems { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}
