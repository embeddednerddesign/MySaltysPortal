using EmilyEMRVS.Models;
using System;
using System.Collections.Generic;

namespace EmilyEMRVS.Models
{
    public class Patient {
        public int PatientId { get; set; }
        public long clientId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string nickName { get; set; }
        public string birthDate { get; set; }
        public string gender { get; set; }
        public string email { get; set; }
        public string homeNumber { get; set; }
        public string mobileNumber { get; set; }
        public string communicationPreference { get; set; }
        public bool sendAppointmentNotifications { get; set; }
        public bool sendRetentionEmails { get; set; }
        public bool isPreferred { get; set; }
        public string notesAndAlerts { get; set; }

        public virtual ICollection<PatientSocialHistoryEntry> socialHistory { get; set; }
        public int? addressId { get; set; }
        public virtual Address address { get; set; }
        public int? doctorId { get; set; }
        public virtual Doctor familyPhysician { get; set; }
        public int? pharmacyId { get; set; }
        public virtual Pharmacy preferredPharmacy { get; set; }
    }

    public class PatientSocialHistoryEntry {
        public int patientSocialHistoryEntryId { get; set;}
        public DateTime entryDate { get; set;}
        public string enteredBy { get; set;}
        public string entryText { get; set;}
    }

}