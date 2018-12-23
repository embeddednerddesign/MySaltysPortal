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
    public class PharmaciesController : ControllerBase
    {
        private readonly DataContext _context;

        public PharmaciesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Pharmacies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pharmacy>>> GetPharmacies()
        {
            return await _context.Pharmacies.ToListAsync();
        }

        // GET: api/Pharmacies/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetPharmacy([FromRoute] int id)
        {
            var pharmacy = await _context.Pharmacies.FindAsync(id);

            return Ok(pharmacy);
        }

        // PUT: api/Pharmacies/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutPharmacy([FromRoute] int id, [FromBody] Pharmacy pharmacy)
        {
            if (id != pharmacy.PharmacyId)
            {
                return Ok(null);
            }

            _context.Entry(pharmacy).State = EntityState.Modified;
            if (pharmacy.address != null)
            {
                _context.Entry(pharmacy.address).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PharmacyExists(id))
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

        // POST: api/Pharmacies
        [HttpPost]
        public async Task<ActionResult> PostPharmacy([FromBody] Pharmacy pharmacy)
        {
            _context.Pharmacies.Add(pharmacy);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPharmacy", new { id = pharmacy.PharmacyId }, pharmacy);
        }

        // DELETE: api/Pharmacies/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePharmacy([FromRoute] int id)
        {
            var pharmacy = await _context.Pharmacies.FindAsync(id);
            if (pharmacy == null)
            {
                return Ok(null);
            }

            _context.Pharmacies.Remove(pharmacy);
            await _context.SaveChangesAsync();

            return Ok(pharmacy);
        }

        private bool PharmacyExists(int id)
        {
            return _context.Pharmacies.Any(e => e.PharmacyId == id);
        }
    }
}