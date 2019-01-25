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
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

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

            services.AddAutoMapper();
            services.AddMvc().AddJsonOptions(options => {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.Configure<JwtSettings>(Configuration.GetSection("JWT"));
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
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<DataContext>())
                {
                    context.Database.Migrate();
                    using (var userManagerService = serviceScope.ServiceProvider.GetRequiredService<UserManager<User>>())
                    {
                        await SeedData(context, userManagerService);
                    }
                }
            }
        }

        private async Task SeedData(DataContext context, UserManager<User> userManagerService)
        {
            if (context.Addresses.Count() == 0)
            {
                context.Addresses.Add(new Models.Address
                {
                    address1 = "1000 Lakeshore Dr",
                    address2 = "",
                    city = "Penticton",
                    province = "British Columbia",
                    country = "Canada",
                    postalCode = "V2A 1C1"
                });
            }

            context.SaveChanges();

            if (context.Companies.Count() == 0)
            {
                context.Companies.Add(new Company
                {
                    name = "Salty's Beachhouse",
                    contactName = "Alexandra Bonnett",
                    contactPhone = "250-493-5001",
                    addressId = context.Addresses.FirstOrDefault().AddressId,
                    timezone = "Pacific Standard Time"
                });
            }
            else
            {
                var company = context.Companies.First();

                if (company.timezone == null || company.timezone == "")
                {
                    company.timezone = "Pacific Standard Time";
                }
            }

            context.SaveChanges();

            if (context.Companies.First().addressId == null)
            {
                context.Companies.First().addressId = context.Addresses.First().AddressId;
            }

            context.SaveChanges();

            if (context.Users.Count() == 0)
            {
                var user = new User
                {
                    FirstName = "Donovan",
                    LastName = "Rogall",
                    Avatar = "avatar",
                    Role = "leader",
                    PhoneNumber = "555-555-5555",
                    Email = "donovan@mysaltys.com",
                    UserName = "donovan@mysaltys.com",
                    AddressId = context.Addresses.FirstOrDefault().AddressId,
                };
                var result = await userManagerService.CreateAsync(user, "end422");
                user = new User
                {
                    FirstName = "Alexandra",
                    LastName = "Bonnett",
                    Avatar = "avatar",
                    Role = "leader",
                    PhoneNumber = "555-555-5555",
                    Email = "alexandra@mysaltys.com",
                    UserName = "alexandra@mysaltys.com",
                    AddressId = context.Addresses.FirstOrDefault().AddressId,
                };
                result = await userManagerService.CreateAsync(user, "mysaltys2019");
            }

            context.SaveChanges();

            if (context.HomeContent.Count() == 0)
            {
                var content = new HomeContent
                {
                    title = "My Salty's Content 1",
                    content = "This is the content. Obviously it could be much longer and more meaningful",
                    backgroundImage = "",
                    createdBy = "",
                    createdOn = DateTime.Now
                };
                context.HomeContent.Add(content);
                content = new HomeContent
                {
                    title = "My Salty's Content 1",
                    content = "This is the content. Obviously it could be much longer and more meaningful",
                    backgroundImage = "",
                    createdBy = "",
                    createdOn = DateTime.Now
                };
                context.HomeContent.Add(content);
                content = new HomeContent
                {
                    title = "My Salty's Content 2",
                    content = "This is the content. Obviously it could be much longer and more meaningful",
                    backgroundImage = "",
                    createdBy = "",
                    createdOn = DateTime.Now
                };
                context.HomeContent.Add(content);
                content = new HomeContent
                {
                    title = "My Salty's Content 3",
                    content = "This is the content. Obviously it could be much longer and more meaningful",
                    backgroundImage = "",
                    createdBy = "",
                    createdOn = DateTime.Now
                };
                context.HomeContent.Add(content);
                content = new HomeContent
                {
                    title = "My Salty's Content 4",
                    content = "This is the content. Obviously it could be much longer and more meaningful",
                    backgroundImage = "",
                    createdBy = "",
                    createdOn = DateTime.Now
                };
                context.HomeContent.Add(content);
                content = new HomeContent
                {
                    title = "My Salty's Content 5",
                    content = "This is the content. Obviously it could be much longer and more meaningful",
                    backgroundImage = "",
                    createdBy = "",
                    createdOn = DateTime.Now
                };
            }

            context.SaveChanges();

        }
    }
}
