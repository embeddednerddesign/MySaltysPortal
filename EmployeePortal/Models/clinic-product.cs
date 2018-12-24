using EmployeePortal.Models;
using System.Collections.Generic;

namespace EmployeePortal.Models
{
    public class ClinicProduct {
        public int ClinicProductId { get; set; }
        public int clinicId { get; set; }
        public int productId { get; set; }
        public int quantityInStock { get; set; }
        public float retailPrice { get; set; }
        public float wholesalePrice { get; set; }
        //public List<string> taxIds { get; set; }
    }
}