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
    public class ResourcesController : ControllerBase
    {
        private readonly DataContext _context;

        public ResourcesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Resources
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resource>>> GetResources()
        {
            return await _context.Resources.ToListAsync();
        }

        // GET: api/Resources/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetResource([FromRoute] int id)
        {
            var resource = await _context.Resources.FindAsync(id);

            return Ok(resource);
        }

        // PUT: api/Resources/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutResource([FromRoute] int id, [FromBody] Resource resource)
        {
            if (id != resource.ResourceId)
            {
                return Ok(null);
            }

            _context.Entry(resource).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResourceExists(id))
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

        // POST: api/Resources
        [HttpPost]
        public async Task<ActionResult> PostResource([FromBody] Resource resource)
        {
            _context.Resources.Add(resource);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetResource", new { id = resource.ResourceId }, resource);
        }

        // DELETE: api/Resources/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteResource([FromRoute] int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null)
            {
                return Ok(null);
            }

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();

            return Ok(resource);
        }

        private bool ResourceExists(int id)
        {
            return _context.Resources.Any(e => e.ResourceId == id);
        }
    }
}