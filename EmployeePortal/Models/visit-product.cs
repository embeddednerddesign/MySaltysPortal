using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmilyEMRVS.Models
{
    public class VisitProduct
    {
        public int Id { get; set; }
        public int VisitId { get; set; }
        [JsonIgnore]
        public virtual Visit Visit { get; set; }
        public int ProductId { get; set; }
        [JsonIgnore]
        public virtual Product Product { get; set; }
        public int Quantity { get; set; }
    }
}
