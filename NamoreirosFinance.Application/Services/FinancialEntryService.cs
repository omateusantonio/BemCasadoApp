﻿using NamoreirosFinance.Application.Common.Request;
using NamoreirosFinance.Application.Interfaces;
using NamoreirosFinance.Domain.Core.Entities.FinancialEntry;
using NamoreirosFinance.Domain.Core.Interfaces.Repositories;
using NamoreirosFinance.Domain.Core.Models;

namespace NamoreirosFinance.Application.Services
{
    public class FinancialEntryService : IFinancialEntryService
    {
        private static IFinancialEntryRepository _repository;

        public FinancialEntryService(IFinancialEntryRepository repository)
        {
            _repository = repository;
        }

        public async Task Add(FinancialEntry financialEntry)
        {
            await _repository.Add(financialEntry);
        }

        public async Task Delete(FinancialEntry financialEntry)
        {
            await _repository.Delete(financialEntry);
        }

        public async Task<List<FinancialEntry>> GetAll()
        {
            var entries = await _repository.GetAll();
            return entries;
        }

        public async Task<FinancialEntry> GetById(int id)
        {
            var entry = await _repository.GetById(id);
            return entry;
        }

        public async Task Update(FinancialEntry financialEntry)
        {
            await _repository.Update(financialEntry);
        }

        public async Task<PagedResult<FinancialEntry>> GetPaged(QueryRequest request)
        {
            var entries = await _repository.GetPaged(request);
            return entries;
        }
    }
}
