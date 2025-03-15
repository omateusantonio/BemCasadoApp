using Microsoft.AspNetCore.Mvc;
using NamoreirosFinance.Application.Interfaces;
using NamoreirosFinance.Domain.Core.Entities.FinancialEntry;
using NamoreirosFinance.Domain.Core.Models;


namespace NamoreirosFinance.WebApp.Controllers
{
    [Route("api/v1/[controller]")] 
    [ApiController]
    public class FinancialEntryController : ControllerBase
    {
        private readonly IFinancialEntryService _financialEntryService;
        public FinancialEntryController(IFinancialEntryService financialEntryService)
        {
            _financialEntryService = financialEntryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entries = await _financialEntryService.GetAll();

            if (!entries.Any())
            {
                return NoContent();
            }

            return Ok(entries);
        }

        [HttpPost("search")]
        public async Task<IActionResult> GetPaged([FromQuery] QueryRequest request)
        {
            var entries = await _financialEntryService.GetPaged(request);

            if (!entries.PaginatedItems.Any())
            {
                return NoContent();
            }

            HttpContext.Response.Headers.Append("X-Skip", entries.Skip.ToString());
            HttpContext.Response.Headers.Append("X-Take", entries.Take.ToString());

            return Ok(entries.PaginatedItems);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Must provide a valid ID");
            }

            var entry = await _financialEntryService.GetById(id);

            if (entry == null)
            {
                return NotFound($"Financial entry with ID '{id}' couldn't be found");
            }

            return Ok(entry);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] FinancialEntry financialEntry)
        {
            if (financialEntry.Id != 0)
            {
                return BadRequest("ID should not be provided");
            }

            await _financialEntryService.Add(financialEntry);
            return Created(financialEntry.Id.ToString(), financialEntry);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Update([FromBody] FinancialEntry financialEntry, int id)
        {
            if (id <= 0)
            {
                return BadRequest("Must provide a valid ID");
            }

            if (financialEntry.Id != id)
            {
                return BadRequest("ID provided in the body doesn't match the one in the URL");
            }

            await _financialEntryService.Update(financialEntry);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Must provide a valid ID");
            }

            var entry = await _financialEntryService.GetById(id);

            if (entry == null)
            {
                return NotFound($"Financial entry with ID '{id}' couldn't be found");
            }

            await _financialEntryService.Delete(entry);
            return NoContent();
        }
    }
}
