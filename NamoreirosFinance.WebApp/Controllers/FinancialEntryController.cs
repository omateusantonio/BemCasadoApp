using Microsoft.AspNetCore.Mvc;
using NamoreirosFinance.Application.Interfaces;
using NamoreirosFinance.Domain.Core.Entities.Transaction;


namespace NamoreirosFinance.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinancialEntryController : ControllerBase
    {
        private readonly IFinancialEntryService _financialEntryService;
        public FinancialEntryController(IFinancialEntryService financialEntryService)
        {
            _financialEntryService = financialEntryService;
        }

        [HttpGet("v1")]
        public async Task<IActionResult> GetAll()
        {
            var entries = await _financialEntryService.GetAll();
            return Ok(entries);
        }

        [HttpGet("v1/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entry = await _financialEntryService.GetById(id);
            return Ok(entry);
        }

        [HttpPost("v1")]
        public async Task<IActionResult> Add([FromBody] FinancialEntry financialEntry)
        {
            await _financialEntryService.Add(financialEntry);
            return Created(financialEntry.Id.ToString(), financialEntry);
        }

        [HttpPatch("v1/{id}")]
        public async Task<IActionResult> Update([FromBody] FinancialEntry financialEntry, int id)
        {
            await _financialEntryService.Update(financialEntry);
            return NoContent();
        }

        [HttpDelete("v1/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entry = await _financialEntryService.GetById(id);
            await _financialEntryService.Delete(entry);
            return NoContent();
        }
    }
}
