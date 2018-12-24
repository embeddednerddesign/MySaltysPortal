using EmployeePortal.Models;

namespace EmployeePortal.Models
{
    public class Lab {
        public int LabId { get; set; }
        public string name { get; set; }
        public string phoneNumber1 { get; set; }
        public string phoneNumber2 { get; set; }
        public string phoneNumber3 { get; set; }
        public string faxNumber { get; set; } 
        public string email { get; set; }
        public string website { get; set; }
        public HoursOfOperation hoursOfOperation { get; set; }
        public string labType { get; set; }

        public int? addressId { get; set; }
        public virtual Address address { get; set; }
    }
}