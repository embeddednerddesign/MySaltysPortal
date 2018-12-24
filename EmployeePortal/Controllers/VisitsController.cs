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
    public class VisitsController : ControllerBase
    {
        private readonly DataContext _context;
        private TimeZoneInfo tzi;

        public VisitsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Visits
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Visit>>> GetVisits()
        {
            List<Visit> visits =  await _context.Visits.Include(v => v.patient)
                .Include(v => v.appointments).ThenInclude(a=> a.service)
                .Include(v => v.visitProducts).ToListAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            foreach (var vis in visits)
            {
                vis.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(vis.cancellationDate ?? DateTime.Now, tzi);
                foreach (var appointment in vis.appointments.ToList())
                {
                    if (appointment.cancelled.HasValue)
                    {
                        if (appointment.cancelled.Value)
                        {
                            vis.appointments.Remove(appointment);
                        }
                        else
                        {
                            // set the times to UTC before we store it
                            appointment.start = TimeZoneInfo.ConvertTimeFromUtc(appointment.start, tzi);
                            if (appointment.end.HasValue)
                            {
                                appointment.end = TimeZoneInfo.ConvertTimeFromUtc(appointment.end.Value, tzi);
                            }
                            appointment.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(appointment.cancellationDate ?? DateTime.Now, tzi);
                        }
                    }
                }
            }

            return visits;
        }

        [HttpGet("GetByDate/{dateString}")]
        public async Task<ActionResult> GetVisitsByDate([FromRoute] string dateString)
        {
            if(ModelState.IsValid)
            {
                var date = Convert.ToDateTime(dateString);
                var list = await _context.Visits.Where(v => v.date.DayOfYear == date.DayOfYear && v.date.Year == date.Year).ToListAsync();
                return Ok(list);
            }
            else
            {
                return BadRequest();
            }
        }

        // GET: api/Visits/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetVisit([FromRoute] int id)
        {
            var visit = await _context.Visits.Include(v => v.patient).Include(v => v.appointments).Where(v => v.VisitId == id).FirstOrDefaultAsync();

            //tzi = await _context.GetLocalTimezoneInfo();

            //visit.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(visit.cancellationDate ?? DateTime.Now, tzi);
            //foreach (var appointment in visit.appointments.ToList())
            //{
            //    if (appointment.cancelled.HasValue)
            //    {
            //        if (appointment.cancelled.Value)
            //            visit.appointments.Remove(appointment);
            //        else
            //        {
            //            // set the times to UTC before we store it
            //            appointment.start = TimeZoneInfo.ConvertTimeFromUtc(appointment.start, tzi);
            //            if (appointment.end.HasValue)
            //            {
            //                appointment.end = TimeZoneInfo.ConvertTimeFromUtc(appointment.end.Value, tzi);
            //            }
            //            appointment.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(appointment.cancellationDate ?? DateTime.Now, tzi);
            //        }
            //    }
            //}

            return Ok(visit);
        }

        // GET: api/Visits/visitIdString
        [HttpGet("VisitByName/{visitIdString}")]
        public async Task<ActionResult> GetVisitByIdString([FromRoute] string visitIdString)
        {
            var visit = await _context.Visits.Include(v => v.patient).Include(v => v.appointments).Where(v => v.visitIdString == visitIdString).Where(v => !v.cancelled).FirstOrDefaultAsync();
            if (visit == default(Visit)) {
                visit = null;
                return Ok(visit);
            } else
            {
                tzi = await _context.GetLocalTimezoneInfo();

                visit.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(visit.cancellationDate ?? DateTime.Now, tzi);
                foreach (var appointment in visit.appointments)
                {
                    // set the times to UTC before we store it
                    appointment.start = TimeZoneInfo.ConvertTimeFromUtc(appointment.start, tzi);
                    if (appointment.end.HasValue)
                    {
                        appointment.end = TimeZoneInfo.ConvertTimeFromUtc(appointment.end.Value, tzi);
                    }
                    appointment.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(appointment.cancellationDate ?? DateTime.Now, tzi);
                }

                return Ok(visit);
            }
        }

        // GET: api/Visits/Patient/patientId
        [HttpGet("Patient/{id}")]
        public async Task<ActionResult<IEnumerable<Visit>>> GetVisitsByPatientId([FromRoute] int id)
        {
            var visit = await _context.Visits.Include(v => v.patient)
                                                .Include(v => v.appointments).ThenInclude(a => a.service)
                                                .Where(v => v.patientId == id).ToListAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            foreach (var vis in visit)
            {
                vis.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(vis.cancellationDate ?? DateTime.Now, tzi);
                foreach (var appointment in vis.appointments)
                {
                    // set the times to UTC before we store it
                    appointment.start = TimeZoneInfo.ConvertTimeFromUtc(appointment.start, tzi);
                    if (appointment.end.HasValue)
                    {
                        appointment.end = TimeZoneInfo.ConvertTimeFromUtc(appointment.end.Value, tzi);
                    }
                    
                    appointment.cancellationDate = TimeZoneInfo.ConvertTimeFromUtc(appointment.cancellationDate ?? DateTime.Now, tzi);
                }
            }

            return Ok(visit);
        }

        // PUT: api/Visits/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutVisit([FromRoute] int id, [FromBody] Visit visit)
        {
            if (id != visit.VisitId)
            {
                return Ok(null);
            }

            tzi = await _context.GetLocalTimezoneInfo();

            visit.cancellationDate = TimeZoneInfo.ConvertTimeToUtc(visit.cancellationDate ?? DateTime.Now);
            //foreach (var appointment in visit.appointments)
            //{
            //    // set the times to UTC before we store it
            //    appointment.start = TimeZoneInfo.ConvertTimeToUtc(appointment.start);
            //    if (appointment.end.HasValue)
            //    {
            //        appointment.end = TimeZoneInfo.ConvertTimeToUtc(appointment.end.Value);
            //    }
                
            //    appointment.cancellationDate = TimeZoneInfo.ConvertTimeToUtc(appointment.cancellationDate ?? DateTime.Now);
            //}

            _context.Update(visit);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VisitExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(visit);
        }

        // POST: api/Visits
        [HttpPost]
        public async Task<ActionResult> PostVisit([FromBody] Visit visit)
        {
            if(ModelState.IsValid)
            {
                tzi = await _context.GetLocalTimezoneInfo();

                visit.cancellationDate = TimeZoneInfo.ConvertTimeToUtc(visit.cancellationDate ?? DateTime.Now);
                visit.date = TimeZoneInfo.ConvertTimeToUtc(visit.date);
                _context.Visits.Add(visit);

                await _context.SaveChangesAsync();
                return CreatedAtAction("GetVisit", new { id = visit.VisitId }, visit);
            } else
            {
                return BadRequest();
            }
            //tzi = await _context.GetLocalTimezoneInfo();

            //visit.cancellationDate = TimeZoneInfo.ConvertTimeToUtc(visit.cancellationDate ?? DateTime.Now);
            //if (visit.appointments != null)
            //{
            //    foreach (var appointment in visit.appointments)
            //    {
            //        // set the times to UTC before we store it
            //        appointment.start = TimeZoneInfo.ConvertTimeToUtc(appointment.start);
            //        if (appointment.end.HasValue)
            //        {
            //            appointment.end = TimeZoneInfo.ConvertTimeToUtc(appointment.end.Value);
            //        }
            //        appointment.cancellationDate = TimeZoneInfo.ConvertTimeToUtc(appointment.cancellationDate ?? DateTime.Now);
            //    }
            //}
            //var patient = await _context.Patients.FindAsync(visit.patientId);
            //if (patient == null)
            //{//return an error
            //}
            //else
            //{
                //if (visit.appointments != null) {
                //    foreach (var appointment in visit.appointments)
                //    {
                //        appointment.service = await _context.Services.FindAsync(appointment.service.ServiceId);
                //        //km without this it tries to add a new service
                //    }
                //}
                // create the visit first with no appointments so we can get it's visitId and populate the appointments with it to create the link
                //List<Appointment> tempAppts = visit.appointments.ToList();                    
                //visit.appointments = new List<Appointment>();
                //visit.patient = patient;
                //_context.Visits.Add(visit); 

                //await _context.SaveChangesAsync();

                // update the appointments with the visitId
                //foreach (Appointment appt in tempAppts) {
                //    appt.visitId = visit.VisitId;
                //}
                //visit.appointments = tempAppts;
            //}
            
            //await _context.SaveChangesAsync();

            //return CreatedAtAction("GetVisit", new { id = visit.VisitId }, visit);
        }

        // DELETE: api/Visits/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVisit([FromRoute] int id)
        {
            var visit = await _context.Visits.FindAsync(id);
            if (visit == null)
            {
                return Ok(null);
            }

            _context.Visits.Remove(visit);
            await _context.SaveChangesAsync();

            return Ok(visit);
        }

        // add product to visit
        // remove product from visit

        // add required product to visit
        // remove required product from visit

        private bool VisitExists(int id)
        {
            return _context.Visits.Any(e => e.VisitId == id);
        }
    }
}