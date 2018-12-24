using EmployeePortal.Models;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace EmployeePortal.Models
{
    public class Package {

        public Package()
        {
            packageTaxes = new List<PackageTax>();
            packageServices = new List<PackageService>();
            packageProducts = new List<PackageProduct>();
        }

        public int PackageId { get; set; }
        public string name { get; set; }
        public string totalOfIndividualPrices { get; set; }
        public float retailPrice { get; set; }
        public string packageProductsString { get; set; }

        public virtual ICollection<PackageProduct> packageProducts { get; set; }
        public virtual ICollection<PackageService> packageServices { get; set; }
        public virtual ICollection<PackageTax> packageTaxes { get; set; }
    }

    public class PackageTax
    {
        public int PackageId { get; set; }
        [JsonIgnore]
        public Package Package { get; set; }
        public int TaxId { get; set; }
        public Tax Tax { get; set; }
    }
}