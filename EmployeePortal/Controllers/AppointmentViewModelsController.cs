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
    public class AppointmentViewModelsController : ControllerBase
    {
        private readonly DataContext _context;

        public AppointmentViewModelsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/AppointmentViewModels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentViewModel>>> GetAppointmentViewModels()
        {
            return await _context.AppointmentViewModels.ToListAsync();
        }

        // GET: api/AppointmentViewModels/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetAppointmentViewModel([FromRoute] int id)
        {
            var appointmentViewModel = await _context.AppointmentViewModels.FindAsync(id);

            return Ok(appointmentViewModel);
        }

        // PUT: api/AppointmentViewModels/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutAppointmentViewModel([FromRoute] int id, [FromBody] AppointmentViewModel appointmentViewModel)
        {
            if (id != appointmentViewModel.AppointmentViewModelId)
            {
                return Ok(null);
            }

            _context.Entry(appointmentViewModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentViewModelExists(id))
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

        // POST: api/AppointmentViewModels
        [HttpPost]
        public async Task<ActionResult> PostAppointmentViewModel([FromBody] AppointmentViewModel appointmentViewModel)
        {
            _context.AppointmentViewModels.Add(appointmentViewModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppointmentViewModel", new { id = appointmentViewModel.AppointmentViewModelId }, appointmentViewModel);
        }

        // DELETE: api/AppointmentViewModels/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppointmentViewModel([FromRoute] int id)
        {
            var appointmentViewModel = await _context.AppointmentViewModels.FindAsync(id);
            if (appointmentViewModel == null)
            {
                return Ok(null);
            }

            _context.AppointmentViewModels.Remove(appointmentViewModel);
            await _context.SaveChangesAsync();

            return Ok(appointmentViewModel);
        }

        private bool AppointmentViewModelExists(int id)
        {
            return _context.AppointmentViewModels.Any(e => e.AppointmentViewModelId == id);
        }
    }
}