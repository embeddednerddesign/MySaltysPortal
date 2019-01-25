namespace EmployeePortal.Models
{
    public class Company {
        public int CompanyId { get; set; }
        public string name { get; set; }
        public string contactName { get; set; }
        public string contactPhone { get; set; }
        public string timezone { get; set; }
        public int? addressId { get; set; }
        public virtual Address address { get; set; }
    }
}