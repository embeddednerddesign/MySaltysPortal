using EmilyEMRVS.Models;

namespace EmilyEMRVS.Models
{
    public class Pharmacy {
        public int PharmacyId { get; set; }
        public string name { get; set; }
        public string phoneNumber1 { get; set; }
        public string phoneNumber2 { get; set; }
        public string phoneNumber3 { get; set; }
        public string faxNumber { get; set; } 
        public string email { get; set; }
        public string website { get; set; }
        public HoursOfOperation hoursOfOperation { get; set; }

        public int? addressId { get; set; }
        public virtual Address address { get; set; }
    }
}