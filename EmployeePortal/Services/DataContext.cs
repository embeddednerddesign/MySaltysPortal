using Microsoft.EntityFrameworkCore;
using EmployeePortal.Models;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace EmployeePortal
{
    public class DataContext : IdentityDbContext<User>
    {

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

        public async Task<TimeZoneInfo> GetLocalTimezoneInfo() {
            var localtimezone = (await Companies.FirstOrDefaultAsync()).timezone;
            return TimeZoneInfo.FindSystemTimeZoneById(localtimezone);
        }

        public DbSet<Address> Addresses { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<HomeContent> HomeContent { get; set; }

    }
}
