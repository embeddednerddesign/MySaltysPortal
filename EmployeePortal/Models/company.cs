using EmilyEMRVS.Models;
using System.Collections.Generic;

namespace EmilyEMRVS.Models
{
    public class Company {

        public Company()
        {
            clinics = new List<Clinic>();
        }

        public int CompanyId { get; set; }
        public string name { get; set; }
        public string contactName { get; set; }
        public string contactPhone { get; set; }
        public string primaryBrandingColour { get; set; }
        public string accentBrandingColour { get; set; }
        public int minimumDuration { get; set; }
        public HoursOfOperation hoursOfOperation { get; set; }
        public string timezone { get; set; }

        public int? addressId { get; set; }
        public virtual Address address { get; set; }
        public virtual ICollection<Clinic> clinics { get; set; }

    }
}