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
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Net.Http.Headers;

namespace EmilyEMRVS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly DataContext _context;
        private IHostingEnvironment _hostingEnvironment;
        private TimeZoneInfo tzi;

        public PatientsController(DataContext context, IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            List<Patient> result = await _context.Patients.Include(p => p.address)
                                            .Include(p => p.familyPhysician).ThenInclude(d => d.address)
                                            .Include(p => p.preferredPharmacy).ThenInclude(ph => ph.address)
                                            .Include(p => p.socialHistory)
                                            .ToListAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            foreach (Patient patient in result)
            {
                foreach (PatientSocialHistoryEntry social in patient.socialHistory) {
                    social.entryDate = TimeZoneInfo.ConvertTimeFromUtc(social.entryDate, tzi);
                }
            }

            return result;

        }

        // GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetPatient([FromRoute] int id)
        {
            var patient = await _context.Patients.Include(p => p.address)
                                                    .Include(p => p.familyPhysician).ThenInclude(d => d.address)
                                                    .Include(p => p.preferredPharmacy).ThenInclude(ph => ph.address)
                                                    .Include(p => p.socialHistory)
                                                    .Where(p => p.PatientId == id).FirstOrDefaultAsync();

            tzi = await _context.GetLocalTimezoneInfo();

            foreach (PatientSocialHistoryEntry social in patient.socialHistory)
            {
                social.entryDate = TimeZoneInfo.ConvertTimeFromUtc(social.entryDate, tzi);
            }

            return Ok(patient);
        }

        // PUT: api/Patients/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutPatient([FromRoute] int id, [FromBody] Patient patient)
        {
            if (id != patient.PatientId)
            {
                return Ok(null);
            }

            var dbEntity = await _context.Patients
                .Include(p => p.address)
                .Include(p => p.familyPhysician).ThenInclude(d => d.address)
                .Include(p => p.preferredPharmacy).ThenInclude(ph => ph.address)
                .Include(p => p.socialHistory)
                .FirstAsync(p => p.PatientId == id);

            tzi = await _context.GetLocalTimezoneInfo();

            if (patient.socialHistory != null)
            {
                // set the times to UTC before we store it
                foreach (PatientSocialHistoryEntry social in patient.socialHistory)
                {
                    social.entryDate = TimeZoneInfo.ConvertTimeToUtc(social.entryDate);
                }

                foreach (var socialEntry in patient.socialHistory.ToList())
                {
                    if (dbEntity.socialHistory.Count(social => social.patientSocialHistoryEntryId == socialEntry.patientSocialHistoryEntryId) == 0)
                    {
                        dbEntity.socialHistory.Add(socialEntry);
                    }
                }
                foreach (var socialEntry in dbEntity.socialHistory.ToList())
                {
                    if (patient.socialHistory.Count(social => social.patientSocialHistoryEntryId == socialEntry.patientSocialHistoryEntryId) == 0)
                    {
                        dbEntity.socialHistory.Remove(socialEntry);
                    }
                }
            }

            dbEntity.clientId = patient.clientId;
            dbEntity.firstName = patient.firstName;
            dbEntity.lastName = patient.lastName;
            dbEntity.nickName = patient.nickName;
            dbEntity.birthDate = patient.birthDate;
            dbEntity.gender = patient.gender;
            dbEntity.email = patient.email;
            dbEntity.homeNumber = patient.homeNumber;
            dbEntity.mobileNumber = patient.mobileNumber;
            dbEntity.communicationPreference = patient.communicationPreference;
            dbEntity.sendAppointmentNotifications = patient.sendAppointmentNotifications;
            dbEntity.sendRetentionEmails = patient.sendRetentionEmails;
            dbEntity.isPreferred = patient.isPreferred;
            dbEntity.notesAndAlerts = patient.notesAndAlerts;
            dbEntity.addressId = patient.addressId;
            dbEntity.doctorId = patient.familyPhysician.DoctorId;
            dbEntity.pharmacyId = patient.preferredPharmacy.PharmacyId;

            _context.Patients.Update(dbEntity);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("exception -> ", ex);
            }

            return Ok(patient);
        }

        // POST: api/Patients
        [HttpPost]
        public async Task<ActionResult> PostPatient([FromBody] Patient patient)
        {
            patient.familyPhysician = null;
            patient.preferredPharmacy = null;

            tzi = await _context.GetLocalTimezoneInfo();

            // set the times to UTC before we store it
            foreach (PatientSocialHistoryEntry social in patient.socialHistory)
            {
                social.entryDate = TimeZoneInfo.ConvertTimeToUtc(social.entryDate);
            }

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPatient", new { id = patient.PatientId }, patient);
        }

        // DELETE: api/Patients/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePatient([FromRoute] int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return Ok(null);
            }

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return Ok(patient);
        }

        private bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.PatientId == id);
        }

        [HttpPost("Photo"), DisableRequestSizeLimit]
        public ActionResult UploadFile()
        {
            try
            {
                var file = Request.Form.Files[0];
                string folderName = "ClientApp/src/assets/Upload";
                string webRootPath = _hostingEnvironment.ContentRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                return Ok("Upload Successful.");
            }
            catch (System.Exception ex)
            {
                return Ok("Upload Failed: " + ex.Message);
            }
        }

        // GET: api/Patients/5
        [HttpGet("ListPhotos")]
        public async Task<ActionResult> GetListOfPhotos()
        {
            string folderName = "ClientApp/src/assets/Upload";
            string webRootPath = _hostingEnvironment.ContentRootPath;
            string newPath = Path.Combine(webRootPath, folderName);

            string[] filesindirectory = Directory.GetFiles(newPath);
            List<String> images = new List<string>(filesindirectory.Count());

            foreach (string item in filesindirectory)
            {
                images.Add(String.Format("{0}", System.IO.Path.GetFileName(item)));
            }
            return Ok(images);
        }
    }
}