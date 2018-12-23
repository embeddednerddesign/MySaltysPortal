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
    public class LabsController : ControllerBase
    {
        private readonly DataContext _context;

        public LabsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Labs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lab>>> GetLabs()
        {
            return await _context.Labs.ToListAsync();
        }

        // GET: api/Labs/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetLab([FromRoute] int id)
        {
            var lab = await _context.Labs.FindAsync(id);

            return Ok(lab);
        }

        // PUT: api/Labs/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutLab([FromRoute] int id, [FromBody] Lab lab)
        {
            if (id != lab.LabId)
            {
                return Ok(null);
            }

            _context.Entry(lab).State = EntityState.Modified;
            if (lab.address != null)
            {
                _context.Entry(lab.address).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LabExists(id))
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

        // POST: api/Labs
        [HttpPost]
        public async Task<ActionResult> PostLab([FromBody] Lab lab)
        {
            _context.Labs.Add(lab);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLab", new { id = lab.LabId }, lab);
        }

        // DELETE: api/Labs/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteLab([FromRoute] int id)
        {
            var lab = await _context.Labs.FindAsync(id);
            if (lab == null)
            {
                return Ok(null);
            }

            _context.Labs.Remove(lab);
            await _context.SaveChangesAsync();

            return Ok(lab);
        }

        private bool LabExists(int id)
        {
            return _context.Labs.Any(e => e.LabId == id);
        }
    }
}