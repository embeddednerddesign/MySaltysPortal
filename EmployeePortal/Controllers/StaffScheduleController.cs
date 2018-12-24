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
    public class StaffSchedulesController : ControllerBase
    {
        private readonly DataContext _context;
        private TimeZoneInfo tzi;

        public StaffSchedulesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/StaffSchedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffSchedule>>> GetStaffchedules()
        {
            var result = await _context.StaffSchedules.ToListAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            foreach (StaffSchedule ss in result) {
                // set the times to UTC before we store it
                ss.Start = TimeZoneInfo.ConvertTimeFromUtc(ss.Start, tzi);
                ss.End = TimeZoneInfo.ConvertTimeFromUtc(ss.End, tzi);
                ss.EndDate = TimeZoneInfo.ConvertTimeFromUtc(ss.EndDate, tzi);
            }

            return result;
        }

        // GET: api/StaffSchedule/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetStaffScheduleById([FromRoute] int id)
        {
            var sched = await _context.StaffSchedules.Where(s => s.StaffScheduleId == id).FirstOrDefaultAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            // set the times to UTC before we store it
            sched.Start = TimeZoneInfo.ConvertTimeFromUtc(sched.Start, tzi);
            sched.End = TimeZoneInfo.ConvertTimeFromUtc(sched.End, tzi);
            sched.EndDate = TimeZoneInfo.ConvertTimeFromUtc(sched.EndDate, tzi);

            return Ok(sched);
        }

        // PUT: api/StaffSchedule/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutStaffSchedule([FromRoute] int id, [FromBody] StaffSchedule schedule)
        {
            if (id != schedule.StaffScheduleId)
            {
                return Ok(null);
            }

            this.tzi = await _context.GetLocalTimezoneInfo();

            // set the times to UTC before we store it
            schedule.Start = TimeZoneInfo.ConvertTimeToUtc(schedule.Start);
            schedule.End = TimeZoneInfo.ConvertTimeToUtc(schedule.End);
            schedule.EndDate = TimeZoneInfo.ConvertTimeToUtc(schedule.EndDate);

            _context.Entry(schedule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleExists(id))
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

        // POST: api/StaffSchedule
        [HttpPost]
        public async Task<ActionResult> PostStaffSchedule([FromBody] StaffSchedule schedule)
        {
            this.tzi = await _context.GetLocalTimezoneInfo();

            // set the times to UTC before we store it
            schedule.Start = TimeZoneInfo.ConvertTimeToUtc(schedule.Start);
            schedule.End = TimeZoneInfo.ConvertTimeToUtc(schedule.End);
            schedule.EndDate = TimeZoneInfo.ConvertTimeToUtc(schedule.EndDate);
            
            _context.StaffSchedules.Add(schedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStaffSchedule", new { id = schedule.StaffScheduleId }, schedule);
        }

        // DELETE: api/StaffSchedule/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteStaffSchedule([FromRoute] int id)
        {
            var schedule = await _context.StaffSchedules.FindAsync(id);
            if (schedule == null)
            {
                return Ok(null);
            }

            _context.StaffSchedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return Ok(schedule);
        }

        private bool ScheduleExists(int id)
        {
            return _context.StaffSchedules.Any(e => e.StaffScheduleId == id);
        }
    }
}