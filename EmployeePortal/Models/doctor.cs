using EmilyEMRVS.Models;

namespace EmilyEMRVS.Models
{
    public class Doctor {
        public int DoctorId { get; set; }
        public string proTitle { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string phoneNumber { get; set; }
        public string faxNumber { get; set; } 
        public string email { get; set; }
        public string website { get; set; }
        public HoursOfOperation hoursOfOperation { get; set; }
        public string specialty { get; set; }

        public int? addressId { get; set; }
        public virtual Address address { get; set; }
    }
}