using EmilyEMRVS.Models;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace EmilyEMRVS.Models
{
    public class Staff {

        public Staff()
        {
            services = new List<StaffService>();
            staffSchedules = new List<StaffSchedule>();
        }

        public int StaffId { get; set; }
        public string name { get; set; }
        public virtual ICollection<StaffService> services { get; set; }
        public virtual ICollection<StaffSchedule> staffSchedules { get; set; }
    }

    public class StaffService
    {
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public int StaffId { get; set; }
        [JsonIgnore]
        public Staff Staff { get; set; }
    }
}
