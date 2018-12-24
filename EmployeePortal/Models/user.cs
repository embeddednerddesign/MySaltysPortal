using EmployeePortal.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace EmployeePortal.Models
{
    public class User: IdentityUser {
        // public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Avatar { get; set; }
        public string Role { get; set; }
        public int? AddressId { get; set; }
        public virtual Address Address { get; set; }
    }
}