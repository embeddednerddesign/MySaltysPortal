using EmilyEMRVS.Models;

namespace EmilyEMRVS.Models
{
    public class ServiceCategory {
        public int ServiceCategoryId { get; set; }
        public string name { get; set; }
    }
    public class ServiceIDColour {
        public int ServiceIDColourId { get; set; }
        public string colour { get; set; }
    }
    public class ServiceTemplateIcon {
        public int ServiceTemplateIconId { get; set; }
        public string icon { get; set; }
    }
}