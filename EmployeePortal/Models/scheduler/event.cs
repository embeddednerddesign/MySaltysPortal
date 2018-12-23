using System;
using System.ComponentModel.DataAnnotations.Schema;
using EmilyEMRVS.Models;
using Newtonsoft.Json;

namespace EmilyEMRVS.Models
{
   
    public class Appointment {
        public int appointmentId { get; set; }
        public string title { get; set; }
        public bool? allDay { get; set; }
        public DateTime start { get; set; }
        public DateTime? end { get; set; }
        public string url { get; set; }
        public string className { get; set; }
        public bool? editable { get; set; }
        public bool? startEditable { get; set; }
        public bool? durationEditable { get; set; }
        public bool? resourceEditable { get; set; }
        // public string // background or inverse-background or empty
        public string rendering { get; set; }
        public bool? overlap { get; set; }
        public string constraint { get; set; }
        // public string // automatically populated
        public string source { get; set; }
        public string backgroundColor { get; set; }
        public string borderColor { get; set; }
        public string textColor { get; set; }
        public string resourceId { get; set; }
        public string visitIdString { get; set; }
       
        public string cancellationReason { get; set; }
        public bool? isCancellationAlert { get; set; }
        public DateTime? cancellationDate { get; set; }
        public bool? cancelled { get; set; }
        public bool? editing { get; set; }
        public virtual Service service { get; set; }
        public int? serviceId { get; set; }
        public int visitId { get; set; }
    }
}