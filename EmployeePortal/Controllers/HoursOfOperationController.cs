using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmilyEMRVS;
using EmilyEMRVS.Models;
using static EmilyEMRVS.Lib.Fun;
using Microsoft.AspNetCore.Authorization;

namespace EmilyEMRVS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HoursOfOperationController : ControllerBase
    {
        private readonly DataContext _context;

        public HoursOfOperationController(DataContext context)
        {
            _context = context;
        }

        // GET: api/HoursOfOperation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoursOfOperation>>> GetHoursOfOperation()
        {
            var result = await _context.HoursOfOperation.Include(h => h.hoursOfOperationDays).ToListAsync();

            var tzi = await _context.GetLocalTimezoneInfo();

            foreach (HoursOfOperation hoo in result)
            {
                foreach (HoursOfOperationDay hood in hoo.hoursOfOperationDays) {
                    hood.closeTime = fromUtc(hood.closeTime, tzi);
                    hood.openTime = fromUtc(hood.openTime, tzi);
                }
            }

            return result;
        }

        // GET: api/HoursOfOperation/company/1
        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<HoursOfOperation>> GetHoursOfOperationForCompany([FromRoute] int companyId)
        {
            Company company;

            if (companyId > 0)
            {
                company = await _context.Companies
                .Include(c => c.hoursOfOperation)
                .ThenInclude(h => h.hoursOfOperationDays)
                .FirstOrDefaultAsync(c => c.CompanyId == companyId);
            }
            else
            {
                // means that there is the assumption that the app services the only company
                company = await _context.Companies
                .Include(c => c.hoursOfOperation)
                .ThenInclude(h => h.hoursOfOperationDays)
                .FirstOrDefaultAsync();
            }

            if (company != null && company.hoursOfOperation != null)
            {
                if (company.hoursOfOperation.hoursOfOperationDays != null)
                {
                    var tzi = await _context.GetLocalTimezoneInfo();

                    foreach (HoursOfOperationDay hood in company.hoursOfOperation.hoursOfOperationDays)
                    {
                        hood.closeTime = fromUtc(hood.closeTime, tzi);
                        hood.openTime = fromUtc(hood.openTime, tzi);
                    }
                }

                return company.hoursOfOperation;
            }

            return Ok(null);
        }

        // GET: api/HoursOfOperation/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHoursOfOperation([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hoursOfOperation = await _context.HoursOfOperation.Include(h => h.hoursOfOperationDays).Where(h => h.hoursOfOperationId == id).FirstOrDefaultAsync();

            var tzi = await _context.GetLocalTimezoneInfo();

            foreach (HoursOfOperationDay hood in hoursOfOperation.hoursOfOperationDays) {
                hood.closeTime = fromUtc(hood.closeTime, tzi);
                hood.openTime = fromUtc(hood.openTime, tzi);
            }

            if (hoursOfOperation == null)
            {
                return NotFound();
            }

            return Ok(hoursOfOperation);
        }

        // PUT: api/HoursOfOperation/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHoursOfOperation([FromRoute] int id, [FromBody] HoursOfOperation hoursOfOperation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != hoursOfOperation.hoursOfOperationId)
            {
                return BadRequest();
            }

            var tzi = await _context.GetLocalTimezoneInfo();

            foreach (HoursOfOperationDay day in hoursOfOperation.hoursOfOperationDays) {
                var hoursDay = await _context.HoursOfOperationDays.FindAsync(day.hoursOfOperationDayId);

                // set the times to UTC before we store it
                hoursDay.dayofweek = day.dayofweek;
                hoursDay.openTime = toUtc(day.openTime);
                hoursDay.closeTime = toUtc(day.closeTime);
                _context.HoursOfOperationDays.Update(hoursDay);
                await _context.SaveChangesAsync();
            }

            _context.Entry(hoursOfOperation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HoursOfOperationExists(id))
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

        // PUT: api/HoursOfOperation/1/5
        [HttpPut("{companyId}/{id}")]
        public async Task<IActionResult> SaveHoursOfOperation([FromRoute] int companyId, [FromRoute] int id, [FromBody] HoursOfOperation hoursOfOperation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var db = await _context.Companies
                .Include(e => e.hoursOfOperation).ThenInclude(e => e.hoursOfOperationDays)
                .FirstAsync(e => e.CompanyId == companyId);

            if (db.hoursOfOperation == null)
            {
                // set the times to UTC before we store it
                foreach (HoursOfOperationDay hood in hoursOfOperation.hoursOfOperationDays) {
                    hood.openTime = toUtc(hood.openTime);
                    hood.closeTime = toUtc(hood.closeTime);
                }
                
                db.hoursOfOperation = hoursOfOperation;
                _context.Entry(db).State = EntityState.Modified;

                await _context.SaveChangesAsync();
                return CreatedAtAction("SaveHoursOfOperation", new { id = hoursOfOperation.hoursOfOperationId }, hoursOfOperation);
            }
            else
            {
                var days = hoursOfOperation.hoursOfOperationDays;

                if (days == null)
                {
                    foreach (var dbDay in db.hoursOfOperation.hoursOfOperationDays)
                    {
                        db.hoursOfOperation.hoursOfOperationDays.Remove(dbDay);
                    }
                }
                else
                {
                    foreach (var day in days)
                    {
                        day.openTime = toUtc(day.openTime);
                        day.closeTime = toUtc(day.closeTime);

                        var dbDay = db.hoursOfOperation.hoursOfOperationDays.FirstOrDefault(d => d.dayofweek == day.dayofweek);

                        if (dbDay == null)
                        {
                            db.hoursOfOperation.hoursOfOperationDays.Add(day);
                        }
                        else
                        {
                            dbDay.closed = day.closed;
                            dbDay.dayofweek = day.dayofweek;
                            dbDay.openTime = day.openTime;
                            dbDay.closeTime = day.closeTime;

                            _context.HoursOfOperationDays.Update(dbDay);
                        }
                    }
                }

                await _context.SaveChangesAsync();

                db = await _context.Companies
                .Include(e => e.hoursOfOperation).ThenInclude(e => e.hoursOfOperationDays)
                .FirstAsync(e => e.CompanyId == companyId);

                return Ok(db.hoursOfOperation);
            }
        }

        // POST: api/HoursOfOperation
        [HttpPost]
        public async Task<IActionResult> PostHoursOfOperation([FromBody] HoursOfOperation hoursOfOperation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            foreach (HoursOfOperationDay hood in hoursOfOperation.hoursOfOperationDays) {
                // set the times to UTC before we store it
                hood.openTime = toUtc(hood.openTime);
                hood.closeTime = toUtc(hood.closeTime);
            }

            _context.HoursOfOperation.Add(hoursOfOperation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHoursOfOperation", new { id = hoursOfOperation.hoursOfOperationId }, hoursOfOperation);
        }

        // DELETE: api/HoursOfOperation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoursOfOperation([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hoursOfOperation = await _context.HoursOfOperation.FindAsync(id);
            if (hoursOfOperation == null)
            {
                return NotFound();
            }

            _context.HoursOfOperation.Remove(hoursOfOperation);
            await _context.SaveChangesAsync();

            return Ok(hoursOfOperation);
        }

        private bool HoursOfOperationExists(int id)
        {
            return _context.HoursOfOperation.Any(e => e.hoursOfOperationId == id);
        }
    }
}