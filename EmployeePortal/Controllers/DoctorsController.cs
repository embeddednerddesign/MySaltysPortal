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
    public class DoctorsController : ControllerBase
    {
        private readonly DataContext _context;

        public DoctorsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Doctors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
        {
            return await _context.Doctors.ToListAsync();
        }

        // GET: api/Doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetDoctor([FromRoute] int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            return Ok(doctor);
        }

        // PUT: api/Doctors/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutDoctor([FromRoute] int id, [FromBody] Doctor doctor)
        {
            if (id != doctor.DoctorId)
            {
                return Ok(null);
            }

            _context.Entry(doctor).State = EntityState.Modified;
            if (doctor.address != null)
            {
                _context.Entry(doctor.address).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoctorExists(id))
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

        // POST: api/Doctors
        [HttpPost]
        public async Task<ActionResult> PostDoctor([FromBody] Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDoctor", new { id = doctor.DoctorId }, doctor);
        }

        // DELETE: api/Doctors/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDoctor([FromRoute] int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return Ok(null);
            }

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return Ok(doctor);
        }

        private bool DoctorExists(int id)
        {
            return _context.Doctors.Any(e => e.DoctorId == id);
        }
    }
}