using System;
using EmployeePortal.Models;

namespace EmployeePortal.Models
{
    public class HomeContent {
        public int HomeContentId { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string path { get; set; }
        public string backgroundImage { get; set; }
        public string createdBy { get; set; }
        public DateTime createdOn { get; set; }
    }
}