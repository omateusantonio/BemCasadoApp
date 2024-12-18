using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NamoreirosFinance.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangedDatePropertyName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(name: "date", table: "financial_entry", newName: "transaction_date");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
