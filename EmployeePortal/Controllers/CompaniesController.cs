using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeePortal.Models;
using Microsoft.AspNetCore.Authorization;

namespace EmployeePortal.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly DataContext _context;

        private TimeZoneInfo tzi;

        public CompaniesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Companies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
        {
            var result = await _context.Companies
                .Include(c => c.address)
                .ToListAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            return result;
        }

        // GET: api/Companies/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetCompany([FromRoute] int id)
        {
            var company = await _context.Companies
                .Include(c => c.address)
                .FirstOrDefaultAsync(c => c.CompanyId == id);

            tzi = await _context.GetLocalTimezoneInfo();

            return Ok(company);
        }

        // PUT: api/Companies/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutCompany([FromRoute] int id, [FromBody] Company company)
        {
            if (id != company.CompanyId)
            {
                return Ok(null);
            }

            var dbCompany = await _context.Companies
                .Include(c => c.address)
                .FirstAsync(c => c.CompanyId == company.CompanyId);

            this.tzi = await _context.GetLocalTimezoneInfo();

            // if this doesn't work, try automapper Package properties -> dbPackage properties
            dbCompany.name = company.name;
            dbCompany.contactName = company.contactName;
            dbCompany.contactPhone = company.contactPhone;
            dbCompany.timezone = company.timezone;

            _context.Companies.Update(dbCompany);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompanyExists(id))
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

        // POST: api/Companies
        [HttpPost]
        public async Task<ActionResult> PostCompany([FromBody] Company company)
        {
            this.tzi = await _context.GetLocalTimezoneInfo();

            _context.Companies.Add(company);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCompany", new { id = company.CompanyId }, company);
        }

        // DELETE: api/Companies/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCompany([FromRoute] int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
            {
                return Ok(null);
            }

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();

            return Ok(company);
        }

        private bool CompanyExists(int id)
        {
            return _context.Companies.Any(e => e.CompanyId == id);
        }
    }
}