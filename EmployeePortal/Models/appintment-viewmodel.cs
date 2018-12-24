using EmployeePortal.Models;

namespace EmployeePortal.Models
{
    public class AppointmentViewModel {
        public int AppointmentViewModelId { get; set; }
        public string start { get; set; }
        public string end { get; set; }
        public string resourceId { get; set; }
        public bool isSelection { get; set; }
    }
}