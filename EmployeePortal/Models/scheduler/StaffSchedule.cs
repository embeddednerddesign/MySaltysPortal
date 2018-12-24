using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace EmployeePortal.Models
{
    public enum ScheduleRecurrence
    {
        NoRepeat = 0,
        Weekly = 1,
        Every2Weeks,
        Every3Weeks,
        Every4Weeks,
    }
    public class StaffSchedule
    {
        public int StaffScheduleId { get; set; }
        public string Title { get; set; }
        public int ParentId { get; set; }
        public ScheduleRecurrence Recurrence { get; set; }
        public string Notes { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public DateTime EndDate { get; set; }
        public int StaffId{ get; set;}
        [ForeignKey("StaffId")]
        public virtual Staff Staff{ get; set;}

    }
}
