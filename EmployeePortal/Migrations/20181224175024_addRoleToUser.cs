using Microsoft.EntityFrameworkCore.Migrations;

namespace EmployeePortal.Migrations
{
    public partial class addRoleToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_UserCategories_UserCategoryId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Clinics_AspNetUsers_UserId",
                table: "Clinics");

            migrationBuilder.DropIndex(
                name: "IX_Clinics_UserId",
                table: "Clinics");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_UserCategoryId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Clinics");

            migrationBuilder.DropColumn(
                name: "CanSetBreaks",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ServiceProvider",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserCategoryId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Clinics",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CanSetBreaks",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ServiceProvider",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserCategoryId",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clinics_UserId",
                table: "Clinics",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_UserCategoryId",
                table: "AspNetUsers",
                column: "UserCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_UserCategories_UserCategoryId",
                table: "AspNetUsers",
                column: "UserCategoryId",
                principalTable: "UserCategories",
                principalColumn: "UserCategoryId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Clinics_AspNetUsers_UserId",
                table: "Clinics",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
