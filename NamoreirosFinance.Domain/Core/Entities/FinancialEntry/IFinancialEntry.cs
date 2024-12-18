using NamoreirosFinance.Domain.Core.Enums;

namespace NamoreirosFinance.Domain.Core.Entities.FinancialEntry
{
    public interface IFinancialEntry
    {
        public int Id { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal Value { get; set; }
        public string? Description { get; set; }
        public TransactionType Type { get; set; }
    }
}
