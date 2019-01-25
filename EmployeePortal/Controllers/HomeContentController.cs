using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeePortal;
using EmployeePortal.Models;

namespace EmployeePortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeContentController : ControllerBase
    {
        private readonly DataContext _context;

        public HomeContentController(DataContext context)
        {
            _context = context;
        }

        // GET: api/HomeContent
        [HttpGet]
        public IEnumerable<HomeContent> GetHomeContent()
        {
            return _context.HomeContent;
        }

        // GET: api/HomeContent/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHomeContent([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var homeContent = await _context.HomeContent.FindAsync(id);

            if (homeContent == null)
            {
                return NotFound();
            }

            return Ok(homeContent);
        }

        // PUT: api/HomeContent/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHomeContent([FromRoute] int id, [FromBody] HomeContent homeContent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != homeContent.HomeContentId)
            {
                return BadRequest();
            }

            _context.Entry(homeContent).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HomeContentExists(id))
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

        // POST: api/HomeContent
        [HttpPost]
        public async Task<IActionResult> PostHomeContent([FromBody] HomeContent homeContent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.HomeContent.Add(homeContent);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHomeContent", new { id = homeContent.HomeContentId }, homeContent);
        }

        // DELETE: api/HomeContent/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHomeContent([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var homeContent = await _context.HomeContent.FindAsync(id);
            if (homeContent == null)
            {
                return NotFound();
            }

            _context.HomeContent.Remove(homeContent);
            await _context.SaveChangesAsync();

            return Ok(homeContent);
        }

        private bool HomeContentExists(int id)
        {
            return _context.HomeContent.Any(e => e.HomeContentId == id);
        }
    }
}