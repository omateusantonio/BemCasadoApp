namespace NamoreirosFinance.Application.Common.Request
{
    public class QueryRequest
    {
        public int Skip { get; set; }
        public int Take { get; set; } = 10;
        public string? SortProperty { get; set; }
        public bool Ascending { get; set; }
        public string? FilteredProperty { get; set; }
        public string? FilteredValue { get; set; }
        public bool HasPagination => Take > 0;
        public bool HasOrdering => !string.IsNullOrEmpty(SortProperty);
        public bool HasFilter => !string.IsNullOrWhiteSpace(FilteredProperty) && !string.IsNullOrWhiteSpace(FilteredValue);
    }
}
