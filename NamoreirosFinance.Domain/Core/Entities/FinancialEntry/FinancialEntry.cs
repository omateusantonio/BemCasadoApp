using NamoreirosFinance.Domain.Core.Entities.FinancialEntry;
using NamoreirosFinance.Domain.Core.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace NamoreirosFinance.Domain.Core.Entities.Transaction
{
    [Table("financial_entry")]
    public class FinancialEntry : IFinancialEntry
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public decimal Value { get; set; }

        public string? Description { get; set; }

        public TransactionType Type { get; set; }
    }
}
