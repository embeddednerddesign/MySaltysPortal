using EmilyEMRVS.Models;
using System.Collections.Generic;

namespace EmilyEMRVS.Models
{
    public class PatientViewModel {
        public int PatientViewModelId { get; set; }
        public long patientId { get; set; }
        public int clientId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string birthDate { get; set; }
        public string homeNumber { get; set; }
        public string mobileNumber { get; set; }
        public string nickName { get; set; }
        public string gender { get; set; }
        public string email { get; set; }
        public string communicationPreference { get; set; }
        public bool sendAppointmentNotifications { get; set; }
        public bool sendRetentionEmails { get; set; }
        public bool isPreferred { get; set; }
        public string notesAndAlerts { get; set; }
        public virtual ICollection<PatientSocialHistoryEntry> socialHistory { get; set; }
        public int? addressId { get; set; }
        public virtual Address address { get; set; }
        public int? doctorId { get; set; }
        public Doctor familyPhysician { get; set; }
        public int? pharmacyId { get; set; }
        public Pharmacy preferredPharmacy { get; set; }
    }
}