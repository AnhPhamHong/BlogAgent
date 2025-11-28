using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgentCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWorkflowSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChatHistory",
                table: "Workflows",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Workflows",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Feedback",
                table: "Workflows",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tone",
                table: "Workflows",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChatHistory",
                table: "Workflows");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Workflows");

            migrationBuilder.DropColumn(
                name: "Feedback",
                table: "Workflows");

            migrationBuilder.DropColumn(
                name: "Tone",
                table: "Workflows");
        }
    }
}
