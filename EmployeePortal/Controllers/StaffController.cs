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
    public class StaffController : ControllerBase
    {
        private readonly DataContext _context;
        private TimeZoneInfo tzi;

        public StaffController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Staff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Staff>>> GetStaff()
        {
            var staffs = await _context.Staff.Include(s => s.services).ThenInclude(ss => ss.Service)
            .Include(s => s.staffSchedules)
            .ToListAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            foreach (Staff st in staffs)
            {
                foreach (StaffSchedule ss in st.staffSchedules) {
                    // set the times to UTC before we store it
                    ss.Start = TimeZoneInfo.ConvertTimeFromUtc(ss.Start, tzi);
                    ss.End = TimeZoneInfo.ConvertTimeFromUtc(ss.End, tzi);
                    ss.EndDate = TimeZoneInfo.ConvertTimeFromUtc(ss.EndDate, tzi);
                }
            }

            return staffs;
        }

        // GET: api/Staff/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetStaff([FromRoute] int id)
        {
            var staff = await _context.Staff.Include(s => s.services).ThenInclude(ss => ss.Service)
            .Include(s => s.staffSchedules)
            .Where(s => s.StaffId == id).FirstOrDefaultAsync();
            
            tzi = await _context.GetLocalTimezoneInfo();

            foreach (StaffSchedule ss in staff.staffSchedules) {
                // set the times to UTC before we store it
                ss.Start = TimeZoneInfo.ConvertTimeFromUtc(ss.Start, tzi);
                ss.End = TimeZoneInfo.ConvertTimeFromUtc(ss.End, tzi);
                ss.EndDate = TimeZoneInfo.ConvertTimeFromUtc(ss.EndDate, tzi);
            }

            return Ok(staff);
        }

        // PUT: api/Staff/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutStaff([FromRoute] int id, [FromBody] Staff staff)
        {
            if (id != staff.StaffId)
            {
                return Ok(null);
            }

            this.tzi = await _context.GetLocalTimezoneInfo();

            foreach (StaffSchedule ss in staff.staffSchedules) {
                // set the times to UTC before we store it
                ss.Start = TimeZoneInfo.ConvertTimeToUtc(ss.Start);
                ss.End = TimeZoneInfo.ConvertTimeToUtc(ss.End);
                ss.EndDate = TimeZoneInfo.ConvertTimeToUtc(ss.EndDate);
            }

            _context.Entry(staff).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffExists(id))
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

        // POST: api/Staff
        [HttpPost]
        public async Task<ActionResult> PostStaff([FromBody] Staff staff)
        {
            this.tzi = await _context.GetLocalTimezoneInfo();

            foreach (StaffSchedule ss in staff.staffSchedules) {
                // set the times to UTC before we store it
                ss.Start = TimeZoneInfo.ConvertTimeToUtc(ss.Start);
                ss.End = TimeZoneInfo.ConvertTimeToUtc(ss.End);
                ss.EndDate = TimeZoneInfo.ConvertTimeToUtc(ss.EndDate);
            }

            _context.Staff.Add(staff);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStaff", new { id = staff.StaffId }, staff);
        }

        // DELETE: api/Staff/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteStaff([FromRoute] int id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null)
            {
                return Ok(null);
            }

            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();

            return Ok(staff);
        }

        private bool StaffExists(int id)
        {
            return _context.Staff.Any(e => e.StaffId == id);
        }
    }
}