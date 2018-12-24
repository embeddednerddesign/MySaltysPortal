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
            builder.Entity<RequiredProduct>().HasKey(p => new { p.ProductId, p.ServiceId});
            builder.Entity<RecommendedProduct>().HasKey(p => new { p.ProductId, p.ServiceId });
            builder.Entity<PackageProduct>().HasKey(p => new { p.ProductId, p.PackageId });
            builder.Entity<PackageService>().HasKey(p => new { p.ServiceId, p.PackageId });
            builder.Entity<SpecialProduct>().HasKey(p => new { p.ProductId, p.SpecialId });
            builder.Entity<StaffService>().HasKey(p => new { p.ServiceId, p.StaffId });
            builder.Entity<UserCategoryService>().HasKey(p => new { p.ServiceId, p.UserCategoryId });
            builder.Entity<PackageTax>().HasKey(p => new { p.PackageId, p.TaxId });
            builder.Entity<ProductTax>().HasKey(p => new { p.ProductId, p.TaxId });
            builder.Entity<ServiceTax>().HasKey(p => new { p.ServiceId, p.TaxId });
            builder.Entity<SpecialTax>().HasKey(p => new { p.SpecialId, p.TaxId });
            builder.Entity<ClinicRoom>().HasKey(p => new { p.ClinicId, p.RoomId });
            builder.Entity<ClinicTax>().HasKey(p => new { p.ClinicId, p.TaxId });

            builder.Entity<VisitProduct>()
                .HasKey(vp => new { vp.VisitId, vp.ProductId });

            builder.Entity<VisitProduct>()
                .HasOne(vp => vp.Visit)
                .WithMany(v => v.visitProducts)
                .HasForeignKey(vp => vp.VisitId);

            builder.Entity<VisitProduct>()
                .HasOne(vp => vp.Product)
                .WithMany(p => p.visitProducts)
                .HasForeignKey(vp => vp.ProductId);
        }

        public async Task<TimeZoneInfo> GetLocalTimezoneInfo() {
            var localtimezone = (await this.Companies.FirstOrDefaultAsync()).timezone;
            return TimeZoneInfo.FindSystemTimeZoneById(localtimezone);
        }

        public DbSet<Address> Addresses { get; set; }
        public DbSet<AppointmentViewModel> AppointmentViewModels { get; set; }
        public DbSet<Clinic> Clinics { get; set; }
        public DbSet<ClinicProduct> ClinicProduct { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<Lab> Labs { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<PatientViewModel> PatientViewModels { get; set; }
        public DbSet<Pharmacy> Pharmacies { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<Special> Specials { get; set; }
        public DbSet<Staff> Staff { get; set; }
        public DbSet<Tax> Taxes { get; set; }
        public DbSet<Visit> Visits { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<StaffService> StaffService { get; set; }
        public DbSet<StaffSchedule> StaffSchedules { get; set; }
        public DbSet<UserCategory> UserCategories { get; set; }
        public DbSet<HoursOfOperation> HoursOfOperation { get; set; }
        public DbSet<HoursOfOperationDay> HoursOfOperationDays { get; set; }
        public DbSet<VisitProduct> VisitProducts { get; set; }

    }
}
