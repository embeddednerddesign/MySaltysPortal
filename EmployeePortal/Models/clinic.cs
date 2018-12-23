using EmilyEMRVS.Models;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace EmilyEMRVS.Models
{
    public class Clinic {

        public int clinicId { get; set; }
        public string name { get; set; }

        public int? addressId { get; set;}
        public virtual Address address { get; set; }
        public virtual ICollection<ClinicRoom> clinicRooms { get; set; }
        public virtual ICollection<ClinicTax> clinicTaxes { get; set; }
        public int? companyId { get; set; }
    }

    public class ClinicTax
    {
        public int ClinicId { get; set; }
        [JsonIgnore]
        public Clinic Clinic { get; set; }
        public int TaxId { get; set; }
        public Tax Tax { get; set; }
    }

    public class ClinicRoom
    {
        public int ClinicId { get; set; }
        [JsonIgnore]
        public Clinic Clinic { get; set; }
        public int RoomId { get; set; }
        public Room Room { get; set; }
    }
}