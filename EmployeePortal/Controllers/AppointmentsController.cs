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
    public class AppointmentsController : ControllerBase
    {
        private readonly DataContext _context;
        private TimeZoneInfo tzi;

        public AppointmentsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointment(DateTime? startDate, DateTime? endDate)
        {
            List<Appointment> appointments = new List<Appointment>();
            if (startDate.HasValue && endDate.HasValue)
            {
                appointments = await _context.Appointments.Include(a => a.service).
                    Where(a => (!a.cancelled.Value &&
                            a.start >= startDate && a.start <= endDate)).ToListAsync();
            }
            else
            {
                appointments = await _context.Appointments.Include(a => a.service).
                    Where(a => !a.cancelled.Value).ToListAsync();
            }

            tzi = await _context.GetLocalTimezoneInfo();

            foreach (var appt in appointments)
            {
                // set the times to UTC before we store it
                appt.start = TimeZoneInfo.ConvertTimeFromUtc(appt.start, tzi);
                appt.end = TimeZoneInfo.ConvertTimeFromUtc(appt.end.Value, tzi);
                appt.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(appt.cancellationDate ?? DateTime.Now, tzi);
            }

            return Ok(appointments);

        }

        // GET: api/Appointments/5
        [Route("api/Appointment/{id}")]
        public async Task<ActionResult> GetAppointment([FromRoute] int id)
        {
            var appointment = await _context.Appointments.Where(appt => appt.appointmentId == id).FirstOrDefaultAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            // set the times to UTC before we store it
            appointment.start = TimeZoneInfo.ConvertTimeFromUtc(appointment.start, tzi);
            appointment.end = TimeZoneInfo.ConvertTimeFromUtc(appointment.end.Value, tzi);
            appointment.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(appointment.cancellationDate ?? DateTime.Now, tzi);

            return Ok(appointment);
        }

        // GET: api/Appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments([FromRoute] int id)
        {
            List<Appointment> appointments = await _context.Appointments
                  .Include(a => a.service).Where(appt => appt.visitId == id).ToListAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            foreach (var appt in appointments)
            {
                // set the times to UTC before we store it
                appt.start = TimeZoneInfo.ConvertTimeFromUtc(appt.start, tzi);
                appt.end = TimeZoneInfo.ConvertTimeFromUtc(appt.end.Value, tzi);
                appt.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(appt.cancellationDate ?? DateTime.Now, tzi);
            }

            return Ok(appointments);
        }

        // PUT: api/Appointments/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutAppointment([FromRoute] int id, [FromBody] Appointment appointment)
        {
            if (id != appointment.appointmentId)
            {
                return Ok(null);
            }

            this.tzi = await _context.GetLocalTimezoneInfo();

            // set the times to UTC before we store it
            appointment.start = TimeZoneInfo.ConvertTimeToUtc(appointment.start);
            appointment.end = TimeZoneInfo.ConvertTimeToUtc(appointment.end.Value);
            appointment.cancellationDate = TimeZoneInfo.ConvertTimeToUtc(appointment.cancellationDate ?? DateTime.Now);

            _context.Update(appointment);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(appointment);
        }

        // POST: api/Appointments
        [HttpPost]
        public async Task<ActionResult> PostAppointment([FromBody] Appointment appointment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            this.tzi = await _context.GetLocalTimezoneInfo();

            // set the times to UTC before we store it
            appointment.start = TimeZoneInfo.ConvertTimeToUtc(appointment.start);
            if (appointment.end.HasValue)
            {
                appointment.end = TimeZoneInfo.ConvertTimeToUtc(appointment.end.Value);
            }
            appointment.cancellationDate = TimeZoneInfo.ConvertTimeToUtc(appointment.cancellationDate ?? DateTime.Now);

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppointment", new { id = appointment.appointmentId }, appointment);
        }

        // DELETE: api/Appointments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppointment([FromRoute] int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return Ok(null);
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return Ok(appointment);
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.appointmentId == id);
        }
    }
}