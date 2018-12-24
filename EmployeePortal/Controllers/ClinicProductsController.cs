using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeePortal;
using EmployeePortal.Models;
using Microsoft.AspNetCore.Authorization;

namespace EmployeePortal.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClinicProductsController : ControllerBase
    {
        private readonly DataContext _context;

        public ClinicProductsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/ClinicProducts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClinicProduct>>> GetClinicProduct()
        {
            return await _context.ClinicProduct.ToListAsync();
        }

        // GET: api/ClinicProducts/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetClinicProduct([FromRoute] string id)
        {
            var clinicProduct = await _context.ClinicProduct.FindAsync(id);

            if (clinicProduct == null)
            {
                return Ok(null);
            }

            return Ok(clinicProduct);
        }

        // PUT: api/ClinicProducts/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutClinicProduct([FromRoute] int id, [FromBody] ClinicProduct clinicProduct)
        {
            if (id != clinicProduct.ClinicProductId)
            {
                return Ok(null);
            }

            _context.Entry(clinicProduct).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClinicProductExists(id))
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

        // POST: api/ClinicProducts
        [HttpPost]
        public async Task<ActionResult> PostClinicProduct([FromBody] ClinicProduct clinicProduct)
        {
            _context.ClinicProduct.Add(clinicProduct);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClinicProduct", new { id = clinicProduct.ClinicProductId }, clinicProduct);
        }

        // DELETE: api/ClinicProducts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteClinicProduct([FromRoute] string id)
        {
            var clinicProduct = await _context.ClinicProduct.FindAsync(id);
            if (clinicProduct == null)
            {
                return Ok(null);
            }

            _context.ClinicProduct.Remove(clinicProduct);
            await _context.SaveChangesAsync();

            return Ok(clinicProduct);
        }

        private bool ClinicProductExists(int id)
        {
            return _context.ClinicProduct.Any(e => e.ClinicProductId == id);
        }
    }
}