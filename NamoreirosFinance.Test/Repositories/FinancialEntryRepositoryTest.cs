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
        public async Task Add_ShouldAddANewEntry()
        {
            var entry = new FinancialEntry
            {
                Date = DateTime.UtcNow,
                Value = 100,
                Description = "Test Entry",
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

        [Fact]
        public async Task GetAll_ShouldGetAllFinancialEntries()
        {
            var financialEntries = GetFinancialEntriesList();

            foreach(var entry in financialEntries)
            {
                await _repository.Add(entry);
            }

            var result = await _repository.GetAll();

            Assert.NotNull(result);
            Assert.Equal(financialEntries.Count, result.Count);
        }

        [Fact]
        public async Task GetById_ShouldGetTheSelectedItem()
        {
            var entry = GetFinancialEntry();
            await _repository.Add(entry);
            var entryId = entry.Id;

            var result = await _repository.GetById(entryId);

            Assert.NotNull(result);
            Assert.Equivalent(entry, result);
        }

        private List<FinancialEntry> GetFinancialEntriesList()
        {
            return new()
            {
                new()
                {
                    Date = DateTime.UtcNow,
                    Value = 100,
                    Description = "Test Entry 1",
                    Type = TransactionType.Income
                },
                new()
                {
                    Date = DateTime.UtcNow,
                    Value = 100,
                    Description = "Test Entry 2",
                    Type = TransactionType.Expense
                },
                new()
                {
                    Date = DateTime.UtcNow,
                    Value = 50,
                    Description = "Test Entry 3",
                    Type = TransactionType.Income
                }
            };
        }

        private FinancialEntry GetFinancialEntry()
        {
            return new()
            {
                Date = DateTime.UtcNow,
                Value = 100,
                Description = "Test Entry",
                Type = TransactionType.Income
            };
        }
    }
}
