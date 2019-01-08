using Microsoft.EntityFrameworkCore.Migrations;

namespace EmployeePortal.Migrations
{
    public partial class addServicesToPatient : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateIndex(
                name: "IX_PatientService_PatientId",
                table: "PatientService",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientService_PatientViewModelId",
                table: "PatientService",
                column: "PatientViewModelId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientService");
        }
    }
}
