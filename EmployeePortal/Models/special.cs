using EmilyEMRVS.Models;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace EmilyEMRVS.Models
{
    public class Special {

        public Special()
        {
            specialTaxes = new List<SpecialTax>();
            services = new List<Service>();
            products = new List<SpecialProduct>();
        }

        public int SpecialId { get; set; }
        public string name { get; set; }
        public int code { get; set; }
        public string totalOfIndividualPrices { get; set; }
        public float retailPrice { get; set; }

        public virtual ICollection<SpecialProduct> products { get; set; }
        public virtual ICollection<Service> services { get; set; }
        public virtual ICollection<SpecialTax> specialTaxes { get; set; }
    }

    public class SpecialTax
    {
        public int SpecialId { get; set; }
        [JsonIgnore]
        public Special Special { get; set; }
        public int TaxId { get; set; }
        public Tax Tax { get; set; }
    }
}
