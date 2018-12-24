using System;
using System.Collections.Generic;
using EmployeePortal.Models;

namespace EmployeePortal.Models
{
    public class HoursOfOperation {
        public int hoursOfOperationId { get; set; }
        public virtual ICollection<HoursOfOperationDay> hoursOfOperationDays { get; set; } = new List<HoursOfOperationDay>();
}

    public class HoursOfOperationDay {
        public int hoursOfOperationDayId { get; set; }
        public bool closed { get; set; }
        public string dayofweek { get; set; }
        public DateTime? openTime { get; set; }
        public DateTime? closeTime { get; set; }
    }
}
