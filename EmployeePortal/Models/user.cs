using EmilyEMRVS.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace EmilyEMRVS.Models
{
    public class User: IdentityUser {
        // public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Avatar { get; set; }
        public bool CanSetBreaks { get; set; }
        // public string // roles { get; set; } }Role[];
        // public string // groups { get; set; } }Group[];
        public bool ServiceProvider { get; set; }

        public int? UserCategoryId { get; set; }
        public virtual UserCategory UserCategory { get; set; }
        public int? AddressId { get; set; }
        public virtual Address Address { get; set; }
        public virtual ICollection<Clinic> Clinics { get; set; }
    }
}