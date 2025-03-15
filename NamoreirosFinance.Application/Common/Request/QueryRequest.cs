namespace NamoreirosFinance.Application.Common.Request
{
    public class QueryRequest
    {
        public uint Skip { get; set; }
        public uint Take { get; set; } = 10;
        public string? OrderingProperty { get; set; }
        public OrderingDirectionEnum? OrderingDirection { get; set; }
        public string? FilteredProperty { get; set; }
        public string? FilteredValue { get; set; }
        public bool HasPagination => Take > 0;
        public bool HasOrdering => !string.IsNullOrEmpty(OrderingProperty);
        public bool HasFilter => !string.IsNullOrWhiteSpace(FilteredProperty) && !string.IsNullOrWhiteSpace(FilteredValue);
    }
}
