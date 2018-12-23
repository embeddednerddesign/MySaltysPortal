using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmilyEMRVS;
using EmilyEMRVS.Models;
using Microsoft.AspNetCore.Authorization;

namespace EmilyEMRVS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TaxesController : ControllerBase
    {
        private readonly DataContext _context;

        public TaxesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Taxes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tax>>> GetTaxes()
        {
            return await _context.Taxes.ToListAsync();
        }

        // GET: api/Taxes/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetTax([FromRoute] int id)
        {
            var tax = await _context.Taxes.FindAsync(id);

            return Ok(tax);
        }

        // PUT: api/Taxes/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutTax([FromRoute] int id, [FromBody] Tax tax)
        {
            if (id != tax.taxId)
            {
                return Ok(null);
            }

            _context.Entry(tax).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaxExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Taxes
        [HttpPost]
        public async Task<ActionResult> PostTax([FromBody] Tax tax)
        {
            _context.Taxes.Add(tax);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTax", new { id = tax.taxId }, tax);
        }

        // DELETE: api/Taxes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTax([FromRoute] int id)
        {
            var tax = await _context.Taxes.FindAsync(id);
            if (tax == null)
            {
                return Ok(null);
            }

            _context.Taxes.Remove(tax);
            await _context.SaveChangesAsync();

            return Ok(tax);
        }

        private bool TaxExists(int id)
        {
            return _context.Taxes.Any(e => e.taxId == id);
        }
    }
}