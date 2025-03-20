using Microsoft.EntityFrameworkCore;
using NamoreirosFinance.Domain.Core.Entities.FinancialEntry;
using NamoreirosFinance.Domain.Core.Interfaces;
using NamoreirosFinance.Domain.Core.Models;

namespace NamoreirosFinance.Application.Common.Request.Handlers
{
    public class FinancialEntryQueryHandler : IQueryRequestHandler<FinancialEntry>
    {
        public IQueryable<FinancialEntry> ApplyRequest(IQueryable<FinancialEntry> query, QueryRequest request)
        {
            if (request.Take < 0 || request.Skip < 0)
            {
                throw new ArgumentException("Invalid pagination parameters - Take and Skip must be greater than zero");
            }

            if (request.HasFilter)
            {
                query = ApplyFilteringQuery(request, query);
            }

            if (request.HasOrdering)
            {
                query = ApplyOrderingQuery(request, query);
            } 
            else
            {
                query = query.OrderBy(x => x.Id);
            }

            return query;
        }

        public async Task<PagedResult<FinancialEntry>> GetPagedResult(IQueryable<FinancialEntry> query, QueryRequest request)
        {
            var totalCount = await query.CountAsync();

            if (request.HasPagination)
            {
                query = ApplyPaginationQuery(request, query);
            }

            var items = await query.ToListAsync();

            return new PagedResult<FinancialEntry>
            {
                PaginatedItems = items,
                TotalItems = totalCount,
                Skip = request.Skip,
                Take = request.Take
            };
        }

        private IQueryable<FinancialEntry> ApplyPaginationQuery(QueryRequest request, IQueryable<FinancialEntry> query)
        {

            return query.Skip(request.Skip).Take(request.Take);
        }

        private IQueryable<FinancialEntry> ApplyOrderingQuery(QueryRequest request, IQueryable<FinancialEntry> query)
        {
            switch (request.SortProperty)
            {
                case nameof(FinancialEntry.Value):
                    query = query.OrderBy(x => x.Value);
                    break;
                case nameof(FinancialEntry.Description):
                    query = query.OrderBy(x => x.Description);
                    break;
                case nameof(FinancialEntry.TransactionDate):
                    query = query.OrderBy(x => x.TransactionDate);
                    break;
                default:
                    query = query.OrderBy(x => x.Id);
                    break;
            }

            return request.Ascending ? query.Order() : query.OrderDescending();
        }

        private IQueryable<FinancialEntry> ApplyFilteringQuery(QueryRequest request, IQueryable<FinancialEntry> query)
        {
            var onylFilteredPropertyIsNullOrEmpty = string.IsNullOrWhiteSpace(request.FilteredProperty) && !string.IsNullOrWhiteSpace(request.FilteredValue);
            var onlyFilteredValueIsNullOrEmpty = !string.IsNullOrWhiteSpace(request.FilteredProperty) && string.IsNullOrWhiteSpace(request.FilteredValue);

            if (onylFilteredPropertyIsNullOrEmpty || onlyFilteredValueIsNullOrEmpty)
            {
                throw new ArgumentException("Invalid filtering parameters - FilteredProperty and FilteredValue must be both filled or both empty");
            }

            switch (request.FilteredProperty)
            {
                case nameof(FinancialEntry.Value):
                    query = query.Where(x => x.Value == decimal.Parse(request.FilteredValue!));
                    break;
                case nameof(FinancialEntry.Description):
                    query = query.Where(x => x.Description!.Contains(request.FilteredValue!));
                    break;
                case nameof(FinancialEntry.TransactionDate):
                    query = query.Where(x => x.TransactionDate == DateTime.Parse(request.FilteredValue!));
                    break;
                default:
                    throw new ArgumentException("Invalid filtering property - Must be equals to 'Value', 'Description' or 'TransactionDate'");
            }

            return query;
        }
    }
}
