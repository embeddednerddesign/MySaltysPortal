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
    public class ServiceCategoriesController : ControllerBase
    {
        private readonly DataContext _context;

        public ServiceCategoriesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/ServiceCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceCategory>>> GetServiceCategories()
        {
            return await _context.ServiceCategories.ToListAsync();
        }

        // GET: api/ServiceCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetServiceCategory([FromRoute] int id)
        {
            var serviceCategory = await _context.ServiceCategories.FindAsync(id);

            return Ok(serviceCategory);
        }

        // PUT: api/ServiceCategories/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutServiceCategory([FromRoute] int id, [FromBody] ServiceCategory serviceCategory)
        {
            if (id != serviceCategory.ServiceCategoryId)
            {
                return Ok(null);
            }

            _context.Entry(serviceCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceCategoryExists(id))
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

        // POST: api/ServiceCategories
        [HttpPost]
        public async Task<ActionResult> PostServiceCategory([FromBody] ServiceCategory serviceCategory)
        {
            _context.ServiceCategories.Add(serviceCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetServiceCategory", new { id = serviceCategory.ServiceCategoryId }, serviceCategory);
        }

        // DELETE: api/ServiceCategories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteServiceCategory([FromRoute] int id)
        {
            var serviceCategory = await _context.ServiceCategories.FindAsync(id);
            if (serviceCategory == null)
            {
                return Ok(null);
            }

            _context.ServiceCategories.Remove(serviceCategory);
            await _context.SaveChangesAsync();

            return Ok(serviceCategory);
        }

        private bool ServiceCategoryExists(int id)
        {
            return _context.ServiceCategories.Any(e => e.ServiceCategoryId == id);
        }
    }
}