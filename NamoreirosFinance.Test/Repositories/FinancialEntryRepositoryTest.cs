using NamoreirosFinance.Domain.Core.Entities.Transaction;
using NamoreirosFinance.Domain.Core.Enums;
using NamoreirosFinance.Infrastructure.Repositories;

namespace NamoreirosFinance.Test.Repositories
{
    public class FinancialEntryRepositoryTest : BaseTest
    {
        private readonly FinancialEntryRepository _repository;

        public FinancialEntryRepositoryTest()
        {
            _repository = new FinancialEntryRepository(_context);
        }

        [Fact]
        public async Task Add_ShouldAddEntry()
        {
            var entry = new FinancialEntry
            {
                Date = DateTime.UtcNow,
                Value = 100,
                Description = "Test",
                Type = TransactionType.Income
            };

            await _repository.Add(entry);

            var result = await _repository.GetById(entry.Id);

            Assert.NotNull(result);
            Assert.Equal(entry.Date, result.Date);
            Assert.Equal(entry.Value, result.Value);
            Assert.Equal(entry.Description, result.Description);
            Assert.Equal(entry.Type, result.Type);
        }
    }
}
