using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace EmployeePortal.Migrations
{
    public partial class massiveCleanup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Companies_HoursOfOperation_hoursOfOperationId",
                table: "Companies");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "AppointmentViewModels");

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
                name: "PatientService");

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
                name: "UserCategories");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Visits");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "ProductCategories");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Specials");

            migrationBuilder.DropTable(
                name: "ServiceCategories");

            migrationBuilder.DropTable(
                name: "Doctors");

            migrationBuilder.DropTable(
                name: "Pharmacies");

            migrationBuilder.DropTable(
                name: "HoursOfOperation");

            migrationBuilder.DropIndex(
                name: "IX_Companies_hoursOfOperationId",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "accentBrandingColour",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "hoursOfOperationId",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "minimumDuration",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "primaryBrandingColour",
                table: "Companies");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "accentBrandingColour",
                table: "Companies",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "hoursOfOperationId",
                table: "Companies",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "minimumDuration",
                table: "Companies",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "primaryBrandingColour",
                table: "Companies",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppointmentViewModels",
                columns: table => new
                {
                    AppointmentViewModelId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    end = table.Column<string>(nullable: true),
                    isSelection = table.Column<bool>(nullable: false),
                    resourceId = table.Column<string>(nullable: true),
                    start = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentViewModels", x => x.AppointmentViewModelId);
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
                name: "Clinics",
                columns: table => new
                {
                    clinicId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    addressId = table.Column<int>(nullable: true),
                    companyId = table.Column<int>(nullable: true),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clinics", x => x.clinicId);
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
                    packageProductsString = table.Column<string>(nullable: true),
                    retailPrice = table.Column<float>(nullable: false),
                    totalOfIndividualPrices = table.Column<string>(nullable: true)
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
                    code = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    retailPrice = table.Column<float>(nullable: false),
                    totalOfIndividualPrices = table.Column<string>(nullable: true)
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
                name: "Doctors",
                columns: table => new
                {
                    DoctorId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    addressId = table.Column<int>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    faxNumber = table.Column<string>(nullable: true),
                    firstName = table.Column<string>(nullable: true),
                    hoursOfOperationId = table.Column<int>(nullable: true),
                    lastName = table.Column<string>(nullable: true),
                    phoneNumber = table.Column<string>(nullable: true),
                    proTitle = table.Column<string>(nullable: true),
                    specialty = table.Column<string>(nullable: true),
                    website = table.Column<string>(nullable: true)
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
                    closeTime = table.Column<DateTime>(nullable: true),
                    closed = table.Column<bool>(nullable: false),
                    dayofweek = table.Column<string>(nullable: true),
                    hoursOfOperationId = table.Column<int>(nullable: true),
                    openTime = table.Column<DateTime>(nullable: true)
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
                    addressId = table.Column<int>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    faxNumber = table.Column<string>(nullable: true),
                    hoursOfOperationId = table.Column<int>(nullable: true),
                    labType = table.Column<string>(nullable: true),
                    name = table.Column<string>(nullable: true),
                    phoneNumber1 = table.Column<string>(nullable: true),
                    phoneNumber2 = table.Column<string>(nullable: true),
                    phoneNumber3 = table.Column<string>(nullable: true),
                    website = table.Column<string>(nullable: true)
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
                    addressId = table.Column<int>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    faxNumber = table.Column<string>(nullable: true),
                    hoursOfOperationId = table.Column<int>(nullable: true),
                    name = table.Column<string>(nullable: true),
                    phoneNumber1 = table.Column<string>(nullable: true),
                    phoneNumber2 = table.Column<string>(nullable: true),
                    phoneNumber3 = table.Column<string>(nullable: true),
                    website = table.Column<string>(nullable: true)
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
                    productCategoryId = table.Column<int>(nullable: false),
                    productCode = table.Column<string>(nullable: true),
                    quantity = table.Column<int>(nullable: false),
                    quantityInStock = table.Column<int>(nullable: false),
                    retailPrice = table.Column<float>(nullable: false),
                    usageDuration = table.Column<int>(nullable: false),
                    wholesalePrice = table.Column<float>(nullable: false)
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
                    SpecialId = table.Column<int>(nullable: true),
                    billingCode = table.Column<int>(nullable: false),
                    defaultDurationMinutes = table.Column<int>(nullable: false),
                    defaultPrice = table.Column<float>(nullable: false),
                    diagnosticCode = table.Column<int>(nullable: false),
                    governmentBilling = table.Column<bool>(nullable: false),
                    quantity = table.Column<int>(nullable: false),
                    serviceAltName = table.Column<string>(nullable: true),
                    serviceCategoryId = table.Column<int>(nullable: false),
                    serviceIDColour = table.Column<string>(nullable: true),
                    serviceName = table.Column<string>(nullable: true),
                    serviceRecProductsString = table.Column<string>(nullable: true),
                    serviceReqProductsString = table.Column<string>(nullable: true),
                    status = table.Column<bool>(nullable: false),
                    subType = table.Column<string>(nullable: true),
                    templateIcon = table.Column<string>(nullable: true)
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
                    End = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    Notes = table.Column<string>(nullable: true),
                    ParentId = table.Column<int>(nullable: false),
                    Recurrence = table.Column<int>(nullable: false),
                    StaffId = table.Column<int>(nullable: false),
                    Start = table.Column<DateTime>(nullable: false),
                    Title = table.Column<string>(nullable: true)
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
                name: "Patients",
                columns: table => new
                {
                    PatientId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    addressId = table.Column<int>(nullable: true),
                    birthDate = table.Column<string>(nullable: true),
                    clientId = table.Column<long>(nullable: false),
                    communicationPreference = table.Column<string>(nullable: true),
                    doctorId = table.Column<int>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    firstName = table.Column<string>(nullable: true),
                    gender = table.Column<string>(nullable: true),
                    homeNumber = table.Column<string>(nullable: true),
                    isPreferred = table.Column<bool>(nullable: false),
                    lastName = table.Column<string>(nullable: true),
                    mobileNumber = table.Column<string>(nullable: true),
                    nickName = table.Column<string>(nullable: true),
                    notesAndAlerts = table.Column<string>(nullable: true),
                    pharmacyId = table.Column<int>(nullable: true),
                    sendAppointmentNotifications = table.Column<bool>(nullable: false),
                    sendRetentionEmails = table.Column<bool>(nullable: false),
                    userId = table.Column<string>(nullable: true)
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
                    addressId = table.Column<int>(nullable: true),
                    birthDate = table.Column<string>(nullable: true),
                    clientId = table.Column<int>(nullable: false),
                    communicationPreference = table.Column<string>(nullable: true),
                    doctorId = table.Column<int>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    firstName = table.Column<string>(nullable: true),
                    gender = table.Column<string>(nullable: true),
                    homeNumber = table.Column<string>(nullable: true),
                    isPreferred = table.Column<bool>(nullable: false),
                    lastName = table.Column<string>(nullable: true),
                    mobileNumber = table.Column<string>(nullable: true),
                    nickName = table.Column<string>(nullable: true),
                    notesAndAlerts = table.Column<string>(nullable: true),
                    patientId = table.Column<long>(nullable: false),
                    pharmacyId = table.Column<int>(nullable: true),
                    sendAppointmentNotifications = table.Column<bool>(nullable: false),
                    sendRetentionEmails = table.Column<bool>(nullable: false)
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
                    PackageId = table.Column<int>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false)
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
                    SpecialId = table.Column<int>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false)
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
                    ServiceId = table.Column<int>(nullable: true),
                    name = table.Column<string>(nullable: true)
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
                    PackageId = table.Column<int>(nullable: false),
                    ServiceQuantity = table.Column<int>(nullable: false)
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
                    ServiceId = table.Column<int>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false)
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
                    ServiceId = table.Column<int>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false)
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
                    ServiceId = table.Column<int>(nullable: true),
                    roomName = table.Column<string>(nullable: true)
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
                name: "Visits",
                columns: table => new
                {
                    VisitId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    cancellationDate = table.Column<DateTime>(nullable: true),
                    cancellationReason = table.Column<string>(nullable: true),
                    cancelled = table.Column<bool>(nullable: false),
                    checkedIn = table.Column<bool>(nullable: false),
                    confirmed = table.Column<bool>(nullable: false),
                    createdBy = table.Column<string>(nullable: true),
                    date = table.Column<DateTime>(nullable: false),
                    isCancellationAlert = table.Column<bool>(nullable: false),
                    noShow = table.Column<bool>(nullable: false),
                    patientId = table.Column<int>(nullable: false),
                    patientNotes = table.Column<string>(nullable: true),
                    totalVisitCost = table.Column<float>(nullable: false),
                    visitIdString = table.Column<string>(nullable: true),
                    visitNotes = table.Column<string>(nullable: true)
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
                name: "PatientService",
                columns: table => new
                {
                    ServiceId = table.Column<int>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    PatientViewModelId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientService", x => new { x.ServiceId, x.PatientId });
                    table.ForeignKey(
                        name: "FK_PatientService_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "PatientId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientService_PatientViewModels_PatientViewModelId",
                        column: x => x.PatientViewModelId,
                        principalTable: "PatientViewModels",
                        principalColumn: "PatientViewModelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PatientService_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientSocialHistoryEntry",
                columns: table => new
                {
                    patientSocialHistoryEntryId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PatientId = table.Column<int>(nullable: true),
                    PatientViewModelId = table.Column<int>(nullable: true),
                    enteredBy = table.Column<string>(nullable: true),
                    entryDate = table.Column<DateTime>(nullable: false),
                    entryText = table.Column<string>(nullable: true)
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
                name: "Appointments",
                columns: table => new
                {
                    appointmentId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    allDay = table.Column<bool>(nullable: true),
                    backgroundColor = table.Column<string>(nullable: true),
                    borderColor = table.Column<string>(nullable: true),
                    cancellationDate = table.Column<DateTime>(nullable: true),
                    cancellationReason = table.Column<string>(nullable: true),
                    cancelled = table.Column<bool>(nullable: true),
                    className = table.Column<string>(nullable: true),
                    constraint = table.Column<string>(nullable: true),
                    durationEditable = table.Column<bool>(nullable: true),
                    editable = table.Column<bool>(nullable: true),
                    editing = table.Column<bool>(nullable: true),
                    end = table.Column<DateTime>(nullable: true),
                    isCancellationAlert = table.Column<bool>(nullable: true),
                    overlap = table.Column<bool>(nullable: true),
                    rendering = table.Column<string>(nullable: true),
                    resourceEditable = table.Column<bool>(nullable: true),
                    resourceId = table.Column<string>(nullable: true),
                    serviceId = table.Column<int>(nullable: true),
                    source = table.Column<string>(nullable: true),
                    start = table.Column<DateTime>(nullable: false),
                    startEditable = table.Column<bool>(nullable: true),
                    textColor = table.Column<string>(nullable: true),
                    title = table.Column<string>(nullable: true),
                    url = table.Column<string>(nullable: true),
                    visitId = table.Column<int>(nullable: false),
                    visitIdString = table.Column<string>(nullable: true)
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
                    VisitId = table.Column<int>(nullable: false),
                    ProductId = table.Column<int>(nullable: false),
                    Id = table.Column<int>(nullable: false),
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
                name: "IX_Companies_hoursOfOperationId",
                table: "Companies",
                column: "hoursOfOperationId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_serviceId",
                table: "Appointments",
                column: "serviceId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_visitId",
                table: "Appointments",
                column: "visitId");

            migrationBuilder.CreateIndex(
                name: "IX_ClinicRoom_RoomId",
                table: "ClinicRoom",
                column: "RoomId");

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
                name: "IX_PatientService_PatientId",
                table: "PatientService",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientService_PatientViewModelId",
                table: "PatientService",
                column: "PatientViewModelId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_HoursOfOperation_hoursOfOperationId",
                table: "Companies",
                column: "hoursOfOperationId",
                principalTable: "HoursOfOperation",
                principalColumn: "hoursOfOperationId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
