using Swashbuckle.AspNetCore.Annotations;

namespace NamoreirosFinance.Domain.Core.Models
{
    public class QueryRequest
    {
        public int Skip { get; set; }
        public int Take { get; set; } = 10;
        public string? SortProperty { get; set; }
        public bool Ascending { get; set; }
        public string? FilteredProperty { get; set; }
        public string? FilteredValue { get; set; }

        [SwaggerIgnore]
        public bool HasPagination => Take > 0;

        [SwaggerIgnore]
        public bool HasOrdering => !string.IsNullOrEmpty(SortProperty);

        [SwaggerIgnore]
        public bool HasFilter => !string.IsNullOrWhiteSpace(FilteredProperty) && !string.IsNullOrWhiteSpace(FilteredValue);
    }
}
