using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmilyEMRVS.Models;
using Microsoft.AspNetCore.Authorization;

namespace EmilyEMRVS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClinicsController : ControllerBase
    {
        private readonly DataContext _context;

        public ClinicsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Clinics
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Clinic>>> GetClinics()
        {
            return await _context.Clinics
                            .Include(c => c.address)
                            .Include(c => c.clinicRooms)
                            .Include(c => c.clinicTaxes)
                            .ToListAsync();
        }

        // GET: api/Clinics/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetClinic([FromRoute] int id)
        {
            var clinic = await _context.Clinics
                            .Include(c => c.address)
                            .Include(c => c.clinicRooms)
                            .Include(c => c.clinicTaxes).Where(c => c.clinicId == id).FirstOrDefaultAsync();

            return Ok(clinic);
        }

        // PUT: api/Clinics/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutClinic([FromRoute] int id, [FromBody] Clinic clinic)
        {
            if (id != clinic.clinicId)
            {
                return Ok(null);
            }

            var dbClinic = await _context.Clinics
               .Include(c => c.address)
               .Include(c => c.clinicRooms)
               .Include(c => c.clinicTaxes)
               .FirstAsync(c => c.clinicId == clinic.clinicId);


            foreach (var clinicRoom in clinic.clinicRooms.ToList())
            {
               if (dbClinic.clinicRooms.Count(rm => rm.RoomId == clinicRoom.RoomId) == 0)
               {
                   dbClinic.clinicRooms.Add(clinicRoom);
               }
            }
            foreach (var clinicRoom in dbClinic.clinicRooms.ToList())
            {
               if (clinic.clinicRooms.Count(rm => rm.RoomId == clinicRoom.RoomId) == 0)
               {
                   dbClinic.clinicRooms.Remove(clinicRoom);
               }
            }

            foreach (var clinicTax in clinic.clinicTaxes.ToList())
            {
               if (dbClinic.clinicTaxes.Count(tx => tx.TaxId == clinicTax.TaxId) == 0)
               {
                   dbClinic.clinicTaxes.Add(clinicTax);
               }
            }
            foreach (var clinicTax in dbClinic.clinicTaxes.ToList())
            {
               if (clinic.clinicTaxes.Count(tx => tx.TaxId == clinicTax.TaxId) == 0)
               {
                   dbClinic.clinicTaxes.Remove(clinicTax);
               }
            }

            dbClinic.addressId = clinic.addressId;
            dbClinic.name = clinic.name;
            dbClinic.companyId = clinic.companyId;

            _context.Clinics.Update(dbClinic);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClinicExists(id))
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

        // POST: api/Clinics
        [HttpPost]
        public async Task<ActionResult> PostClinic([FromBody] Clinic clinic)
        {
            List<ClinicRoom> clinicRooms = clinic.clinicRooms.ToList();
            List<ClinicTax> clinicTaxes = clinic.clinicTaxes.ToList();
            clinic.clinicRooms = null;
            clinic.clinicTaxes = null;
            _context.Clinics.Add(clinic);

            await _context.SaveChangesAsync();

            foreach (ClinicRoom cr in clinicRooms)
            {
                cr.ClinicId = clinic.clinicId;
            }
            foreach (ClinicTax ct in clinicTaxes)
            {
                ct.ClinicId = clinic.clinicId;
            }
            clinic.clinicRooms = clinicRooms;
            clinic.clinicTaxes = clinicTaxes;

            _context.Clinics.Update(clinic);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClinic", new { id = clinic.clinicId }, clinic);
        }

        // DELETE: api/Clinics/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteClinic([FromRoute] int id)
        {
            var clinic = await _context.Clinics.FindAsync(id);
            if (clinic == null)
            {
                return Ok(null);
            }

            _context.Clinics.Remove(clinic);
            await _context.SaveChangesAsync();

            return Ok(clinic);
        }

        private bool ClinicExists(int id)
        {
            return _context.Clinics.Any(e => e.clinicId == id);
        }
    }
}