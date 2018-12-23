using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace EmployeePortal.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    AddressId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    address1 = table.Column<string>(nullable: true),
                    address2 = table.Column<string>(nullable: true),
                    city = table.Column<string>(nullable: true),
                    country = table.Column<string>(nullable: true),
                    postalCode = table.Column<string>(nullable: true),
                    province = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.AddressId);
                });

            migrationBuilder.CreateTable(
                name: "AppointmentViewModels",
                columns: table => new
                {
                    AppointmentViewModelId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    start = table.Column<string>(nullable: true),
                    end = table.Column<string>(nullable: true),
                    resourceId = table.Column<string>(nullable: true),
                    isSelection = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentViewModels", x => x.AppointmentViewModelId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ClinicProduct",
                columns: table => new
                {
                    ClinicProductId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    clinicId = table.Column<int>(nullable: false),
                    productId = table.Column<int>(nullable: false),
                    quantityInStock = table.Column<int>(nullable: false),
                    retailPrice = table.Column<float>(nullable: false),
                    wholesalePrice = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClinicProduct", x => x.ClinicProductId);
                });

            migrationBuilder.CreateTable(
                name: "HoursOfOperation",
                columns: table => new
                {
                    hoursOfOperationId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoursOfOperation", x => x.hoursOfOperationId);
                });

            migrationBuilder.CreateTable(
                name: "Packages",
                columns: table => new
                {
                    PackageId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true),
                    totalOfIndividualPrices = table.Column<string>(nullable: true),
                    retailPrice = table.Column<float>(nullable: false),
                    packageProductsString = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Packages", x => x.PackageId);
                });

            migrationBuilder.CreateTable(
                name: "ProductCategories",
                columns: table => new
                {
                    ProductCategoryId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategories", x => x.ProductCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Resources",
                columns: table => new
                {
                    ResourceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true),
                    resourceType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resources", x => x.ResourceId);
                });

            migrationBuilder.CreateTable(
                name: "ServiceCategories",
                columns: table => new
                {
                    ServiceCategoryId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceCategories", x => x.ServiceCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Specials",
                columns: table => new
                {
                    SpecialId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true),
                    code = table.Column<int>(nullable: false),
                    totalOfIndividualPrices = table.Column<string>(nullable: true),
                    retailPrice = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specials", x => x.SpecialId);
                });

            migrationBuilder.CreateTable(
                name: "Staff",
                columns: table => new
                {
                    StaffId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Staff", x => x.StaffId);
                });

            migrationBuilder.CreateTable(
                name: "Taxes",
                columns: table => new
                {
                    taxId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true),
                    value = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Taxes", x => x.taxId);
                });

            migrationBuilder.CreateTable(
                name: "UserCategories",
                columns: table => new
                {
                    UserCategoryId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    categoryName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCategories", x => x.UserCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    CompanyId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true),
                    contactName = table.Column<string>(nullable: true),
                    contactPhone = table.Column<string>(nullable: true),
                    primaryBrandingColour = table.Column<string>(nullable: true),
                    accentBrandingColour = table.Column<string>(nullable: true),
                    minimumDuration = table.Column<int>(nullable: false),
                    hoursOfOperationId = table.Column<int>(nullable: true),
                    timezone = table.Column<string>(nullable: true),
                    addressId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.CompanyId);
                    table.ForeignKey(
                        name: "FK_Companies_Addresses_addressId",
                        column: x => x.addressId,
                        principalTable: "Addresses",
                        principalColumn: "AddressId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Companies_HoursOfOperation_hoursOfOperationId",
                        column: x => x.hoursOfOperationId,
                        principalTable: "HoursOfOperation",
                        principalColumn: "hoursOfOperationId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Doctors",
                columns: table => new
                {
                    DoctorId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    proTitle = table.Column<string>(nullable: true),
                    firstName = table.Column<string>(nullable: true),
                    lastName = table.Column<string>(nullable: true),
                    phoneNumber = table.Column<string>(nullable: true),
                    faxNumber = table.Column<string>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    website = table.Column<string>(nullable: true),
                    hoursOfOperationId = table.Column<int>(nullable: true),
                    specialty = table.Column<string>(nullable: true),
                    addressId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctors", x => x.DoctorId);
                    table.ForeignKey(
                        name: "FK_Doctors_Addresses_addressId",
                        column: x => x.addressId,
                        principalTable: "Addresses",
                        principalColumn: "AddressId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Doctors_HoursOfOperation_hoursOfOperationId",
                        column: x => x.hoursOfOperationId,
                        principalTable: "HoursOfOperation",
                        principalColumn: "hoursOfOperationId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HoursOfOperationDays",
                columns: table => new
                {
                    hoursOfOperationDayId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    closed = table.Column<bool>(nullable: false),
                    dayofweek = table.Column<string>(nullable: true),
                    openTime = table.Column<DateTime>(nullable: true),
                    closeTime = table.Column<DateTime>(nullable: true),
                    hoursOfOperationId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoursOfOperationDays", x => x.hoursOfOperationDayId);
                    table.ForeignKey(
                        name: "FK_HoursOfOperationDays_HoursOfOperation_hoursOfOperationId",
                        column: x => x.hoursOfOperationId,
                        principalTable: "HoursOfOperation",
                        principalColumn: "hoursOfOperationId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Labs",
                columns: table => new
                {
                    LabId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true),
                    phoneNumber1 = table.Column<string>(nullable: true),
                    phoneNumber2 = table.Column<string>(nullable: true),
                    phoneNumber3 = table.Column<string>(nullable: true),
                    faxNumber = table.Column<string>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    website = table.Column<string>(nullable: true),
                    hoursOfOperationId = table.Column<int>(nullable: true),
                    labType = table.Column<string>(nullable: true),
                    addressId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Labs", x => x.LabId);
                    table.ForeignKey(
                        name: "FK_Labs_Addresses_addressId",
                        column: x => x.addressId,
                        principalTable: "Addresses",
                        principalColumn: "AddressId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Labs_HoursOfOperation_hoursOfOperationId",
                        column: x => x.hoursOfOperationId,
                        principalTable: "HoursOfOperation",
                        principalColumn: "hoursOfOperationId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Pharmacies",
                columns: table => new
                {
                    PharmacyId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true),
                    phoneNumber1 = table.Column<string>(nullable: true),
                    phoneNumber2 = table.Column<string>(nullable: true),
                    phoneNumber3 = table.Column<string>(nullable: true),
                    faxNumber = table.Column<string>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    website = table.Column<string>(nullable: true),
                    hoursOfOperationId = table.Column<int>(nullable: true),
                    addressId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pharmacies", x => x.PharmacyId);
                    table.ForeignKey(
                        name: "FK_Pharmacies_Addresses_addressId",
                        column: x => x.addressId,
                        principalTable: "Addresses",
                        principalColumn: "AddressId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pharmacies_HoursOfOperation_hoursOfOperationId",
                        column: x => x.hoursOfOperationId,
                        principalTable: "HoursOfOperation",
                        principalColumn: "hoursOfOperationId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true),
                    productCode = table.Column<string>(nullable: true),
                    quantityInStock = table.Column<int>(nullable: false),
                    retailPrice = table.Column<float>(nullable: false),
                    wholesalePrice = table.Column<float>(nullable: false),
                    quantity = table.Column<int>(nullable: false),
                    usageDuration = table.Column<int>(nullable: false),
                    productCategoryId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductId);
                    table.ForeignKey(
                        name: "FK_Products_ProductCategories_productCategoryId",
                        column: x => x.productCategoryId,
                        principalTable: "ProductCategories",
                        principalColumn: "ProductCategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    ServiceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    serviceName = table.Column<string>(nullable: true),
                    quantity = table.Column<int>(nullable: false),
                    billingCode = table.Column<int>(nullable: false),
                    serviceAltName = table.Column<string>(nullable: true),
                    defaultDurationMinutes = table.Column<int>(nullable: false),
                    subType = table.Column<string>(nullable: true),
                    diagnosticCode = table.Column<int>(nullable: false),
                    serviceIDColour = table.Column<string>(nullable: true),
                    templateIcon = table.Column<string>(nullable: true),
                    defaultPrice = table.Column<float>(nullable: false),
                    status = table.Column<bool>(nullable: false),
                    governmentBilling = table.Column<bool>(nullable: false),
                    serviceReqProductsString = table.Column<string>(nullable: true),
                    serviceRecProductsString = table.Column<string>(nullable: true),
                    serviceCategoryId = table.Column<int>(nullable: false),
                    SpecialId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.ServiceId);
                    table.ForeignKey(
                        name: "FK_Services_Specials_SpecialId",
                        column: x => x.SpecialId,
                        principalTable: "Specials",
                        principalColumn: "SpecialId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Services_ServiceCategories_serviceCategoryId",
                        column: x => x.serviceCategoryId,
                        principalTable: "ServiceCategories",
                        principalColumn: "ServiceCategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StaffSchedules",
                columns: table => new
                {
                    StaffScheduleId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(nullable: true),
                    ParentId = table.Column<int>(nullable: false),
                    Recurrence = table.Column<int>(nullable: false),
                    Notes = table.Column<string>(nullable: true),
                    Start = table.Column<DateTime>(nullable: false),
                    End = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    StaffId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffSchedules", x => x.StaffScheduleId);
                    table.ForeignKey(
                        name: "FK_StaffSchedules_Staff_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Staff",
                        principalColumn: "StaffId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PackageTax",
                columns: table => new
                {
                    PackageId = table.Column<int>(nullable: false),
                    TaxId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageTax", x => new { x.PackageId, x.TaxId });
                    table.ForeignKey(
                        name: "FK_PackageTax_Packages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "Packages",
                        principalColumn: "PackageId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PackageTax_Taxes_TaxId",
                        column: x => x.TaxId,
                        principalTable: "Taxes",
                        principalColumn: "taxId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecialTax",
                columns: table => new
                {
                    SpecialId = table.Column<int>(nullable: false),
                    TaxId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecialTax", x => new { x.SpecialId, x.TaxId });
                    table.ForeignKey(
                        name: "FK_SpecialTax_Specials_SpecialId",
                        column: x => x.SpecialId,
                        principalTable: "Specials",
                        principalColumn: "SpecialId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpecialTax_Taxes_TaxId",
                        column: x => x.TaxId,
                        principalTable: "Taxes",
                        principalColumn: "taxId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Avatar = table.Column<string>(nullable: true),
                    CanSetBreaks = table.Column<bool>(nullable: false),
                    ServiceProvider = table.Column<bool>(nullable: false),
                    UserCategoryId = table.Column<int>(nullable: true),
                    AddressId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUsers_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "AddressId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AspNetUsers_UserCategories_UserCategoryId",
                        column: x => x.UserCategoryId,
                        principalTable: "UserCategories",
                        principalColumn: "UserCategoryId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    PatientId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    clientId = table.Column<long>(nullable: false),
                    firstName = table.Column<string>(nullable: true),
                    lastName = table.Column<string>(nullable: true),
                    nickName = table.Column<string>(nullable: true),
                    birthDate = table.Column<string>(nullable: true),
                    gender = table.Column<string>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    homeNumber = table.Column<string>(nullable: true),
                    mobileNumber = table.Column<string>(nullable: true),
                    communicationPreference = table.Column<string>(nullable: true),
                    sendAppointmentNotifications = table.Column<bool>(nullable: false),
                    sendRetentionEmails = table.Column<bool>(nullable: false),
                    isPreferred = table.Column<bool>(nullable: false),
                    notesAndAlerts = table.Column<string>(nullable: true),
                    addressId = table.Column<int>(nullable: true),
                    doctorId = table.Column<int>(nullable: true),
                    pharmacyId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.PatientId);
                    table.ForeignKey(
                        name: "FK_Patients_Addresses_addressId",
                        column: x => x.addressId,
                        principalTable: "Addresses",
                        principalColumn: "AddressId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Patients_Doctors_doctorId",
                        column: x => x.doctorId,
                        principalTable: "Doctors",
                        principalColumn: "DoctorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Patients_Pharmacies_pharmacyId",
                        column: x => x.pharmacyId,
                        principalTable: "Pharmacies",
                        principalColumn: "PharmacyId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PatientViewModels",
                columns: table => new
                {
                    PatientViewModelId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    patientId = table.Column<long>(nullable: false),
                    clientId = table.Column<int>(nullable: false),
                    firstName = table.Column<string>(nullable: true),
                    lastName = table.Column<string>(nullable: true),
                    birthDate = table.Column<string>(nullable: true),
                    homeNumber = table.Column<string>(nullable: true),
                    mobileNumber = table.Column<string>(nullable: true),
                    nickName = table.Column<string>(nullable: true),
                    gender = table.Column<string>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    communicationPreference = table.Column<string>(nullable: true),
                    sendAppointmentNotifications = table.Column<bool>(nullable: false),
                    sendRetentionEmails = table.Column<bool>(nullable: false),
                    isPreferred = table.Column<bool>(nullable: false),
                    notesAndAlerts = table.Column<string>(nullable: true),
                    addressId = table.Column<int>(nullable: true),
                    doctorId = table.Column<int>(nullable: true),
                    pharmacyId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientViewModels", x => x.PatientViewModelId);
                    table.ForeignKey(
                        name: "FK_PatientViewModels_Addresses_addressId",
                        column: x => x.addressId,
                        principalTable: "Addresses",
                        principalColumn: "AddressId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PatientViewModels_Doctors_doctorId",
                        column: x => x.doctorId,
                        principalTable: "Doctors",
                        principalColumn: "DoctorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PatientViewModels_Pharmacies_pharmacyId",
                        column: x => x.pharmacyId,
                        principalTable: "Pharmacies",
                        principalColumn: "PharmacyId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PackageProduct",
                columns: table => new
                {
                    ProductId = table.Column<int>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    PackageId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageProduct", x => new { x.ProductId, x.PackageId });
                    table.ForeignKey(
                        name: "FK_PackageProduct_Packages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "Packages",
                        principalColumn: "PackageId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PackageProduct_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductTax",
                columns: table => new
                {
                    ProductId = table.Column<int>(nullable: false),
                    TaxId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductTax", x => new { x.ProductId, x.TaxId });
                    table.ForeignKey(
                        name: "FK_ProductTax_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductTax_Taxes_TaxId",
                        column: x => x.TaxId,
                        principalTable: "Taxes",
                        principalColumn: "taxId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecialProduct",
                columns: table => new
                {
                    ProductId = table.Column<int>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    SpecialId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecialProduct", x => new { x.ProductId, x.SpecialId });
                    table.ForeignKey(
                        name: "FK_SpecialProduct_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpecialProduct_Specials_SpecialId",
                        column: x => x.SpecialId,
                        principalTable: "Specials",
                        principalColumn: "SpecialId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Equipment",
                columns: table => new
                {
                    EquipmentId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true),
                    ServiceId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipment", x => x.EquipmentId);
                    table.ForeignKey(
                        name: "FK_Equipment_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PackageService",
                columns: table => new
                {
                    ServiceId = table.Column<int>(nullable: false),
                    ServiceQuantity = table.Column<int>(nullable: false),
                    PackageId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageService", x => new { x.ServiceId, x.PackageId });
                    table.ForeignKey(
                        name: "FK_PackageService_Packages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "Packages",
                        principalColumn: "PackageId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PackageService_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecommendedProduct",
                columns: table => new
                {
                    ProductId = table.Column<int>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    ServiceId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecommendedProduct", x => new { x.ProductId, x.ServiceId });
                    table.ForeignKey(
                        name: "FK_RecommendedProduct_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecommendedProduct_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RequiredProduct",
                columns: table => new
                {
                    ProductId = table.Column<int>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    ServiceId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequiredProduct", x => new { x.ProductId, x.ServiceId });
                    table.ForeignKey(
                        name: "FK_RequiredProduct_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RequiredProduct_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    roomId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    roomName = table.Column<string>(nullable: true),
                    ServiceId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.roomId);
                    table.ForeignKey(
                        name: "FK_Rooms_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ServiceTax",
                columns: table => new
                {
                    ServiceId = table.Column<int>(nullable: false),
                    TaxId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceTax", x => new { x.ServiceId, x.TaxId });
                    table.ForeignKey(
                        name: "FK_ServiceTax_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ServiceTax_Taxes_TaxId",
                        column: x => x.TaxId,
                        principalTable: "Taxes",
                        principalColumn: "taxId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StaffService",
                columns: table => new
                {
                    ServiceId = table.Column<int>(nullable: false),
                    StaffId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffService", x => new { x.ServiceId, x.StaffId });
                    table.ForeignKey(
                        name: "FK_StaffService_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StaffService_Staff_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Staff",
                        principalColumn: "StaffId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserCategoryService",
                columns: table => new
                {
                    ServiceId = table.Column<int>(nullable: false),
                    UserCategoryId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCategoryService", x => new { x.ServiceId, x.UserCategoryId });
                    table.ForeignKey(
                        name: "FK_UserCategoryService_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserCategoryService_UserCategories_UserCategoryId",
                        column: x => x.UserCategoryId,
                        principalTable: "UserCategories",
                        principalColumn: "UserCategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Clinics",
                columns: table => new
                {
                    clinicId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(nullable: true),
                    addressId = table.Column<int>(nullable: true),
                    companyId = table.Column<int>(nullable: true),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clinics", x => x.clinicId);
                    table.ForeignKey(
                        name: "FK_Clinics_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Clinics_Addresses_addressId",
                        column: x => x.addressId,
                        principalTable: "Addresses",
                        principalColumn: "AddressId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Clinics_Companies_companyId",
                        column: x => x.companyId,
                        principalTable: "Companies",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Visits",
                columns: table => new
                {
                    VisitId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    visitIdString = table.Column<string>(nullable: true),
                    visitNotes = table.Column<string>(nullable: true),
                    patientNotes = table.Column<string>(nullable: true),
                    cancellationReason = table.Column<string>(nullable: true),
                    isCancellationAlert = table.Column<bool>(nullable: false),
                    cancellationDate = table.Column<DateTime>(nullable: true),
                    cancelled = table.Column<bool>(nullable: false),
                    totalVisitCost = table.Column<float>(nullable: false),
                    checkedIn = table.Column<bool>(nullable: false),
                    confirmed = table.Column<bool>(nullable: false),
                    noShow = table.Column<bool>(nullable: false),
                    date = table.Column<DateTime>(nullable: false),
                    createdBy = table.Column<string>(nullable: true),
                    patientId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Visits", x => x.VisitId);
                    table.ForeignKey(
                        name: "FK_Visits_Patients_patientId",
                        column: x => x.patientId,
                        principalTable: "Patients",
                        principalColumn: "PatientId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientSocialHistoryEntry",
                columns: table => new
                {
                    patientSocialHistoryEntryId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    entryDate = table.Column<DateTime>(nullable: false),
                    enteredBy = table.Column<string>(nullable: true),
                    entryText = table.Column<string>(nullable: true),
                    PatientId = table.Column<int>(nullable: true),
                    PatientViewModelId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientSocialHistoryEntry", x => x.patientSocialHistoryEntryId);
                    table.ForeignKey(
                        name: "FK_PatientSocialHistoryEntry_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "PatientId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PatientSocialHistoryEntry_PatientViewModels_PatientViewModelId",
                        column: x => x.PatientViewModelId,
                        principalTable: "PatientViewModels",
                        principalColumn: "PatientViewModelId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClinicRoom",
                columns: table => new
                {
                    ClinicId = table.Column<int>(nullable: false),
                    RoomId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClinicRoom", x => new { x.ClinicId, x.RoomId });
                    table.ForeignKey(
                        name: "FK_ClinicRoom_Clinics_ClinicId",
                        column: x => x.ClinicId,
                        principalTable: "Clinics",
                        principalColumn: "clinicId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClinicRoom_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "roomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClinicTax",
                columns: table => new
                {
                    ClinicId = table.Column<int>(nullable: false),
                    TaxId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClinicTax", x => new { x.ClinicId, x.TaxId });
                    table.ForeignKey(
                        name: "FK_ClinicTax_Clinics_ClinicId",
                        column: x => x.ClinicId,
                        principalTable: "Clinics",
                        principalColumn: "clinicId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClinicTax_Taxes_TaxId",
                        column: x => x.TaxId,
                        principalTable: "Taxes",
                        principalColumn: "taxId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    appointmentId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    title = table.Column<string>(nullable: true),
                    allDay = table.Column<bool>(nullable: true),
                    start = table.Column<DateTime>(nullable: false),
                    end = table.Column<DateTime>(nullable: true),
                    url = table.Column<string>(nullable: true),
                    className = table.Column<string>(nullable: true),
                    editable = table.Column<bool>(nullable: true),
                    startEditable = table.Column<bool>(nullable: true),
                    durationEditable = table.Column<bool>(nullable: true),
                    resourceEditable = table.Column<bool>(nullable: true),
                    rendering = table.Column<string>(nullable: true),
                    overlap = table.Column<bool>(nullable: true),
                    constraint = table.Column<string>(nullable: true),
                    source = table.Column<string>(nullable: true),
                    backgroundColor = table.Column<string>(nullable: true),
                    borderColor = table.Column<string>(nullable: true),
                    textColor = table.Column<string>(nullable: true),
                    resourceId = table.Column<string>(nullable: true),
                    visitIdString = table.Column<string>(nullable: true),
                    cancellationReason = table.Column<string>(nullable: true),
                    isCancellationAlert = table.Column<bool>(nullable: true),
                    cancellationDate = table.Column<DateTime>(nullable: true),
                    cancelled = table.Column<bool>(nullable: true),
                    editing = table.Column<bool>(nullable: true),
                    serviceId = table.Column<int>(nullable: true),
                    visitId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.appointmentId);
                    table.ForeignKey(
                        name: "FK_Appointments_Services_serviceId",
                        column: x => x.serviceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointments_Visits_visitId",
                        column: x => x.visitId,
                        principalTable: "Visits",
                        principalColumn: "VisitId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VisitProducts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    VisitId = table.Column<int>(nullable: false),
                    ProductId = table.Column<int>(nullable: false),
                    Quantity = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitProducts", x => new { x.VisitId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_VisitProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VisitProducts_Visits_VisitId",
                        column: x => x.VisitId,
                        principalTable: "Visits",
                        principalColumn: "VisitId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_serviceId",
                table: "Appointments",
                column: "serviceId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_visitId",
                table: "Appointments",
                column: "visitId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_AddressId",
                table: "AspNetUsers",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_UserCategoryId",
                table: "AspNetUsers",
                column: "UserCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ClinicRoom_RoomId",
                table: "ClinicRoom",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Clinics_UserId",
                table: "Clinics",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Clinics_addressId",
                table: "Clinics",
                column: "addressId");

            migrationBuilder.CreateIndex(
                name: "IX_Clinics_companyId",
                table: "Clinics",
                column: "companyId");

            migrationBuilder.CreateIndex(
                name: "IX_ClinicTax_TaxId",
                table: "ClinicTax",
                column: "TaxId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_addressId",
                table: "Companies",
                column: "addressId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_hoursOfOperationId",
                table: "Companies",
                column: "hoursOfOperationId");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_addressId",
                table: "Doctors",
                column: "addressId");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_hoursOfOperationId",
                table: "Doctors",
                column: "hoursOfOperationId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_ServiceId",
                table: "Equipment",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_HoursOfOperationDays_hoursOfOperationId",
                table: "HoursOfOperationDays",
                column: "hoursOfOperationId");

            migrationBuilder.CreateIndex(
                name: "IX_Labs_addressId",
                table: "Labs",
                column: "addressId");

            migrationBuilder.CreateIndex(
                name: "IX_Labs_hoursOfOperationId",
                table: "Labs",
                column: "hoursOfOperationId");

            migrationBuilder.CreateIndex(
                name: "IX_PackageProduct_PackageId",
                table: "PackageProduct",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_PackageService_PackageId",
                table: "PackageService",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_PackageTax_TaxId",
                table: "PackageTax",
                column: "TaxId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_addressId",
                table: "Patients",
                column: "addressId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_doctorId",
                table: "Patients",
                column: "doctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_pharmacyId",
                table: "Patients",
                column: "pharmacyId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientSocialHistoryEntry_PatientId",
                table: "PatientSocialHistoryEntry",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientSocialHistoryEntry_PatientViewModelId",
                table: "PatientSocialHistoryEntry",
                column: "PatientViewModelId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientViewModels_addressId",
                table: "PatientViewModels",
                column: "addressId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientViewModels_doctorId",
                table: "PatientViewModels",
                column: "doctorId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientViewModels_pharmacyId",
                table: "PatientViewModels",
                column: "pharmacyId");

            migrationBuilder.CreateIndex(
                name: "IX_Pharmacies_addressId",
                table: "Pharmacies",
                column: "addressId");

            migrationBuilder.CreateIndex(
                name: "IX_Pharmacies_hoursOfOperationId",
                table: "Pharmacies",
                column: "hoursOfOperationId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_productCategoryId",
                table: "Products",
                column: "productCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTax_TaxId",
                table: "ProductTax",
                column: "TaxId");

            migrationBuilder.CreateIndex(
                name: "IX_RecommendedProduct_ServiceId",
                table: "RecommendedProduct",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_RequiredProduct_ServiceId",
                table: "RequiredProduct",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_ServiceId",
                table: "Rooms",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_SpecialId",
                table: "Services",
                column: "SpecialId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_serviceCategoryId",
                table: "Services",
                column: "serviceCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceTax_TaxId",
                table: "ServiceTax",
                column: "TaxId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialProduct_SpecialId",
                table: "SpecialProduct",
                column: "SpecialId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialTax_TaxId",
                table: "SpecialTax",
                column: "TaxId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffSchedules_StaffId",
                table: "StaffSchedules",
                column: "StaffId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffService_StaffId",
                table: "StaffService",
                column: "StaffId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCategoryService_UserCategoryId",
                table: "UserCategoryService",
                column: "UserCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_VisitProducts_ProductId",
                table: "VisitProducts",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Visits_patientId",
                table: "Visits",
                column: "patientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "AppointmentViewModels");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "ClinicProduct");

            migrationBuilder.DropTable(
                name: "ClinicRoom");

            migrationBuilder.DropTable(
                name: "ClinicTax");

            migrationBuilder.DropTable(
                name: "Equipment");

            migrationBuilder.DropTable(
                name: "HoursOfOperationDays");

            migrationBuilder.DropTable(
                name: "Labs");

            migrationBuilder.DropTable(
                name: "PackageProduct");

            migrationBuilder.DropTable(
                name: "PackageService");

            migrationBuilder.DropTable(
                name: "PackageTax");

            migrationBuilder.DropTable(
                name: "PatientSocialHistoryEntry");

            migrationBuilder.DropTable(
                name: "ProductTax");

            migrationBuilder.DropTable(
                name: "RecommendedProduct");

            migrationBuilder.DropTable(
                name: "RequiredProduct");

            migrationBuilder.DropTable(
                name: "Resources");

            migrationBuilder.DropTable(
                name: "ServiceTax");

            migrationBuilder.DropTable(
                name: "SpecialProduct");

            migrationBuilder.DropTable(
                name: "SpecialTax");

            migrationBuilder.DropTable(
                name: "StaffSchedules");

            migrationBuilder.DropTable(
                name: "StaffService");

            migrationBuilder.DropTable(
                name: "UserCategoryService");

            migrationBuilder.DropTable(
                name: "VisitProducts");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Clinics");

            migrationBuilder.DropTable(
                name: "Packages");

            migrationBuilder.DropTable(
                name: "PatientViewModels");

            migrationBuilder.DropTable(
                name: "Taxes");

            migrationBuilder.DropTable(
                name: "Staff");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Visits");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "ProductCategories");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Specials");

            migrationBuilder.DropTable(
                name: "ServiceCategories");

            migrationBuilder.DropTable(
                name: "UserCategories");

            migrationBuilder.DropTable(
                name: "Doctors");

            migrationBuilder.DropTable(
                name: "Pharmacies");

            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropTable(
                name: "HoursOfOperation");
        }
    }
}
