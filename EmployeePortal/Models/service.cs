using EmployeePortal.Models;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace EmployeePortal.Models
{
    public class Service {

        public Service()
        {
            serviceTaxes = new List<ServiceTax>();
            requiredProducts = new List<RequiredProduct>();
            recommendedProducts = new List<RecommendedProduct>();
            room = new List<Room>();
            equipment = new List<Equipment>();
        }

        public int ServiceId { get; set; }
        public string serviceName { get; set; }
        public int quantity { get; set; }
        public int billingCode { get; set; }
        public string serviceAltName { get; set; }
        public int defaultDurationMinutes { get; set; }
        public string subType { get; set; }
        public int diagnosticCode { get; set; }
        public string serviceIDColour { get; set; }
        public string templateIcon { get; set; }
        public float defaultPrice { get; set; }
        public bool status { get; set; }
        //public List<string> attachedForms { get; set; }
        public bool governmentBilling { get; set; }
        //public string products { get; set; }
        public string serviceReqProductsString { get; set; }
        public string serviceRecProductsString { get; set; }

        public int serviceCategoryId { get; set; }
        public ServiceCategory category { get; set; }
        public virtual ICollection<ServiceTax> serviceTaxes { get; set; }
        public virtual ICollection<RequiredProduct> requiredProducts { get; set; }
        public virtual ICollection<RecommendedProduct> recommendedProducts { get; set; }
        public virtual ICollection<UserCategoryService> userCategories { get; set; }
        public virtual ICollection<Room> room { get; set; }
        public virtual ICollection<Equipment> equipment { get; set; }
    }

    public class PackageService
    {
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public int ServiceQuantity { get; set; }
        public int PackageId { get; set; }
        [JsonIgnore]
        public Package Package { get; set; }
    }

    public class UserCategoryService
    {
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public int UserCategoryId { get; set; }
        [JsonIgnore]
        public UserCategory UserCategory { get; set; }
    }

    public class ServiceTax
    {
        public int ServiceId { get; set; }
        [JsonIgnore]
        public Service Service { get; set; }
        public int TaxId { get; set; }
        public Tax Tax { get; set; }
    }
}
