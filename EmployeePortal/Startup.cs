using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EmployeePortal.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;

namespace EmployeePortal
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("DataContext");

            services.AddDbContext<DataContext>(o => o.UseSqlServer(connectionString));

            services.AddIdentity<User, IdentityRole>(options => {
                //Removing some password requirements right now. TODO: Strengthen for production
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 4;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
            }).AddEntityFrameworkStores<DataContext>().AddDefaultTokenProviders();

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // remove default claims
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(cfg => {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = Configuration["JWT:JwtIssuer"],
                    ValidAudience = Configuration["JWT:JwtIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:JwtKey"])),
                    ClockSkew = TimeSpan.Zero // remove token expiration delay
                };
            });
            // services.AddDefaultIdentity<IdentityUser>()
            //     .AddEntityFrameworkStores<DataContext>();
            services.AddAutoMapper();
            services.AddMvc().AddJsonOptions(options => {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.Configure<JwtSettings>(Configuration.GetSection("JWT"));
            //services.AddSwaggerGen(c =>
            //{
            //    c.SwaggerDoc("v1", new Info { Title = "EmployeePortalAPI", Version = "v1" });
            //});

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public async void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            app.UseStaticFiles();
            app.UseHttpsRedirection();
            
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
                app.UseSpa(spa =>
                {
                    // To learn more about options for serving an Angular SPA from ASP.NET Core,
                    // see https://go.microsoft.com/fwlink/?linkid=864501

                    spa.Options.SourcePath = "ClientApp";
                });
            }

            //// Enable middleware to serve generated Swagger as a JSON endpoint.
            //app.UseSwagger();

            //// Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            //// specifying the Swagger JSON endpoint.
            //app.UseSwaggerUI(c =>
            //{
            //    c.SwaggerEndpoint("/swagger/v1/swagger.json", "EmployeePortalAPI V1");
            //});
            
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<DataContext>())
                {
                    context.Database.Migrate();
                    using (var userManagerService = serviceScope.ServiceProvider.GetRequiredService<UserManager<User>>())
                    {
                        //if (context.Database.GetPendingMigrations().Any()) {
                        
                        //}
                        await SeedData(context, userManagerService);
                    }
                }
            }
        }

        private async Task SeedData(DataContext context, UserManager<User> userManagerService)
        {
            if (context.Taxes.Count() == 0)
            {
                context.Taxes.AddRange(
                    new Tax
                    {
                        name = "GST",
                        value = 0.05m
                    },
                    new Tax
                    {
                        name = "PST",
                        value = 0.07m
                    }
                );
            }

            context.SaveChanges();

            if (context.Addresses.Count() == 0)
            {
                context.Addresses.Add(new Models.Address
                {
                    address1 = "1234 Test Lane",
                    address2 = "5678 Test St",
                    city = "Penticton",
                    province = "British Columbia",
                    country = "Canada",
                    postalCode = "V2A 1Z5"
                });
            }

            context.SaveChanges();

            if (context.Clinics.Count() == 0)
            {
                context.Clinics.Add(new Models.Clinic
                {
                    name = "DermMedica Clinic",
                    addressId = context.Addresses.FirstOrDefault().AddressId
                });
            }
            context.SaveChanges();
            try
            {
                if (context.Clinics.Where(c => c.name == "DermMedica Clinic").First().addressId == null)
                {
                    context.Companies.Where(c => c.name == "DermMedica Clinic").First().addressId = context.Addresses.First().AddressId;
                }
            }
            catch { }

            context.SaveChanges();

            HoursOfOperation seedHOO = new HoursOfOperation();
            seedHOO.hoursOfOperationId = 0;
            seedHOO.hoursOfOperationDays = new List<HoursOfOperationDay>();
            HoursOfOperationDay seedHOOD = new HoursOfOperationDay();
            seedHOOD.closed = true;
            seedHOOD.dayofweek = "Sunday";
            seedHOOD.openTime = new DateTime(2018, 01, 01, 16, 00, 00);
            seedHOOD.closeTime = new DateTime(2018, 01, 01, 00, 00, 00);
            seedHOO.hoursOfOperationDays.Add(seedHOOD);
            seedHOOD = new HoursOfOperationDay();
            seedHOOD.closed = false;
            seedHOOD.dayofweek = "Monday";
            seedHOOD.openTime = new DateTime(2018, 01, 01, 16, 00, 00);
            seedHOOD.closeTime = new DateTime(2018, 01, 01, 00, 00, 00);
            seedHOO.hoursOfOperationDays.Add(seedHOOD);
            seedHOOD = new HoursOfOperationDay();
            seedHOOD.closed = false;
            seedHOOD.dayofweek = "Tuesday";
            seedHOOD.openTime = new DateTime(2018, 01, 01, 16, 00, 00);
            seedHOOD.closeTime = new DateTime(2018, 01, 01, 00, 00, 00);
            seedHOO.hoursOfOperationDays.Add(seedHOOD);
            seedHOOD = new HoursOfOperationDay();
            seedHOOD.closed = false;
            seedHOOD.dayofweek = "Wednesday";
            seedHOOD.openTime = new DateTime(2018, 01, 01, 16, 00, 00);
            seedHOOD.closeTime = new DateTime(2018, 01, 01, 00, 00, 00);
            seedHOO.hoursOfOperationDays.Add(seedHOOD);
            seedHOOD = new HoursOfOperationDay();
            seedHOOD.closed = false;
            seedHOOD.dayofweek = "Thursday";
            seedHOOD.openTime = new DateTime(2018, 01, 01, 16, 00, 00);
            seedHOOD.closeTime = new DateTime(2018, 01, 01, 00, 00, 00);
            seedHOO.hoursOfOperationDays.Add(seedHOOD);
            seedHOOD = new HoursOfOperationDay();
            seedHOOD.closed = false;
            seedHOOD.dayofweek = "Friday";
            seedHOOD.openTime = new DateTime(2018, 01, 01, 16, 00, 00);
            seedHOOD.closeTime = new DateTime(2018, 01, 01, 00, 00, 00);
            seedHOO.hoursOfOperationDays.Add(seedHOOD);
            seedHOOD = new HoursOfOperationDay();
            seedHOOD.closed = true;
            seedHOOD.dayofweek = "Saturday";
            seedHOOD.openTime = new DateTime(2018, 01, 01, 16, 00, 00);
            seedHOOD.closeTime = new DateTime(2018, 01, 01, 00, 00, 00);
            seedHOO.hoursOfOperationDays.Add(seedHOOD);

            if (context.Companies.Count() == 0)
            {
                List<Clinic> tempClinics = new List<Clinic>();
                tempClinics.Add(context.Clinics.FirstOrDefault());
                context.Companies.Add(new Models.Company
                {
                    name = "DermMedica Company",
                    contactName = "Dr. Craig Crippen",
                    contactPhone = "555-555-5555",
                    primaryBrandingColour = "British Columbia",
                    accentBrandingColour = "Canada",
                    minimumDuration = 10,
                    hoursOfOperation = seedHOO,
                    addressId = context.Addresses.FirstOrDefault().AddressId,
                    clinics = tempClinics,
                    timezone = "Pacific Standard Time"
                });
            }
            else
            {
                var company = context.Companies
                    .Include(e => e.hoursOfOperation).ThenInclude(e => e.hoursOfOperationDays)
                    .First();

                if (company.timezone == null || company.timezone == "")
                {
                    company.timezone = "Pacific Standard Time";
                }

                if (company.hoursOfOperation == null || company.hoursOfOperation.hoursOfOperationDays == null || company.hoursOfOperation.hoursOfOperationDays.Count == 0)
                {
                    company.hoursOfOperation = seedHOO;
                }
            }

            context.SaveChanges();

            if (context.Companies.First().addressId == null)
            {
                context.Companies.First().addressId = context.Addresses.First().AddressId;
            }

            if (context.Clinics.Count() == 0)
            {
                context.Clinics.Add(new Models.Clinic
                {
                    name = "DermMedica Clinic",
                    addressId = context.Addresses.FirstOrDefault().AddressId
                });
            }

            if (context.ServiceCategories.Count() == 0)
            {
                context.ServiceCategories.Add(new Models.ServiceCategory { name = "Service Cat 1" });
                context.ServiceCategories.Add(new Models.ServiceCategory { name = "Service Cat 2" });
            }
            if (context.ProductCategories.Count() == 0)
            {
                context.ProductCategories.Add(new Models.ProductCategory { name = "Product Cat 1" });
                context.ProductCategories.Add(new Models.ProductCategory { name = "Product Cat 2" });
            }

            context.SaveChanges();

            if (context.Products.Count() == 0)
            {
                context.Products.Add(new Models.Product
                {
                    name = "Product 1",
                    productCode = "1",
                    quantityInStock = 1,
                    quantity = 1,
                    retailPrice = 9.99F,
                    wholesalePrice = 6.99F,
                    productCategoryId = context.ProductCategories.FirstOrDefault().ProductCategoryId
                });
                context.Products.Add(new Models.Product
                {
                    name = "Product 2",
                    productCode = "2",
                    quantityInStock = 1,
                    quantity = 1,
                    retailPrice = 19.99F,
                    wholesalePrice = 16.99F,
                    productCategoryId = context.ProductCategories.FirstOrDefault().ProductCategoryId
                });
            }
            if (context.Services.Count() == 0)
            {
                context.Services.Add(new Models.Service
                {
                    serviceName = "Service 1",
                    quantity = 1,
                    billingCode = 1,
                    serviceAltName = "Alt Service 1",
                    defaultDurationMinutes = 60,
                    subType = "Botox",
                    diagnosticCode = 100,
                    serviceIDColour = "#555555",
                    templateIcon = "",
                    defaultPrice = 6.99F,
                    status = true,
                    governmentBilling = false,
                    serviceCategoryId = context.ServiceCategories.FirstOrDefault().ServiceCategoryId
                });
                context.Services.Add(new Models.Service
                {
                    serviceName = "Service 2",
                    quantity = 1,
                    billingCode = 1,
                    serviceAltName = "Alt Service 2",
                    defaultDurationMinutes = 45,
                    subType = "CoolSculpt",
                    diagnosticCode = 200,
                    serviceIDColour = "#888888",
                    templateIcon = "",
                    defaultPrice = 89.99F,
                    status = true,
                    governmentBilling = true,
                    serviceCategoryId = context.ServiceCategories.FirstOrDefault().ServiceCategoryId
                });
            }
            else
            {
                foreach (Service serv in context.Services)
                {
                    if (serv.userCategories == null)
                    {
                        serv.userCategories = new List<UserCategoryService>();
                    }
                }
            }

            context.SaveChanges();

            if (context.UserCategories.Count() == 0)
            {
                context.UserCategories.Add(new UserCategory
                {
                    categoryName = "Doctor"
                });
                context.UserCategories.Add(new UserCategory
                {
                    categoryName = "Nurse"
                });
                context.UserCategories.Add(new UserCategory
                {
                    categoryName = "Technician"
                });
                context.UserCategories.Add(new UserCategory
                {
                    categoryName = "Admin"
                });
                context.UserCategories.Add(new UserCategory
                {
                    categoryName = "Accounting"
                });
                context.UserCategories.Add(new UserCategory
                {
                    categoryName = "Full Admin"
                });
            }

            if (context.Users.Count() == 0)
            {
                var user = new User
                {
                    FirstName = "Donovan",
                    LastName = "Rogall",
                    Avatar = "avatar",
                    Role = "admin",
                    PhoneNumber = "555-555-5555",
                    Email = "email@email.com",
                    UserName = "email@email.com",
                    AddressId = context.Addresses.FirstOrDefault().AddressId,
                };
                var result = await userManagerService.CreateAsync(user, "password123");
            }

            if (context.Staff.Count() == 0)
            {
                context.Staff.Add(new Models.Staff
                {
                    name = "Staff Member 1",
                });
                context.Staff.Add(new Models.Staff
                {
                    name = "Staff Member 2",
                });
                context.Staff.Add(new Models.Staff
                {
                    name = "Staff Member 3",
                });
                context.Staff.Add(new Models.Staff
                {
                    name = "Staff Member 4",
                });
            }
            else if (context.Staff.Count() < 4)
            {
                context.Staff.Add(new Models.Staff
                {
                    name = "Staff Member 4",
                });
            }
            context.SaveChanges();
            if (context.StaffService.Count() == 0)
            {
                foreach (Staff staff in context.Staff)
                {
                    foreach (Service service in context.Services)
                    {
                        context.StaffService.Add(new StaffService { Service = service, Staff = staff });
                    }
                }
            }
            context.SaveChanges();

            if (context.Doctors.Count() == 0)
            {
                context.Doctors.Add(new Models.Doctor
                {
                    proTitle = "Dr.",
                    firstName = "Craig",
                    lastName = "Crippen",
                    phoneNumber = "555-555-5555",
                    faxNumber = "555-555-6666",
                    email = "craig@dermedica.com",
                    website = "www.dermmedica.com",
                    hoursOfOperation = seedHOO,
                    specialty = "Plastic Surgery",
                    addressId = context.Addresses.FirstOrDefault().AddressId
                });
            }

            if (context.Pharmacies.Count() == 0)
            {
                context.Pharmacies.Add(new Models.Pharmacy
                {
                    name = "Test Pharmacy 1",
                    phoneNumber1 = "555-555-5555",
                    phoneNumber2 = "555-555-5555",
                    phoneNumber3 = "555-555-5555",
                    faxNumber = "555-555-5555",
                    email = "pharmacy@email.com",
                    website = "www.pharmacy.com",
                    hoursOfOperation = seedHOO,
                    addressId = context.Addresses.FirstOrDefault().AddressId
                });
            }

            if (context.Rooms.Count() == 0)
            {
                context.Rooms.Add(new Models.Room
                {
                    roomName = "Room 1",
                });
            }

            context.SaveChanges();

            if (context.Patients.Count() <= 1)
            {
                context.Patients.Add(new Models.Patient
                {
                    firstName = "Patient",
                    lastName = "Number 1",
                    nickName = "Patient 1",
                    clientId = 9999999999,
                    birthDate = "01/01/2000",
                    gender = "M",
                    email = "patient1@patient.com",
                    homeNumber = "555-555-5555",
                    mobileNumber = "555-555-5555",
                    isPreferred = true,
                    communicationPreference = "Email",
                    addressId = context.Addresses.FirstOrDefault().AddressId,
                    doctorId = context.Doctors.FirstOrDefault().DoctorId,
                    pharmacyId = context.Pharmacies.FirstOrDefault().PharmacyId
                });
                context.Patients.Add(new Models.Patient
                {
                    firstName = "Patient",
                    lastName = "Number 2",
                    nickName = "Patient 2",
                    clientId = 9999999999,
                    birthDate = "01/01/2000",
                    gender = "F",
                    email = "patient1@patient.com",
                    homeNumber = "555-555-5555",
                    mobileNumber = "555-555-5555",
                    isPreferred = true,
                    communicationPreference = "Email",
                    addressId = context.Addresses.FirstOrDefault().AddressId,
                    doctorId = context.Doctors.FirstOrDefault().DoctorId,
                    pharmacyId = context.Pharmacies.FirstOrDefault().PharmacyId
                });
                context.Patients.Add(new Models.Patient
                {
                    firstName = "Patient",
                    lastName = "Number 3",
                    nickName = "Patient 3",
                    clientId = 9999999999,
                    birthDate = "01/01/2000",
                    gender = "F",
                    email = "patient1@patient.com",
                    homeNumber = "555-555-5555",
                    mobileNumber = "555-555-5555",
                    isPreferred = false,
                    communicationPreference = "Email",
                    addressId = context.Addresses.FirstOrDefault().AddressId,
                    doctorId = context.Doctors.FirstOrDefault().DoctorId,
                    pharmacyId = context.Pharmacies.FirstOrDefault().PharmacyId
                });
            }

            context.SaveChanges();

            if (context.Visits.Count() == 0)
            {
                context.Visits.Add(new Models.Visit
                {
                    visitIdString = "",
                    visitNotes = "",
                    patientNotes = "",
                    cancellationReason = "",
                    isCancellationAlert = false,
                    cancellationDate = new DateTime(2018, 09, 18, 10, 00, 00, DateTimeKind.Utc),
                    cancelled = false,
                    patientId = context.Patients.FirstOrDefault().PatientId
                });
            }
            else
            {
                foreach (Models.Visit vis in context.Visits)
                {
                    vis.cancellationDate = DateTime.SpecifyKind(vis.cancellationDate ?? DateTime.Now, DateTimeKind.Utc);
                }
            }

            if (context.Appointments.Count() > 0)
            {
                foreach (Appointment appt in context.Appointments)
                {
                    appt.cancellationDate = DateTime.SpecifyKind(appt.cancellationDate ?? DateTime.Now, DateTimeKind.Utc);
                    appt.start = DateTime.SpecifyKind(appt.start, DateTimeKind.Utc);
                    appt.end = DateTime.SpecifyKind(appt.end.Value, DateTimeKind.Utc);
                }
            }

            context.SaveChanges();

            context.Database.ExecuteSqlCommand("DELETE FROM Appointments where ServiceId is null");

            context.SaveChanges();

        }
    }
}
