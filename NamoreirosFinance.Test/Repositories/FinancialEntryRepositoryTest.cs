using Microsoft.Extensions.DependencyInjection;
using NamoreirosFinance.Domain.Core.Entities.FinancialEntry;
using NamoreirosFinance.Domain.Core.Enums;
using NamoreirosFinance.Infrastructure.Repositories;

namespace NamoreirosFinance.Test.Repositories
{
    public class FinancialEntryRepositoryTest : BaseTest
    {
        private readonly FinancialEntryRepository _repository;

        public FinancialEntryRepositoryTest()
        {
            _repository = _serviceProvider.GetRequiredService<FinancialEntryRepository>()
                                          ?? throw new Exception($"The application was unable to get the required service '{nameof(FinancialEntryRepository)}'");
        }

        [Fact]
        public async Task Add_ShouldAddANewEntry()
        {
            var entry = new FinancialEntry
            {
                TransactionDate = DateTime.UtcNow,
                Value = 100,
                Description = "Test Entry",
                Type = TransactionType.Income
            };

            await _repository.Add(entry);

            var result = await _repository.GetById(entry.Id);

            Assert.NotNull(result);
            Assert.Equal(entry.TransactionDate, result.TransactionDate);
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

        [Fact]
        public async Task Update_ShouldUpdateTheSelectedItem()
        {
            var entry = GetFinancialEntry();
            await _repository.Add(entry);
            var entryId = entry.Id;

            entry.Description = "Updated Description";
            entry.Value = 200;
            entry.Type = TransactionType.Expense;

            await _repository.Update(entry);

            var result = await _repository.GetById(entryId);

            Assert.NotNull(result);
            Assert.Equal(entry.Description, result.Description);
            Assert.Equal(entry.Value, result.Value);
            Assert.Equal(entry.Type, result.Type);
        }

        [Fact]
        public async Task Delete_ShouldRemoveTheSelectedItem()
        {
            var entry = GetFinancialEntry();
            await _repository.Add(entry);
            var entryId = entry.Id;

            await _repository.Delete(entry);

            var result = await _repository.GetById(entryId);

            Assert.Null(result);
        }

        private List<FinancialEntry> GetFinancialEntriesList()
        {
            return new()
            {
                new()
                {
                    TransactionDate = DateTime.UtcNow,
                    Value = 100,
                    Description = "Test Entry 1",
                    Type = TransactionType.Income
                },
                new()
                {
                    TransactionDate = DateTime.UtcNow,
                    Value = 100,
                    Description = "Test Entry 2",
                    Type = TransactionType.Expense
                },
                new()
                {
                    TransactionDate = DateTime.UtcNow,
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
                TransactionDate = DateTime.UtcNow,
                Value = 100,
                Description = "Test Entry",
                Type = TransactionType.Income
            };
        }
    }
}
