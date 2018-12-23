using EmilyEMRVS.Models;

namespace EmilyEMRVS.Models
{
    public class Address {
        public int AddressId { get; set; }
        public string address1 { get; set; }
        public string address2 { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string postalCode { get; set; }
        public string province { get; set; }
    }
}