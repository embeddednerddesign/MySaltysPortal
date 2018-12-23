using EmilyEMRVS.Models;
using System.Collections.Generic;
using System;
using Newtonsoft.Json;

namespace EmilyEMRVS.Models
{
    public class Visit {
        
        public int VisitId { get; set; }
        public string visitIdString { get; set; }
        public string visitNotes { get; set; }
        public string patientNotes { get; set; }
        public string cancellationReason { get; set; }
        public bool isCancellationAlert { get; set; }
        public DateTime? cancellationDate { get; set; }
        public bool cancelled { get; set; }
        public float totalVisitCost { get; set; }

        public bool checkedIn { get; set; }
        public bool confirmed { get; set; }
        public bool noShow { get; set; }

        public DateTime date { get; set; }

        public string createdBy { get; set; }

        public virtual ICollection<VisitProduct> visitProducts { get; set; }

        [JsonIgnore]
        public virtual Patient patient { get; set; }
        public int patientId { get; set; }
        public virtual ICollection<Appointment> appointments { get; set; }
    }
}