using EmilyEMRVS.Models;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace EmilyEMRVS.Models
{
    public class Product {

        public Product()
        {
            productTaxes = new List<ProductTax>();
        }

        public int ProductId { get; set; }
        public string name { get; set; }
        public string productCode { get; set; }
        public int quantityInStock { get; set; }
        public float retailPrice { get; set; }
        public float wholesalePrice { get; set; }
        public int quantity { get; set; }
        public int usageDuration { get; set;}

        public int productCategoryId { get; set; }
        public virtual ProductCategory category { get; set; }
        public virtual ICollection<ProductTax> productTaxes { get; set; }
        public virtual ICollection<VisitProduct> visitProducts { get; set; }
    }

    public class RequiredProduct
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ProductQuantity { get; set; }
        public int ServiceId { get; set; }
        [JsonIgnore]
        public Service Service { get; set; }
    }

    public class RecommendedProduct
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ProductQuantity { get; set; }
        public int ServiceId { get; set; }
        [JsonIgnore]
        public Service Service { get; set; }
    }

    public class PackageProduct
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ProductQuantity { get; set; }
        public int PackageId { get; set; }
        [JsonIgnore]
        public Package Package { get; set; }
    }

    public class SpecialProduct
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ProductQuantity { get; set; }
        public int SpecialId { get; set; }
        [JsonIgnore]
        public Special Special { get; set; }
    }

    public class ProductTax
    {
        public int ProductId { get; set; }
        [JsonIgnore]
        public Product Product { get; set; }
        public int TaxId { get; set; }
        public Tax Tax { get; set; }
    }
}
