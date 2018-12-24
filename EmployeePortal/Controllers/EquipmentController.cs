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
    public class EquipmentController : ControllerBase
    {
        private readonly DataContext _context;

        public EquipmentController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Equipment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipment()
        {
            return await _context.Equipment.ToListAsync();
        }

        // GET: api/Equipment/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetEquipment([FromRoute] int id)
        {
            var equipment = await _context.Equipment.FindAsync(id);

            return Ok(equipment);
        }

        // PUT: api/Equipment/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutEquipment([FromRoute] int id, [FromBody] Equipment equipment)
        {
            if (id != equipment.EquipmentId)
            {
                return Ok(null);
            }

            _context.Entry(equipment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipmentExists(id))
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

        // POST: api/Equipment
        [HttpPost]
        public async Task<ActionResult> PostEquipment([FromBody] Equipment equipment)
        {
            _context.Equipment.Add(equipment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEquipment", new { id = equipment.EquipmentId }, equipment);
        }

        // DELETE: api/Equipment/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEquipment([FromRoute] int id)
        {
            var equipment = await _context.Equipment.FindAsync(id);
            if (equipment == null)
            {
                return Ok(null);
            }

            _context.Equipment.Remove(equipment);
            await _context.SaveChangesAsync();

            return Ok(equipment);
        }

        private bool EquipmentExists(int id)
        {
            return _context.Equipment.Any(e => e.EquipmentId == id);
        }
    }
}