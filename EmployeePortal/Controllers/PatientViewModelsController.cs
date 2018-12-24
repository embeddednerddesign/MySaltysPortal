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
    public class PatientViewModelsController : ControllerBase
    {
        private readonly DataContext _context;
        private TimeZoneInfo tzi;

        public PatientViewModelsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/PatientViewModels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientViewModel>>> GetPatientViewModels()
        {
            List<PatientViewModel> result = await _context.PatientViewModels.Include(p => p.address)
                                            .Include(p => p.familyPhysician).ThenInclude(d => d.address)
                                            .Include(p => p.preferredPharmacy).ThenInclude(ph => ph.address)
                                            .Include(p => p.socialHistory)
                                            .ToListAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            foreach (PatientViewModel patient in result)
            {
                foreach (PatientSocialHistoryEntry social in patient.socialHistory)
                {
                    social.entryDate = TimeZoneInfo.ConvertTimeFromUtc(social.entryDate, tzi);
                }
            }

            return result;

        }

        // GET: api/PatientViewModels/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetPatientViewModel([FromRoute] int id)
        {
            var patientViewModel = await _context.PatientViewModels.Include(p => p.address)
                                                    .Include(p => p.familyPhysician).ThenInclude(d => d.address)
                                                    .Include(p => p.preferredPharmacy).ThenInclude(ph => ph.address)
                                                    .Include(p => p.socialHistory)
                                                    .Where(p => p.PatientViewModelId == id).FirstOrDefaultAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            foreach (PatientSocialHistoryEntry social in patientViewModel.socialHistory)
            {
                social.entryDate = TimeZoneInfo.ConvertTimeFromUtc(social.entryDate, tzi);
            }

            return Ok(patientViewModel);
        }

        // PUT: api/PatientViewModels/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutPatientViewModel([FromRoute] int id, [FromBody] PatientViewModel patientViewModel)
        {
            if (id != patientViewModel.PatientViewModelId)
            {
                return Ok(null);
            }

            var dbEntity = await _context.PatientViewModels
                .Include(p => p.address)
                .Include(p => p.familyPhysician).ThenInclude(d => d.address)
                .Include(p => p.preferredPharmacy).ThenInclude(ph => ph.address)
                .Include(p => p.socialHistory)
                .FirstAsync(p => p.PatientViewModelId == id);

            tzi = await _context.GetLocalTimezoneInfo();

            // set the times to UTC before we store it
            foreach (PatientSocialHistoryEntry social in dbEntity.socialHistory)
            {
                social.entryDate = TimeZoneInfo.ConvertTimeToUtc(social.entryDate);
            }

            if (patientViewModel.socialHistory != null)
            {
                foreach (var socialEntry in patientViewModel.socialHistory.ToList())
                {
                    if (dbEntity.socialHistory.Count(social => social.patientSocialHistoryEntryId == socialEntry.patientSocialHistoryEntryId) == 0)
                    {
                        dbEntity.socialHistory.Add(socialEntry);
                    }
                }
                foreach (var socialEntry in dbEntity.socialHistory.ToList())
                {
                    if (patientViewModel.socialHistory.Count(social => social.patientSocialHistoryEntryId == socialEntry.patientSocialHistoryEntryId) == 0)
                    {
                        dbEntity.socialHistory.Remove(socialEntry);
                    }
                }
            }

            dbEntity.clientId = patientViewModel.clientId;
            dbEntity.firstName = patientViewModel.firstName;
            dbEntity.lastName = patientViewModel.lastName;
            dbEntity.nickName = patientViewModel.nickName;
            dbEntity.birthDate = patientViewModel.birthDate;
            dbEntity.gender = patientViewModel.gender;
            dbEntity.email = patientViewModel.email;
            dbEntity.homeNumber = patientViewModel.homeNumber;
            dbEntity.mobileNumber = patientViewModel.mobileNumber;
            dbEntity.communicationPreference = patientViewModel.communicationPreference;
            dbEntity.sendAppointmentNotifications = patientViewModel.sendAppointmentNotifications;
            dbEntity.sendRetentionEmails = patientViewModel.sendRetentionEmails;
            dbEntity.isPreferred = patientViewModel.isPreferred;
            dbEntity.notesAndAlerts = patientViewModel.notesAndAlerts;
            dbEntity.addressId = patientViewModel.addressId;
            dbEntity.address = null;
            dbEntity.doctorId = patientViewModel.doctorId;
            dbEntity.familyPhysician = null;
            dbEntity.pharmacyId = patientViewModel.pharmacyId;
            dbEntity.preferredPharmacy = null;

            _context.PatientViewModels.Update(dbEntity);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientViewModelExists(id))
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

        // POST: api/PatientViewModels
        [HttpPost]
        public async Task<ActionResult> PostPatientViewModel([FromBody] PatientViewModel patientViewModel)
        {
            patientViewModel.familyPhysician = null;
            patientViewModel.preferredPharmacy = null;

            tzi = await _context.GetLocalTimezoneInfo();

            // set the times to UTC before we store it
            foreach (PatientSocialHistoryEntry social in patientViewModel.socialHistory)
            {
                social.entryDate = TimeZoneInfo.ConvertTimeToUtc(social.entryDate);
            }

            _context.PatientViewModels.Add(patientViewModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPatientViewModel", new { id = patientViewModel.PatientViewModelId }, patientViewModel);
        }

        // DELETE: api/PatientViewModels/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePatientViewModel([FromRoute] int id)
        {
            var patientViewModel = await _context.PatientViewModels.FindAsync(id);
            if (patientViewModel == null)
            {
                return Ok(null);
            }

            _context.PatientViewModels.Remove(patientViewModel);
            await _context.SaveChangesAsync();

            return Ok(patientViewModel);
        }

        private bool PatientViewModelExists(int id)
        {
            return _context.PatientViewModels.Any(e => e.PatientViewModelId == id);
        }
    }
}